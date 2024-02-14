import { DefaultBodyType, HttpResponse, StrictRequest } from "msw";
import { Unauthorized401ResponseType } from "../../../shared/resources/externalApiRepresentation/Errors";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function isAuthenticated(
  request: StrictRequest<DefaultBodyType>,
  path: string
) {
  if (!request.headers.get("Authorization")?.startsWith("Bearer")) {
    const responseBody: Unauthorized401ResponseType = generateErrorResponseBody(
      "Unauthorized",
      path,
      "unauthorized"
    );
    // You can throw a Response instance at any point in the response resolver. When that happens, the request handling short-circuits, and the thrown response is returned as the mocked response. This is particularly handy to implement a middleware pattern when handling requests. Note that any non-response exceptions will be translated to 500 Internal Server Error responses, similar to an unhandled rejection happening on server runtime.
    throw HttpResponse.json(responseBody, { status: 400 });
  }
}
