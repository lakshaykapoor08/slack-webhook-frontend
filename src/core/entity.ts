import { AxiosError, type AxiosResponse } from "axios";
import type { IService } from "./infrastructure";

export interface IHttpError {
  validationErrors?: IValidationError[];
  error?: string;
}

export interface IServerMultiLayerModelResponse<TResData> {
  role: { id: string; name: string };
  data: TResData;
  meta?: {
    pagination: {
      page: number;
      pageCount: number;
      perPage: number;
      totalCount: number;
    };
  };
  message?: string;
}

/**
 * if actual response of server is out of shape of IHttpListModelResponse(which may not happen!)(update: it happens! so we have IHttpFlatResponse now),
=======
 * then make new type and use it in desired repositories like this:
 * export type I-Rare-Response<TResData> = AxiosResponse<WHATEVER_TYPE<TResData>>;
 */
export type IHttpListModelResponse<TResData> = AxiosResponse<
  IServerMultiLayerModelResponse<TResData>
>;

export type IHttpDirectModelResponse<TResData> = AxiosResponse<TResData>;

/* DONT USE IT, we should not use enum for apis, we will remove this later, use EnumType instead */
export type EnumOption<TKey, AdditionalProps extends object = object> = ({
  key: TKey;
  title: string;
} & AdditionalProps)[];

export interface IValidationError {
  message: string;
  property: string;
}

export type MutationError = AxiosError<IHttpError>;

export type IRequest<TResData, TReqData = object> = (
  requestConfig: IService<TReqData>
) => Promise<TResData>;
