/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { http, HttpResponse } from "msw";

import fs from "node:fs";
import path from "node:path";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";
import { validateId } from "../helpers/validateId";
import { extractPaginationArguments } from "../helpers/extractPaginationArguments";
import { sortCollection } from "../helpers/sortCollection";

import {
  type BanUserParams,
  type GetSingleUserParams,
  type GetUserCommentsParams,
  type GetUserRepliesParams,
  type GrantAdminPermissionsParams,
  type UnbanUserParams,
} from "../../../shared/models/externalApiRepresentation/Params";
import { type TPUserRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import {
  type InternalServerError500ResponseType,
  type NotFound404ResponseType,
} from "../../../shared/models/externalApiRepresentation/Errors";
import {
  type GetCommentsResponse,
  type GetRepliesResponse,
  type GetUsersResponse,
} from "../../../shared/models/externalApiRepresentation/Responses";

import {
  banUserPath,
  getSingleUserPath,
  getUserActivitySummaryPath,
  getUserCommentsPath,
  getUserRepliesPath,
  getUsersFeedPath,
  grantAdminPermissionsPath,
  unbanUserPath,
} from "../urls";

import { usersCollectionStub } from "../stubs/users";
import { repliesCollectionStub } from "../stubs/replies";
import { commentsCollectionStub } from "../stubs/comments";

export const getSingleUser = http.get<
  GetSingleUserParams,
  {},
  TPUserRepresentation
>(getSingleUserPath, async ({ request, params, cookies }) => {
  const { id } = params;
  validateId({ id, path: getSingleUserPath });

  const user = usersCollectionStub.find((u) => u.id === parseInt(id));

  if (user == null) {
    // or check for reply === undefined
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Not Found",
        getSingleUserPath,
        "user not found"
      ),
      { status: 404 }
    );
  }

  return HttpResponse.json(user);
});

export const getUsersFeed = http.get<{}, {}, GetUsersResponse>(
  getUsersFeedPath,
  async ({ request, params, cookies }) => {
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url);
    const { orderDirection, pageNumber, pageSize, sortBy } =
      extractPaginationArguments(url);

    const sortedCollection = sortCollection({
      entitiesCollection: usersCollectionStub,
      orderDirection,
      sortBy,
    });

    const response: GetUsersResponse = {
      last: pageSize * pageNumber > sortedCollection.length - pageSize,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalElements: sortedCollection.length,
      totalPages: Math.ceil(sortedCollection.length / pageSize),
      users:
        pageSize * pageNumber < sortedCollection.length
          ? sortedCollection.slice(
              pageSize * pageNumber,
              pageSize * pageNumber + pageSize
            )
          : [],
    };
    return HttpResponse.json(response);
  }
);

// get user comments
export const getUserComments = http.get<
  GetUserCommentsParams,
  {},
  GetCommentsResponse
>(getUserCommentsPath, async ({ request, params, cookies }) => {
  const { id } = params;
  validateId({ id, path: getUserCommentsPath });

  // Construct a URL instance out of the intercepted request.
  const url = new URL(request.url);
  const { orderDirection, pageNumber, pageSize, sortBy } =
    extractPaginationArguments(url);

  const sortedCollection = sortCollection({
    entitiesCollection: commentsCollectionStub.filter(
      (c) => c.author.id === parseInt(id)
    ),
    orderDirection,
    sortBy,
  });

  const response: GetCommentsResponse = {
    last: pageSize * pageNumber > sortedCollection.length - pageSize,
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalElements: sortedCollection.length,
    totalPages: Math.ceil(sortedCollection.length / pageSize),
    comments:
      pageSize * pageNumber < sortedCollection.length
        ? sortedCollection.slice(
            pageSize * pageNumber,
            pageSize * pageNumber + pageSize
          )
        : [],
  };
  return HttpResponse.json(response);
});

