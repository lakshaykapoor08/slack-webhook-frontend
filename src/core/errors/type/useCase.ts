import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { IErrorAPIPayload, MutationResponse } from "./entity";
import type {
  IServerMultiLayerModelResponse,
  MutationError,
} from "@/core/entity";
import {
  getBadRequestError,
  getForbiddenError,
  getInternalServerError,
  getNotFoundError,
  getServiceUnavailableError,
  getTooManyRequestsError,
  getUnprocessableError,
} from "./repository";

export const useGetBadRequestError = (): UseMutationResult<
  IServerMultiLayerModelResponse<MutationResponse>,
  MutationError,
  IErrorAPIPayload,
  unknown
> => {
  return useMutation({
    mutationKey: errorKeys.bad_request_error(),
    mutationFn: (data: IErrorAPIPayload) => getBadRequestError(data),
  });
};

export const useGetForbiddenError = ({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<IServerMultiLayerModelResponse<MutationResponse>> => {
  return useQuery({
    queryKey: errorKeys.forbidden_error(),
    queryFn: () => getForbiddenError(),
    enabled,
  });
};

export const useGetNotFoundError = ({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<IServerMultiLayerModelResponse<MutationResponse>> => {
  return useQuery({
    queryKey: errorKeys.not_found_error(),
    queryFn: () => getNotFoundError(),
    enabled,
  });
};

export const useGetUnprocessableContentError = (): UseMutationResult<
  IServerMultiLayerModelResponse<MutationResponse>,
  MutationError,
  IErrorAPIPayload,
  unknown
> => {
  return useMutation({
    mutationKey: errorKeys.unprocessable_content_error(),
    mutationFn: (data: IErrorAPIPayload) => getUnprocessableError(data),
  });
};

export const useGetTooManyRequestsError = (): UseMutationResult<
  IServerMultiLayerModelResponse<MutationResponse>,
  MutationError,
  IErrorAPIPayload,
  unknown
> => {
  return useMutation({
    mutationKey: errorKeys.too_many_requests_error(),
    mutationFn: (data: IErrorAPIPayload) => getTooManyRequestsError(data),
  });
};

export const useGetInternalServerError = ({
  enabled,
}: {
  enabled: boolean;
}): UseQueryResult<IServerMultiLayerModelResponse<MutationResponse>> => {
  return useQuery({
    queryKey: errorKeys.internal_server_error(),
    queryFn: () => getInternalServerError(),
    enabled,
  });
};

export const useGetServiceUnavailableError = (): UseMutationResult<
  IServerMultiLayerModelResponse<MutationResponse>,
  MutationError,
  Omit<IErrorAPIPayload, "user_name">,
  unknown
> => {
  return useMutation({
    mutationKey: errorKeys.service_unavailable_error(),
    mutationFn: (email: Omit<IErrorAPIPayload, "user_name">) =>
      getServiceUnavailableError(email),
  });
};

export const errorKeys = {
  all: ["errors"] as const,
  bad_request_error: () => [...errorKeys.all, "bad_request_error"] as const,
  forbidden_error: () => [...errorKeys.all, "forbidden_error"] as const,
  not_found_error: () => [...errorKeys.all, "not_found_error"] as const,
  unprocessable_content_error: () =>
    [...errorKeys.all, "unprocessable_content_error"] as const,
  too_many_requests_error: () =>
    [...errorKeys.all, "too_many_requests_error"] as const,
  internal_server_error: () =>
    [...errorKeys.all, "internal_server_error"] as const,
  service_unavailable_error: () =>
    [...errorKeys.all, "internal_server_error"] as const,
};
