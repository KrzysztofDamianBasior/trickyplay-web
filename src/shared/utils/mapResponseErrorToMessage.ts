import { AxiosError } from "axios";

/**
 * Generate a message based on the error status code
 * @param err
 * @returns message
 */
export const mapResponseErrorToMessage = (
  err: AxiosError
): ErrorMessageKind => {
  if (err.response?.status === 400) {
    return "Bad request";
  } else if (err.response?.status === 401) {
    // actually unauthorized, but unauthenticated is more correct
    return "Unauthenticated";
  } else if (err.response?.status === 404) {
    return "Not found";
  } else if (err.response?.status === 403) {
    return "Lack of sufficient permissions";
  } else if (err.response?.status === 500) {
    return "Internal server error";
  } else {
    return "Network error";
  }
};

// I prefer union types to enums
export type ErrorMessageKind =
  | "Bad request"
  | "Lack of sufficient permissions"
  | "Unauthenticated"
  | "Network error"
  | "Internal server error"
  | "Not found";
