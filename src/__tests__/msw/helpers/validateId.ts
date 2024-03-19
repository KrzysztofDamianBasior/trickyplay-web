import { HttpResponse } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function validateId({ id, path }: { id: string; path: string }) {
  if (!/^[1-9]\d*$/.test(id)) {
    throw HttpResponse.json(
      generateErrorResponseBody("Bad Request", path, "invalid id")
    );
  }
}
