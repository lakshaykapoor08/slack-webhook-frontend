import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      retry: 0,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      throwOnError: (error) => {
        if (import.meta.env.DEV)
          console.error("QueryClient.throwOnError", error);
        if (axios.isAxiosError(error)) {
          if (!import.meta.env.DEV) {
            Modal.error({
              title: `${error.response?.status} ERROR!`,
              content: (
                <div>
                  <style>{`.ant-modal-mask {background-color: #041375!important;}`}</style>
                  <div>URL</div>
                  <pre>{JSON.stringify(error.request?.responseURL)}</pre>
                  <div>Response:</div>
                  <pre>{JSON.stringify(error.response?.data)}</pre>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => (window.location.href = "/")}
                    >
                      Go to Home
                    </button>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              ),
              footer: null,
              closable: false,
            });
          }
        }
        return false;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (import.meta.env.DEV) console.error("QueryCache.onError", error);

      if (axios.isAxiosError(error)) {
        if (!import.meta.env.DEV) {
          Modal.error({
            title: `${error.response?.status} ERROR!`,
            content: (
              <div>
                <style>{`.ant-modal-mask {background-color: #041375!important;}`}</style>
                <div>URL</div>
                <pre>{JSON.stringify(error.request?.responseURL)}</pre>
                <div>Response:</div>
                <pre>{JSON.stringify(error.response?.data)}</pre>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go to Home
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ),
            footer: null,
            closable: false,
          });
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (!import.meta.env.DEV) {
          Modal.error({
            title: `${error.response?.status} ERROR!`,
            content: (
              <div>
                <style>{`.ant-modal-mask {background-color: #041375!important;}`}</style>
                <div>URL</div>
                <pre>{JSON.stringify(error.request?.responseURL)}</pre>
                <div>Response:</div>
                <pre>{JSON.stringify(error.response?.data)}</pre>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go to Home
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ),
            footer: null,
            closable: false,
          });
        }
      }

      if (import.meta.env.DEV) console.error("MutationCache.onError", error);
    },
  }),
});
