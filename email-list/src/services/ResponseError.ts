export type ResponseError = {error: string};

export function isResponseError(response: ResponseError | any): response is ResponseError {
  return (response as ResponseError).error !== undefined;
}