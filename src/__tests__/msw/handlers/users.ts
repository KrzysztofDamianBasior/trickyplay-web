import { http, HttpResponse } from "msw";

import type { TPUserRepresentation } from "../dtos/ResourcesRepresentations";
import type {
  GetCommentsResponse,
  GetRepliesResponse,
  GetUsersResponse,
} from "../dtos/Responses";
import type {
  BadRequest400ResponseType,
  NotFound404ResponseType,
} from "../dtos/Errors";
import type {
  GetSingleUserParams,
  GetUserCommentsParams,
  GetUserRepliesParams,
  GrantAdminPermissionsParams,
  UnbanUserParams,
  BanUserParams,
} from "../dtos/Params";

import fs from "node:fs";
import path from "node:path";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";

const getSingleUserPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id`;
const getUsersFeedPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/${process.env.REACT_APP_USERS_FEED_ENDPOINT}`;
const getUserCommentsPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id/${process.env.REACT_APP_USER_COMMENTS_ENDPOINT}`;
const getUserRepliesPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id/${process.env.REACT_APP_USER_REPLIES_ENDPOINT}`;
const getUserActivitySummaryPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id/${process.env.REACT_APP_ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT}`;
const banUserPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id/${process.env.REACT_APP_BAN_ENDPOINT}`;
const unbanUserPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id/${process.env.REACT_APP_UNBAN_ENDPOINT}`;
const grantAdminPermissionsPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_USERS_URL}/:id/${process.env.REACT_APP_GRANT_ADMIN_PERMISSIONS_ENDPOINT}`;

