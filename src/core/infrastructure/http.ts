import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type RawAxiosRequestConfig,
} from "axios";
import { axiosToCurl, findRouteByPathname } from "./utils";

// Function to get Slack configuration from sessionStorage. or global window object
const getSlackConfig = () => {
  // First try to get from global window object (set by component)
  const globalConfig = (window as any).slackConfig;
  if (globalConfig?.channel && globalConfig?.webhookUrl) {
    return globalConfig;
  }

  // Fallback to sessionStorage.
  const channel = sessionStorage.getItem("slack_channel");
  const webhookUrl = sessionStorage.getItem("slack_webhook_url");

  if (channel && webhookUrl) {
    return { channel, webhookUrl };
  }

  return null;
};

const http = <TReqData, TResData>(
  requestConfig: RawAxiosRequestConfig<TReqData>
): Promise<TResData> => {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
  });

  responseInterceptors(axiosInstance);

  return axiosInstance(requestConfig);
};

const responseInterceptors = (axiosInstance: AxiosInstance) => {
  // Enhanced response interceptor for error handling and Slack notification
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const baseUrl = import.meta.env.VITE_BASE_URL as string;
      console.log(error, "error");
      const errorStatus = error.response?.status;
      const isErrorStatus =
        errorStatus &&
        [400, 403, 404, 422, 429, 500, 503].includes(errorStatus);

      // Get dynamic Slack configuration
      const slackConfig = getSlackConfig();

      if (
        baseUrl === "https://slack-webhook-demo-orpin.vercel.app" &&
        isErrorStatus &&
        slackConfig // Only send if Slack is configured
      ) {
        console.log("🚨 Triggering Slack webhook for error:", errorStatus);
        console.log("Base URL:", baseUrl);
        console.log("Error response:", error.response?.data);
        console.log("Slack Config:", slackConfig);

        try {
          const curlCommand = axiosToCurl(error.config!);
          const frontPageRouteObject = findRouteByPathname(
            window?.location?.pathname ?? ""
          );

          const slackUsername = `${
            errorStatus || "No Code"
          } Error - Slack Webhook Demo`;

          const slackText = `:large_blue_circle: *${
            frontPageRouteObject?.meta?.metaTitle ?? "Unknown"
          } Page* \n:large_purple_circle: *${slackUsername}* \n:large_yellow_circle: *API CALL*: \`${
            error?.config?.url! ?? "Unknown"
          }\` \n:red_circle: *PANEL PAGE URL*: \`${
            window?.location?.pathname ?? "Unknown"
          }\` \n:black_circle: *METHOD*: \`${
            error?.config?.method?.toUpperCase() ?? "Unknown"
          }\` \n:large_brown_circle: *TIMESTAMP*: \`${new Date().toISOString()}\` \n*Request Curl:* \`\`\`${curlCommand}\`\`\` \n*Response:* \`\`\`${JSON.stringify(
            error?.response?.data || {},
            null,
            2
          )}\`\`\``;

          const payload = {
            channel: slackConfig.channel, // Use dynamic channel
            username: slackUsername,
            text: slackText,
            icon_emoji: ":warning:",
          };

          // Use dynamic webhook URL
          await axios.post(
            slackConfig.webhookUrl,
            `payload=${encodeURIComponent(JSON.stringify(payload))}`
          );

          console.log("✅ Slack notification sent successfully");
        } catch (slackError) {
          console.error("❌ Failed to send Slack notification:", slackError);
        }
      } else if (isErrorStatus && !slackConfig) {
        console.log("⚠️ Error occurred but Slack is not configured");
      }

      return Promise.reject(error);
    }
  );
};

export default http;
