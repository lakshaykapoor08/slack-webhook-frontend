import { type RawAxiosRequestConfig, type ResponseType } from "axios";

type ApiVersion = "" | "v1";

export interface IService<TData = object> extends RawAxiosRequestConfig<TData> {
  relativePath?: string;
  apiVersion?: ApiVersion;
  headers?: Record<string, string>;
  params?: Record<string, string | undefined> | URLSearchParams | object;
  responseType?: ResponseType;
}
