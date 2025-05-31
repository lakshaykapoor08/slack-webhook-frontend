import type { RawAxiosRequestConfig } from "axios";
import type { IService } from "../infrastructure";
import http from "../infrastructure/http";

const request = async <TResData, TReqData = object>({
  method = "GET",
  apiVersion = "v1",
  relativePath,
  data,
  headers,
  params,
  responseType,
  signal,
  onUploadProgress,
}: IService<TReqData>): Promise<TResData> => {
  const errorPath = "/error";
  const httpRequest: RawAxiosRequestConfig<TReqData> = {
    data,
    method,
    headers: { ...headers },
    params,
    url: "/api/" + apiVersion + errorPath + relativePath,
    responseType,
    signal: signal,
    onUploadProgress,
  };
  return http<TReqData, TResData>(httpRequest);
};

export default request;
