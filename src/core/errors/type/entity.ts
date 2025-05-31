export interface MutationResponse {
  status: string;
  statusCode: number;
  message: string;
  data: unknown[];
}

export interface IErrorAPIPayload {
  user_name: string;
  email: string;
}
