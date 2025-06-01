import { AMO } from "@/core";
import type { IErrorAPIPayload } from "@/core/errors/type";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "@/utils/storageKeys";
import { Button, Input, Card, Space, Divider, message } from "antd";
import { useState, useEffect } from "react";

const RenderAPIs = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageAPI, contextHolder] = message.useMessage();

  // Slack configuration state
  const [slackChannel, setSlackChannel] = useState<string>("#errors-stg");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>("");
  const [isSlackConfigured, setIsSlackConfigured] = useState<boolean>(false);

  // Initialize hooks for queries (these are enabled by default)
  const forbiddenQuery = AMO.errors.type.useGetForbiddenError({
    enabled: false,
  });
  const notFoundQuery = AMO.errors.type.useGetNotFoundError({
    enabled: false,
  });
  const internalServerQuery = AMO.errors.type.useGetInternalServerError({
    enabled: false,
  });

  // Initialize hooks for mutations
  const badRequestMutation = AMO.errors.type.useGetBadRequestError();
  const unprocessableMutation =
    AMO.errors.type.useGetUnprocessableContentError();
  const tooManyRequestsMutation = AMO.errors.type.useGetTooManyRequestsError();
  const serviceUnavailableMutation =
    AMO.errors.type.useGetServiceUnavailableError();

  const statusCodes = [
    {
      code: 400,
      method: "POST",
      label: "400 Bad Request",
      type: "mutation" as const,
      hook: badRequestMutation,
    },
    {
      code: 403,
      method: "GET",
      label: "403 Forbidden",
      type: "query" as const,
      hook: forbiddenQuery,
    },
    {
      code: 404,
      method: "GET",
      label: "404 Not Found",
      type: "query" as const,
      hook: notFoundQuery,
    },
    {
      code: 422,
      method: "PUT",
      label: "422 Unprocessable",
      type: "mutation" as const,
      hook: unprocessableMutation,
    },
    {
      code: 429,
      method: "PATCH",
      label: "429 Too Many Requests",
      type: "mutation" as const,
      hook: tooManyRequestsMutation,
    },
    {
      code: 500,
      method: "GET",
      label: "500 Internal Server",
      type: "query" as const,
      hook: internalServerQuery,
    },
    {
      code: 503,
      method: "DELETE",
      label: "503 Service Unavailable",
      type: "mutation" as const,
      hook: serviceUnavailableMutation,
    },
  ];

  // Load saved configuration from sessionStorage on component mount
  useEffect(() => {
    const savedChannel = getSessionStorage<string>("slack_channel");
    const savedWebhookUrl = getSessionStorage<string>("slack_webhook_url");

    if (savedChannel) setSlackChannel(savedChannel);
    if (savedWebhookUrl) {
      setSlackWebhookUrl(savedWebhookUrl);
      setIsSlackConfigured(true);
    }
  }, []);

  // Save Slack configuration and update global variables
  const saveSlackConfiguration = () => {
    if (!slackChannel.trim() || !slackWebhookUrl.trim()) {
      messageAPI.warning("Please enter both channel name and webhook URL.");
      return;
    }

    setSessionStorage("slack_channel", slackChannel);
    setSessionStorage("slack_webhook_url", slackWebhookUrl);

    (window as any).slackConfig = {
      channel: slackChannel,
      webhookUrl: slackWebhookUrl,
    };

    setIsSlackConfigured(true);
    messageAPI.success("Your Slack channel and webhook URL have been stored.");
  };

  const clearSlackConfiguration = () => {
    removeSessionStorage("slack_channel");
    removeSessionStorage("slack_webhook_url");
    delete (window as any).slackConfig;
    setSlackChannel("#errors-stg");
    setSlackWebhookUrl("");
    setIsSlackConfigured(false);
    messageAPI.success("Your Slack channel and webhook URL have been cleared.");
  };

  const handleSuccess = (data: any) => {
    setResponse(data?.message || JSON.stringify(data) || "Request successful");
    setError(null);
  };

  const handleError = (err: any) => {
    setError(
      err?.message || err?.response?.data?.message || "An error occurred"
    );
    setResponse(null);
  };

  const handleApiCall = (index: number) => {
    setResponse(null);
    setError(null);

    const { type, hook, code } = statusCodes[index];

    if (type === "query") {
      hook
        .refetch()
        .then((result: any) => {
          if (result.isSuccess && result.data) {
            handleSuccess(result.data);
          } else if (result.isError) {
            handleError(result.error);
          }
        })
        .catch((err: any) => {
          handleError(err);
        });
    } else {
      const data: IErrorAPIPayload = {
        user_name: "Himanshu Kumar",
        email: "himanshu064@gmail.com",
      };
      if (code === 503) {
        hook.mutate(data, {
          onSuccess: handleSuccess,
          onError: handleError,
        });
      } else {
        hook.mutate(data, {
          onSuccess: handleSuccess,
          onError: handleError,
        });
      }
    }
  };

  return (
    <div className="p-4 w-full mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        API Error Response Tester
      </h1>
      {contextHolder}
      {/* Slack Configuration Section */}
      <Card title="Slack Configuration" className="mb-6">
        <Space direction="vertical" className="w-full !p-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              Slack Channel Name:
            </label>
            <Input
              placeholder="e.g., #errors-stg"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              className="mb-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slack Webhook URL:
            </label>
            <Input.Password
              placeholder="https://hooks.slack.com/services/..."
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
              className="mb-3"
            />
          </div>

          <Space className="flex md:flex-row flex-col gap-2">
            <Button
              className="break-words whitespace-pre-wrap"
              type="primary"
              onClick={saveSlackConfiguration}
              disabled={!slackChannel.trim() || !slackWebhookUrl.trim()}
            >
              Save Configuration
            </Button>
            <Button
              danger
              onClick={clearSlackConfiguration}
              disabled={!isSlackConfigured}
            >
              Clear Configuration
            </Button>
          </Space>

          {isSlackConfigured && (
            <div className="text-green-600 text-sm mt-2">
              ✅ Slack configuration is active
            </div>
          )}
        </Space>
      </Card>

      <Divider />

      {/* API Testing Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {statusCodes.map(({ code, label, type, hook }, index) => {
          const isLoading =
            type === "query"
              ? hook.isFetching || hook.isLoading
              : hook.isPending;

          return (
            <Button
              color="blue"
              variant="solid"
              key={code}
              onClick={() => handleApiCall(index)}
              disabled={isLoading}
              className="!px-4 !py-4"
            >
              {isLoading ? "Loading..." : label}
            </Button>
          );
        })}
      </div>

      {response && (
        <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
          <strong>Response:</strong> {response}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!isSlackConfigured && (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded mt-4">
          <strong>Note:</strong> Configure Slack settings above to receive
          webhook notifications when errors occur.
        </div>
      )}
    </div>
  );
};

export default RenderAPIs;
