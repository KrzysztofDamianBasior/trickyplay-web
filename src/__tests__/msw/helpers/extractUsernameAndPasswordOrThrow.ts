import { HttpResponse } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function extractUsernameAndPasswordOrThrow({
  formData,
  path,
}: {
  formData: FormData;
  path: string;
}) {
  let username = formData.get("username");
  let password = formData.get("password");

  if (username && password) {
    username = username as string; // FormData.get() returns a value of type string | File | null.
    password = password as string;
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
    username: username as string,
    password: password as string,
  };
}
