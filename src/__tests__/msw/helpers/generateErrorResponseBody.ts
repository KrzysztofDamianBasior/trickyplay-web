import {
  BadRequest400ResponseType,
  Forbidden403ResponseType,
  InternalServerError500ResponseType,
  NotFound404ResponseType,
  Unauthorized401ResponseType,
} from "../dtos/Errors";

// overload signatures
function generateErrorResponseBody(
  error: "Unauthorized",
  path: string,
  message: string
): Unauthorized401ResponseType;
function generateErrorResponseBody(
  error: "Not Found",
  path: string,
  message: string
): NotFound404ResponseType;
function generateErrorResponseBody(
  error: "Internal Server Error",
  path: string,
  message: string
): InternalServerError500ResponseType;
function generateErrorResponseBody(
  error: "Forbidden",
  path: string,
  message: string
): Forbidden403ResponseType;
function generateErrorResponseBody(
  error: "Bad Request",
  path: string,
  message: string
): BadRequest400ResponseType;
function generateErrorResponseBody(
  error:
    | "Unauthorized"
    | "Not Found"
    | "Internal Server Error"
    | "Forbidden"
    | "Bad Request",
  path: string,
  message: string
) {
  const date = new Date();

  switch (error) {
    case "Bad Request":
      return {
        error: "Bad Request",
        message,
        path,
        status: 400,
        timestamp: date.toISOString(),
      } as BadRequest400ResponseType;
    case "Forbidden":
      return {
        error: "Forbidden",
        message,
        path,
        status: 403,
        timestamp: date.toISOString(),
      } as Forbidden403ResponseType;
    case "Internal Server Error":
      return {
        error: "Internal Server Error",
        message,
        path,
        status: 500,
        timestamp: date.toISOString(),
      } as InternalServerError500ResponseType;
    case "Not Found":
      return {
        error: "Not Found",
        message,
        path,
        status: 404,
        timestamp: date.toISOString(),
      } as NotFound404ResponseType;
    case "Unauthorized":
      return {
        error: "Unauthorized",
        message,
        path,
        status: 401,
        timestamp: date.toISOString(),
      } as Unauthorized401ResponseType;
  }
}

export default generateErrorResponseBody;
