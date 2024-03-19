import { HttpResponse } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function extractParentCommentId(url: URL) {
  if (/^[1-9]\d*$/.test(url.searchParams.get("parentCommentId") as string)) {
    return parseInt(url.searchParams.get("parentCommentId") as string);
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        url.pathname,
        "invalid parentCommentId"
      )
    );
  }
}
