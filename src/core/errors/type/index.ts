import {
  errorKeys,
  useGetBadRequestError,
  useGetForbiddenError,
  useGetInternalServerError,
  useGetNotFoundError,
  useGetServiceUnavailableError,
  useGetTooManyRequestsError,
  useGetUnprocessableContentError,
} from "./useCase";

export const type = {
  keys: errorKeys,
  useGetBadRequestError,
  useGetForbiddenError,
  useGetInternalServerError,
  useGetNotFoundError,
  useGetServiceUnavailableError,
  useGetTooManyRequestsError,
  useGetUnprocessableContentError,
};

export * from "./entity";