export const handlers = [
  // getSingleUserPath
  http.get<
    GetSingleUserParams,
    {},
    TPUserRepresentation | BadRequest400ResponseType
  >(getSingleUserPath, async ({ request, params, cookies }) => {
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getSingleUserPath,
          "invalid id"
        )
      );
    }

    const response: TPUserRepresentation = {
      id: parseInt(id),
      name: "user",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      role: "USER",
    };
    return HttpResponse.json(response);
  }),

  // getUsersFeedPath
  http.get<{}, {}, GetUsersResponse | BadRequest400ResponseType>(
    getUsersFeedPath,
    async ({ request, params, cookies }) => {
      // Construct a URL instance out of the intercepted request.
      const url = new URL(request.url);
      const pageNumber = url.searchParams.get("pageNumber") || 0;
      const pageSize = url.searchParams.get("pageSize") || 10;
      const sortBy = url.searchParams.get("sortBy") || "id";
      const orderDirection = url.searchParams.get("orderDirection") || "Asc";

      if (
        !/^[0-9]\d*$/.test(pageNumber.toString()) ||
        !/^[0-9]\d*$/.test(pageSize.toString()) ||
        !/^(id|createdAt|updatedAt)$/.test(orderDirection.toString()) ||
        !/^(Asc|Dsc)$/.test(sortBy.toString())
      ) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            getUsersFeedPath,
            "invalid param"
          )
        );
      }

      const response: GetUsersResponse = {
        isLast: true,
        pageNumber: pageNumber === 0 ? pageNumber : parseInt(pageNumber),
        pageSize: pageSize === 10 ? pageSize : parseInt(pageSize),
        totalElements: 3,
        totalPages: 1,
        users: [
          {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          {
            id: 2,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          {
            id: 3,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
        ],
      };
      return HttpResponse.json(response);
    }
  ),

  // get user comments
  http.get<
    GetUserCommentsParams,
    {},
    GetCommentsResponse | BadRequest400ResponseType
  >(getUserCommentsPath, async ({ request, params, cookies }) => {
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getUserCommentsPath,
          "invalid id"
        )
      );
    }
    const url = new URL(request.url);
    const pageNumber = url.searchParams.get("pageNumber") || 0;
    const pageSize = url.searchParams.get("pageSize") || 10;
    const sortBy = url.searchParams.get("sortBy") || "id";
    const orderDirection = url.searchParams.get("orderDirection") || "Asc";

    if (
      !/^[0-9]\d*$/.test(pageNumber.toString()) ||
      !/^[0-9]\d*$/.test(pageSize.toString()) ||
      !/^(id|createdAt|updatedAt)$/.test(orderDirection.toString()) ||
      !/^(Asc|Dsc)$/.test(sortBy.toString())
    ) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getSingleUserPath,
          "invalid param"
        )
      );
    }

    const response: GetCommentsResponse = {
      isLast: true,
      pageNumber: pageNumber === 0 ? pageNumber : parseInt(pageNumber),
      pageSize: pageSize === 10 ? pageSize : parseInt(pageSize),
      totalElements: 3,
      totalPages: 1,
      comments: [
        {
          author: {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          body: "first comment body",
          gameName: "Snake",
          id: 1,
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
        {
          author: {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          body: "second comment body",
          gameName: "Snake",
          id: 2,
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
        {
          author: {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          body: "third comment body",
          gameName: "Snake",
          id: 3,
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  // get user replies
  http.get<
    GetUserRepliesParams,
    {},
    GetRepliesResponse | BadRequest400ResponseType
  >(getUserRepliesPath, async ({ request, params, cookies }) => {
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getUserRepliesPath,
          "invalid id"
        )
      );
    }
    const url = new URL(request.url);
    const pageNumber = url.searchParams.get("pageNumber") || 0;
    const pageSize = url.searchParams.get("pageSize") || 10;
    const sortBy = url.searchParams.get("sortBy") || "id";
    const orderDirection = url.searchParams.get("orderDirection") || "Asc";

    if (
      !/^[0-9]\d*$/.test(pageNumber.toString()) ||
      !/^[0-9]\d*$/.test(pageSize.toString()) ||
      !/^(id|createdAt|updatedAt)$/.test(orderDirection.toString()) ||
      !/^(Asc|Dsc)$/.test(sortBy.toString())
    ) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getUserRepliesPath,
          "invalid param"
        )
      );
    }

    const response: GetRepliesResponse = {
      isLast: true,
      pageNumber: pageNumber === 0 ? pageNumber : parseInt(pageNumber),
      pageSize: pageSize === 10 ? pageSize : parseInt(pageSize),
      totalElements: 2,
      totalPages: 1,
      replies: [
        {
          author: {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          body: "first reply body",
          parentComment: {
            author: {
              id: 1,
              name: "user",
              createdAt: "2023-10-15T20:30:38",
              updatedAt: "2023-10-15T20:30:38",
              role: "USER",
            },
            body: "comment body",
            gameName: "Snake",
            id: 1,
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
          },
          id: 1,
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
        {
          author: {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          body: "second reply body",
          parentComment: {
            author: {
              id: 1,
              name: "user",
              createdAt: "2023-10-15T20:30:38",
              updatedAt: "2023-10-15T20:30:38",
              role: "USER",
            },
            body: "comment body",
            gameName: "Snake",
            id: 1,
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
          },
          id: 2,
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
      ],
    };
    return HttpResponse.json(response);
  }),

  // get user activity summary
  http.get(getUserActivitySummaryPath, async ({ request, params, cookies }) => {
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

  // unban user
  http.patch<
    UnbanUserParams,
    {},
    TPUserRepresentation | BadRequest400ResponseType
  >(unbanUserPath, async ({ request, params, cookies }) => {
    // Role.ADMIN
    await isAuthenticated(request, unbanUserPath);
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody("Bad Request", unbanUserPath, "invalid id")
      );
    }

    const response: TPUserRepresentation = {
      id: parseInt(id),
      name: "user",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      role: "USER",
    };
    return HttpResponse.json(response);
  }),

  // ban user
  http.patch<
    BanUserParams,
    {},
    TPUserRepresentation | BadRequest400ResponseType
  >(banUserPath, async ({ request, params, cookies }) => {
    // Role.ADMIN
    await isAuthenticated(request, banUserPath);
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody("Bad Request", banUserPath, "invalid id")
      );
    }

    const response: TPUserRepresentation = {
      id: parseInt(id),
      name: "user",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      role: "BANNED",
    };
    return HttpResponse.json(response);
  }),

  // grant admin permissions
  http.patch<
    GrantAdminPermissionsParams,
    {},
    TPUserRepresentation | BadRequest400ResponseType
  >(grantAdminPermissionsPath, async ({ request, params, cookies }) => {
    // Role.ADMIN
    await isAuthenticated(request, grantAdminPermissionsPath);
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          grantAdminPermissionsPath,
          "invalid id"
        )
      );
    }

    const response: TPUserRepresentation = {
      id: parseInt(id),
      name: "user",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      role: "ADMIN",
    };
    return HttpResponse.json(response);
  }),
];

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
