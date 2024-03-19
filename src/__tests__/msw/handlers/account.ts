import { http, HttpResponse } from "msw";

import fs from "node:fs";
import path from "node:path";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";

import { TPUserRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import { DeleteAccountResponse } from "../../../shared/models/externalApiRepresentation/Responses";
import { PatchAccountRequest } from "../../../shared/models/externalApiRepresentation/Requests";
import {
  BadRequest400ResponseType,
  InternalServerError500ResponseType,
  NotFound404ResponseType,
} from "../../../shared/models/externalApiRepresentation/Errors";

import { usersCollectionStub } from "../stubs/users";

import {
  deleteAccountPath,
  getAccountPath,
  getActivitySummaryPath,
  patchAccountPath,
} from "../urls";

export const getActivitySummary = http.get(
  getActivitySummaryPath,
  async ({ request, params, cookies }) => {
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
  }
);

export const getAccount = http.get<{}, {}, TPUserRepresentation>(
  getAccountPath,
  async ({ request, params, cookies }) => {
    const username = isAuthenticated(request, getAccountPath);
    const signedUser = usersCollectionStub.find((u) => u.name === username);
    if (signedUser == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        getAccountPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    return HttpResponse.json(signedUser);
  }
);

export const deleteAccount = http.delete<{}, {}, DeleteAccountResponse>(
  deleteAccountPath,
  async ({ request, params, cookies }) => {
    const username = isAuthenticated(request, deleteAccountPath);
    const signedUser = usersCollectionStub.find((u) => u.name === username);
    if (signedUser == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        deleteAccountPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    usersCollectionStub.splice(
      usersCollectionStub.findIndex((u) => u.id === signedUser.id),
      1
    );

    const response: DeleteAccountResponse = {
      message: `The account for user with id: ${signedUser.id} has been removed`,
    };
    return HttpResponse.json(response);
  }
);

export const patchAccount = http.patch<
  {},
  PatchAccountRequest,
  TPUserRepresentation | BadRequest400ResponseType
>(patchAccountPath, async ({ request, params, cookies }) => {
  const username = isAuthenticated(request, patchAccountPath);

  const data = await request.formData();
  let newUsername = data.get("newUsername");
  let newPassword = data.get("newPassword");

  newUsername = newUsername as string; // FormData.get() returns a value of type string | File | null.
  newPassword = newPassword as string;
  if (newUsername && !/^[a-zA-Z0-9_]{2,16}$/.test(newUsername)) {
    return HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        patchAccountPath,
        "Username must contain between 2 and 16 characters. It can only consist of underscores, numbers, lowercase and uppercase letters."
      )
    );
  }
  if (newPassword && !/^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$/.test(newPassword)) {
    return HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        patchAccountPath,
        "Password must contain between 4 and 32 characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters."
      )
    );
  }

  const signedUser = usersCollectionStub.find((user) => user.name === username);
  if (signedUser == null) {
    const responseBody = generateErrorResponseBody(
      "Not Found",
      patchAccountPath,
      "user not found"
    );
    throw HttpResponse.json(responseBody, { status: 404 });
  }

  const updatedAt = new Date();

  if (newUsername) {
    signedUser.name = newUsername as string;
    signedUser.updatedAt = updatedAt.toISOString().split(".")[0];
  }

  if (newPassword) {
    signedUser.updatedAt = updatedAt.toISOString().split(".")[0];
  }

  return HttpResponse.json(signedUser);
});

export const getActivitySummary_UserNotFound = http.get<
  {},
  {},
  NotFound404ResponseType
>(getActivitySummaryPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Not Found",
      getActivitySummaryPath,
      "user not found"
    ),
    { status: 404 }
  );
});

export const getAccount_UserNotFound = http.get<
  {},
  {},
  NotFound404ResponseType
>(getAccountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", getAccountPath, "user not found"),
    { status: 404 }
  );
});

export const patchAccount_UserNotFound = http.patch<
  {},
  PatchAccountRequest,
  NotFound404ResponseType
>(patchAccountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", patchAccountPath, "user not found"),
    { status: 404 }
  );
});

export const deleteAccount_UserNotFound = http.delete<
  {},
  {},
  NotFound404ResponseType
>(deleteAccountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", deleteAccountPath, "user not found"),
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
>(getAccountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getAccountPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const patchAccount_InternalServerError = http.patch<
  {},
  PatchAccountRequest,
  InternalServerError500ResponseType
>(patchAccountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      patchAccountPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const deleteAccount_InternalServerError = http.delete<
  {},
  {},
  InternalServerError500ResponseType
>(deleteAccountPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      deleteAccountPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const handlers = [
  getActivitySummary,
  getAccount,
  deleteAccount,
  patchAccount,
];

export const internalServerErrorHandlers = [
  getActivitySummary_InternalServerError,
  getAccount_InternalServerError,
  deleteAccount_InternalServerError,
  patchAccount_InternalServerError,
];

export const userNotFoundHandlers = [
  getActivitySummary_UserNotFound,
  getAccount_UserNotFound,
  deleteAccount_UserNotFound,
  patchAccount_UserNotFound,
];