export const getUserReplies = http.get<
  GetUserRepliesParams,
  {},
  GetRepliesResponse
>(getUserRepliesPath, async ({ request, params, cookies }) => {
  const { id } = params;
  validateId({ id, path: getUserRepliesPath });

  // Construct a URL instance out of the intercepted request.
  const url = new URL(request.url);
  const { orderDirection, pageNumber, pageSize, sortBy } =
    extractPaginationArguments(url);

  const sortedCollection = sortCollection({
    entitiesCollection: repliesCollectionStub.filter(
      (r) => r.author.id === parseInt(id)
    ),
    orderDirection,
    sortBy,
  });

  const response: GetRepliesResponse = {
    last: pageSize * pageNumber > sortedCollection.length - pageSize,
    pageNumber: pageNumber,
    pageSize: pageSize,
    totalElements: sortedCollection.length,
    totalPages: Math.ceil(sortedCollection.length / pageSize),
    replies:
      pageSize * pageNumber < sortedCollection.length
        ? sortedCollection.slice(
            pageSize * pageNumber,
            pageSize * pageNumber + pageSize
          )
        : [],
  };
  return HttpResponse.json(response);
});

export const getUserActivitySummary = http.get(
  getUserActivitySummaryPath,
  async ({ request, params, cookies }) => {
    const { id } = params;
    validateId({ id: id as string, path: getUserActivitySummaryPath });

    const buffer = fs.readFileSync(
      path.resolve(process.cwd(), "__tests__/msw/stubs/activitySummaryStub.pdf")
    );
    const arrayBuffer = new Uint8Array(buffer).buffer;

    return HttpResponse.arrayBuffer(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=activitySummaryStub.pdf",
      },
    });
  }
);

export const unbanUser = http.patch<UnbanUserParams, {}, TPUserRepresentation>(
  unbanUserPath,
  async ({ request, params, cookies }) => {
    const username = isAuthenticated(request, unbanUserPath);
    const { id } = params;
    validateId({ id, path: unbanUserPath });

    const signedUser = usersCollectionStub.find((u) => u.name === username);
    const userToUnban = usersCollectionStub.find((u) => u.id === parseInt(id));
    if (signedUser == null || userToUnban == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        unbanUserPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    if (userToUnban.role === "BANNED" && signedUser.role === "ADMIN") {
      const now = new Date();
      userToUnban.updatedAt = now.toISOString().split(".")[0];
      userToUnban.role = "USER";
      return HttpResponse.json(userToUnban);
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Forbidden",
          unbanUserPath,
          "you do not have permission to perform actions on this entity"
        )
      );
    }
  }
);

export const banUser = http.patch<BanUserParams, {}, TPUserRepresentation>(
  banUserPath,
  async ({ request, params, cookies }) => {
    const username = isAuthenticated(request, banUserPath);
    const { id } = params;
    validateId({ id, path: banUserPath });

    const signedUser = usersCollectionStub.find((u) => u.name === username);
    const userToBan = usersCollectionStub.find((u) => u.id === parseInt(id));
    if (signedUser == null || userToBan == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        banUserPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    if (userToBan.role === "USER" && signedUser.role === "ADMIN") {
      userToBan.role = "BANNED";
      const now = new Date();
      userToBan.updatedAt = now.toISOString().split(".")[0];
      return HttpResponse.json(userToBan);
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Forbidden",
          unbanUserPath,
          "you do not have permission to perform actions on this entity"
        )
      );
    }
  }
);

export const grantAdminPermissions = http.patch<
  GrantAdminPermissionsParams,
  {},
  TPUserRepresentation
