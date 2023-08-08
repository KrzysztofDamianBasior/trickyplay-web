/**
 * Generate a message based on the error status code
 * @param err
 * @returns message
 */
export const mapResponseErrorToMessage = (err: any): ErrorMessageKind => {
  if (!err?.response) {
    return "No Server Response";
  } else if (err.response?.status === 400) {
    return "Missing Username or Password";
  } else if (err.response?.status === 401) {
    return "Unauthorized";
  } else if (err.response?.status === 404) {
    return "Not Found";
  } else {
    return "Request Failed";
  }
};

// I prefer union types to enums
export type ErrorMessageKind =
  | "No Server Response"
  | "Missing Username or Password"
  | "Unauthorized"
  | "Request Failed"
  | "Not Found";
