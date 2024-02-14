import { http, HttpResponse } from "msw";

import fs from "node:fs";
import path from "node:path";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";

import { TPUserRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import { DeleteAccountResponse } from "../../../shared/models/externalApiRepresentation/Responses";
import { EditAccountRequest } from "../../../shared/models/externalApiRepresentation/Requests";
import {
  BadRequest400ResponseType,
  InternalServerError500ResponseType,
  NotFound404ResponseType,
} from "../../../shared/models/externalApiRepresentation/Errors";

const getActivitySummaryPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_ACCOUNT_URL}/${process.env.REACT_APP_ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT}`;
const accountPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_ACCOUNT_URL}`;

export const handlers = [
  // get activity summary
  http.get(getActivitySummaryPath, async ({ request, params, cookies }) => {
    await isAuthenticated(request, getActivitySummaryPath);
    const buffer = fs.readFileSync(
      path.resolve(process.cwd(), "__tests__/msw/stubs/activitySummaryStub.pdf")
    );

    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=activitySummaryStub.pdf",
      },
    });
  }),

  // get account
  http.get<{}, {}, TPUserRepresentation>(
    accountPath,
    async ({ request, params, cookies }) => {
      await isAuthenticated(request, accountPath);
      const response: TPUserRepresentation = {
        id: 1,
        name: "user",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
        role: "USER",
      };
      return HttpResponse.json(response);
    }
  ),

  // delete account
  http.delete<{}, {}, DeleteAccountResponse>(
    accountPath,
    async ({ request, params, cookies }) => {
      await isAuthenticated(request, accountPath);
      const response: DeleteAccountResponse = {
        message: "The account for user with id: 1 has been removed",
      };
      return HttpResponse.json(response);
    }
  ),

  // edit account
  http.patch<
    {},
    EditAccountRequest,
    TPUserRepresentation | BadRequest400ResponseType
  >(accountPath, async ({ request, params, cookies }) => {
    await isAuthenticated(request, accountPath);

    const data = await request.formData();
    let newUsername = data.get("newUsername");
    let newPassword = data.get("newPassword");

    newUsername = newUsername as string; // FormData.get() returns a value of type string | File | null.
    newPassword = newPassword as string;
    if (newUsername && !new RegExp("^[a-zA-Z0-9_]{2,16}$").test(newUsername)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          accountPath,
          "Username must contain between 2 and 16 characters. It can only consist of underscores, numbers, lowercase and uppercase letters."
        )
      );
    }
    if (
      newPassword &&
      !new RegExp("^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$").test(newPassword)
    ) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          accountPath,
          "Password must contain between 4 and 32 characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters."
        )
      );
    }

    const response: TPUserRepresentation = {
      id: 1,
      name: "user",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      role: "USER",
    };

    if (newUsername) {
      response.name = newUsername as string;
      response.updatedAt = "2023-10-20T22:32:30";
    }

    return HttpResponse.json(response);
  }),
];

export const getActivitySummary_UserNotFound = http.get<
  {},
  {},
  NotFound404ResponseType
>(getActivitySummaryPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", accountPath, "user not found"),
    { status: 404 }
  );
});

export const getAccount_UserNotFound = http.get<
  {},
  {},
  NotFound404ResponseType
>(accountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", accountPath, "user not found"),
    { status: 404 }
  );
});

export const editAccount_UserNotFound = http.patch<
  {},
  EditAccountRequest,
  NotFound404ResponseType
>(accountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", accountPath, "user not found"),
    { status: 404 }
  );
});

export const deleteAccount_UserNotFound = http.delete<
  {},
  {},
  NotFound404ResponseType
>(accountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", accountPath, "user not found"),
    { status: 404 }
  );
});

export const getActivitySummary_InternalServerError = http.get<
  {},
  {},
  InternalServerError500ResponseType
>(getActivitySummaryPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getActivitySummaryPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getAccount_InternalServerError = http.get<
  {},
  {},
  InternalServerError500ResponseType
>(accountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      accountPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const editAccount_InternalServerError = http.patch<
  {},
  EditAccountRequest,
  InternalServerError500ResponseType
>(accountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      accountPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const deleteAccount_InternalServerError = http.delete<
  {},
  {},
  InternalServerError500ResponseType
>(accountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      accountPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});