>(grantAdminPermissionsPath, async ({ request, params, cookies }) => {
  const username = isAuthenticated(request, grantAdminPermissionsPath);
  const { id } = params;
  validateId({ id, path: grantAdminPermissionsPath });

  const signedUser = usersCollectionStub.find((u) => u.name === username);
  const userToGrantAdminPermissions = usersCollectionStub.find(
    (u) => u.id === parseInt(id)
  );
  if (signedUser == null || userToGrantAdminPermissions == null) {
    const responseBody = generateErrorResponseBody(
      "Not Found",
      grantAdminPermissionsPath,
      "user not found"
    );
    throw HttpResponse.json(responseBody, { status: 404 });
  }

  if (
    userToGrantAdminPermissions.role === "USER" &&
    signedUser.role === "ADMIN"
  ) {
    const now = new Date();
    userToGrantAdminPermissions.updatedAt = now.toISOString().split(".")[0];
    userToGrantAdminPermissions.role = "ADMIN";
    return HttpResponse.json(userToGrantAdminPermissions);
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Forbidden",
        grantAdminPermissionsPath,
        "you do not have permission to perform actions on this entity"
      )
    );
  }
});

export const getSingleUser_UserNotFound = http.patch<
  GetSingleUserParams,
  {},
  NotFound404ResponseType
>(getSingleUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", getSingleUserPath, "user not found"),
    { status: 404 }
  );
});

export const unbanUser_UserNotFound = http.patch<
  UnbanUserParams,
  {},
  NotFound404ResponseType
>(getSingleUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", getSingleUserPath, "user not found"),
    { status: 404 }
  );
});

export const banUser_UserNotFound = http.patch<
  BanUserParams,
  {},
  NotFound404ResponseType
>(getSingleUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", getSingleUserPath, "user not found"),
    { status: 404 }
  );
});

export const grantAdminPermissions_UserNotFound = http.patch<
  GrantAdminPermissionsParams,
  {},
  NotFound404ResponseType
>(getSingleUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", getSingleUserPath, "user not found"),
    { status: 404 }
  );
});

export const getSingleUser_InternalServerError = http.get<
  GetSingleUserParams,
  {},
  InternalServerError500ResponseType
>(getSingleUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getSingleUserPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getUsersFeed_InternalServerError = http.get<
  {},
  {},
  InternalServerError500ResponseType
>(getUsersFeedPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getUsersFeedPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getUserComments_InternalServerError = http.get<
  GetUserCommentsParams,
  {},
  InternalServerError500ResponseType
>(getUserCommentsPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getUserCommentsPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getUserReplies_InternalServerError = http.get<
  GetUserRepliesParams,
  {},
  InternalServerError500ResponseType
>(getUserRepliesPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getUserRepliesPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getUserActivitySummary_InternalServerError = http.get<
  {},
  {},
  InternalServerError500ResponseType
>(getUserActivitySummaryPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getUserActivitySummaryPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const unbanUser_InternalServerError = http.patch<
  UnbanUserParams,
  {},
  InternalServerError500ResponseType
>(unbanUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      unbanUserPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const banUser_InternalServerError = http.patch<
  BanUserParams,
  {},
  InternalServerError500ResponseType
>(banUserPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      banUserPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const grantAdminPermissions_InternalServerError = http.patch<
  GrantAdminPermissionsParams,
  {},
  InternalServerError500ResponseType
>(grantAdminPermissionsPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      grantAdminPermissionsPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const handlers = [
  getUsersFeed,
  getSingleUser,
  getUserComments,
  getUserReplies,
  grantAdminPermissions,
  banUser,
  unbanUser,
  getUserActivitySummary,
];

export const internalServerErrorHandlers = [
  getSingleUser_InternalServerError,
  getUsersFeed_InternalServerError,
  getUserComments_InternalServerError,
  getUserReplies_InternalServerError,
  grantAdminPermissions_InternalServerError,
  banUser_InternalServerError,
  unbanUser_InternalServerError,
  getUserActivitySummary_InternalServerError,
];

export const userNotFoundHandlers = [
  getSingleUser_UserNotFound,
  grantAdminPermissions_UserNotFound,
  banUser_UserNotFound,
  unbanUser_UserNotFound,
];
