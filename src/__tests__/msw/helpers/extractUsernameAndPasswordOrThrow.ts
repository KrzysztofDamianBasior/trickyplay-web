/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function extractUsernameAndPasswordOrThrow<
  RequestBody extends { username: string; password: string }
>({ jsonRequestBody, path }: { jsonRequestBody: RequestBody; path: string }) {
  const username = jsonRequestBody["username"];
  const password = jsonRequestBody["password"];

  if (username && password) {
    if (!new RegExp("^[a-zA-Z0-9_]{2,16}$").test(username)) {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          path,
          "Username must contain between 2 and 16 characters. It can only consist of underscores, numbers, lowercase and uppercase letters."
        )
      );
    }
    if (!new RegExp("^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$").test(password)) {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          path,
          "Password must contain between 4 and 32 characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters."
        )
      );
    }
  }
  return {
    username: username,
    password: password,
  };
}
