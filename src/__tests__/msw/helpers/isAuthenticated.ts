import { DefaultBodyType, HttpResponse, StrictRequest } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";
import { Unauthorized401ResponseType } from "../../../shared/models/externalApiRepresentation/Errors";

export function isAuthenticated(
  request: StrictRequest<DefaultBodyType>,
  path: string
): string {
  if (request.headers.get("Authorization")?.startsWith("Bearer ")) {
    return request.headers.get("Authorization")?.split(" ")[1] as string;
  } else {
    const responseBody: Unauthorized401ResponseType = generateErrorResponseBody(
      "Unauthorized",
      path,
      "unauthorized"
    );
    // You can throw a Response instance at any point in the response resolver. When that happens, the request handling short-circuits, and the thrown response is returned as the mocked response. This is particularly handy to implement a middleware pattern when handling requests. Note that any non-response exceptions will be translated to 500 Internal Server Error responses, similar to an unhandled rejection happening on server runtime.
    throw HttpResponse.json(responseBody, { status: 400 });
  }
}
