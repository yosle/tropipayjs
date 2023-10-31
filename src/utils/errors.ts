import { AxiosError, AxiosResponse } from "axios";

const ErrorType = {
  VALIDATION_ERROR: "VALIDATION_ERROR", // 400
  UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR", // 401 (Not valid credentials)
  FORBIDDEN_ERROR: "FORBIDDEN_ERROR", // 403 (Valid credentials but insufficient to grant access)
  NOT_FOUND: "NOT_FOUND", // 404
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR", // 429 (Used only in cloudflare for now)
  OPERATION_ERROR: "OPERATION_ERROR", // 500
} as const;

const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  FORBIDDEN_ERROR: "FORBIDDEN_ERROR",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  OPERATION_ERROR: "OPERATION_ERROR",
  SYNTAX_ERROR: "SYNTAX_ERROR",
  INVALID_PARAM: "INVALID_PARAM",
  UNHANDLED_ERROR: "SERVER_ERROR",
} as const;

export interface ErrorDetail {
  param: string;
  value: string | number | null;
  msg: string;
  code: string;
  location: string | null;
  meta: unknown;
}
export function handleExceptions(
  error: AxiosError | Error
): TropipayJSException {
  if (error instanceof AxiosError) {
    if (error.response) {
      const axiosResponse: AxiosResponse = error.response;
      const errorMessage =
        axiosResponse.data?.error?.message || "An error occurred";

      switch (axiosResponse.status) {
        case 401:
          return new TropipayJSException(
            errorMessage,
            axiosResponse.status,
            axiosResponse.data.error
          );
        case 403:
          return new TropipayJSException(
            errorMessage,
            axiosResponse.status,
            axiosResponse.data.error
          );
        case 404:
          return new TropipayJSException(
            errorMessage,
            axiosResponse.status,
            axiosResponse.data.error
          );
        // case 429:
        //   return new TooManyRequestsException(errorMessage);
        default:
          return new TropipayJSException(
            errorMessage,
            axiosResponse.status,
            axiosResponse.data.error
          );
      }
    } else if (error.request) {
      // Axios request was made but no response received (e.g., network error)
      return new TropipayJSException(
        "Request failed: No response received",
        500,
        null
      );
    } else {
      // Something else went wrong
      return new TropipayJSException("An error occurred", 500, null);
    }
  } else {
    return new TropipayJSException(`jsbfvbsfvbf`, 500, null);
  }
}

class TropipayJSException extends Error {
  code: number; // Status code
  error: unknown;
  message: string;
  constructor(message: string, code: number, data: unknown) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TropipayJSException.prototype);
    this.code = code;
    this.error = data;
    this.message = message;
  }
}
