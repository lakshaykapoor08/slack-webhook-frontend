import { type IServerMultiLayerModelResponse } from "@/core/entity";
import request from "../request";
import type { IErrorAPIPayload, MutationResponse } from "./entity";

export const getBadRequestError = async (
  data: IErrorAPIPayload
): Promise<IServerMultiLayerModelResponse<MutationResponse>> => {
  const config = {
    data,
    method: "POST",
    relativePath: "/400",
  };
  return await request<IServerMultiLayerModelResponse<MutationResponse>>(
    config
  );
};

export const getForbiddenError = async (): Promise<
  IServerMultiLayerModelResponse<MutationResponse>
> => {
  const config = {
    relativePath: "/403",
  };
  return await request<IServerMultiLayerModelResponse<MutationResponse>>(
    config
  );
};

export const getNotFoundError = async () => {
  const config = {
    relativePath: "/404",
  };
  return await request<IServerMultiLayerModelResponse<any>>(config).then(
    (res) => res.data
  );
};

export const getUnprocessableError = async (
  data: IErrorAPIPayload
): Promise<IServerMultiLayerModelResponse<MutationResponse>> => {
  const config = {
    data,
    method: "PUT",
    relativePath: "/422",
  };
  return await request<IServerMultiLayerModelResponse<MutationResponse>>(
    config
  );
};

export const getTooManyRequestsError = async (
  data: IErrorAPIPayload
): Promise<IServerMultiLayerModelResponse<MutationResponse>> => {
  const config = {
    data,
    method: "PATCH",
    relativePath: "/429",
  };
  return await request<IServerMultiLayerModelResponse<MutationResponse>>(
    config
  );
};

export const getInternalServerError = async () => {
  const config = {
    relativePath: "/500",
  };
  return await request<IServerMultiLayerModelResponse<any>>(config).then(
    (res) => res.data
  );
};

export const getServiceUnavailableError = async (
  email: Omit<IErrorAPIPayload, "user_name">
): Promise<IServerMultiLayerModelResponse<MutationResponse>> => {
  const config = {
    data: { email },
    method: "DELETE",
    relativePath: "/503",
  };
  return await request<IServerMultiLayerModelResponse<MutationResponse>>(
    config
  );
};
