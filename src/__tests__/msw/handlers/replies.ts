import { http, HttpResponse } from "msw";

import { ReplyRepresentation } from "../dtos/ResourcesRepresentations";
import type {
  DeleteReplyResponse,
  GetRepliesResponse,
} from "../dtos/Responses";
import type {
  BadRequest400ResponseType,
  NotFound404ResponseType,
} from "../dtos/Errors";
import type {
  DeleteReplyParams,
  EditReplyParams,
  GetSingleReplyParams,
} from "../dtos/Params";
import { AddReplyRequest, EditReplyRequest } from "../dtos/Requests";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";

const getSingleReplyPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_REPLIES_URL}/:id`;
const getRepliesFeedPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_REPLIES_URL}/${process.env.REACT_APP_REPLIES_FEED_ENDPOINT}`;
const addReplyPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_REPLIES_URL}`;
const editReplyPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_REPLIES_URL}/:id`;
const deleteReplyPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_REPLIES_URL}/:id`;

export const handlers = [
  // get replies feed
  http.get<{}, {}, GetRepliesResponse | BadRequest400ResponseType>(
    getRepliesFeedPath,
    async ({ request, params, cookies }) => {
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
            getRepliesFeedPath,
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
    }
  ),

  // get single reply
  http.get<
    GetSingleReplyParams,
    {},
    ReplyRepresentation | BadRequest400ResponseType
  >(getSingleReplyPath, async ({ request, params, cookies }) => {
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getSingleReplyPath,
          "invalid id"
        )
      );
    }
    const response: ReplyRepresentation = {
      id: parseInt(id),
      body: "response body",
      parentComment: {
        id: 1,
        author: {
          id: 1,
          name: "user",
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
          role: "USER",
        },
        body: "parent comment body",
        gameName: "Snake",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
      },
      author: {
        id: 1,
        name: "user",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
        role: "USER",
      },
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
    };
    return HttpResponse.json(response);
  }),

  // addReply
  http.post<
    {},
    AddReplyRequest,
    ReplyRepresentation | BadRequest400ResponseType
  >(addReplyPath, async ({ params, request, cookies }) => {
    // Permission.USER_CREATE

    const data = await request.formData();
    let body = data.get("body");
    let parentCommentId = data.get("parentCommentId");

    if (body && parentCommentId) {
      body = body as string; // FormData.get() returns a value of type string | File | null.
      parentCommentId = parentCommentId as string; // FormData.get() returns a value of type string | File | null.

      parentCommentId = parentCommentId as string;
      if (body.length < 1 || body.length > 300) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            addReplyPath,
            "Invalid body length"
          )
        );
      }

      if (!/^[1-9]\d*$/.test(parentCommentId)) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            addReplyPath,
            "Invalid parent commend id"
          )
        );
      }

      const response: ReplyRepresentation = {
        body,
        parentComment: {
          id: parseInt(parentCommentId),
          author: {
            id: 1,
            name: "user",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
            role: "USER",
          },
          body: "parent comment body",
          gameName: "Snake",
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
        id: 1,
        author: {
          id: 1,
          name: "",
          role: "USER",
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
      };

      return HttpResponse.json(response, {
        status: 201,
        statusText: "created /replies/1",
      });
    } else {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          addReplyPath,
          "missing request body field"
        )
      );
    }
  }),

  // editReply
  http.patch<
    EditReplyParams,
    EditReplyRequest,
    ReplyRepresentation | BadRequest400ResponseType
  >(editReplyPath, async ({ request, params, cookies }) => {
    // Permission.USER_UPDATE

    await isAuthenticated(request, editReplyPath);

    const data = await request.formData();
    let newReplyBody = data.get("newReplyBody");

    newReplyBody = newReplyBody as string; // FormData.get() returns a value of type string | File | null.

    if (newReplyBody.length < 1 && newReplyBody.length > 300) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          editReplyPath,
          "Reply body must contain between 1 and 300 characters."
        )
      );
    }

    const response: ReplyRepresentation = {
      id: 1,
      author: {
        id: 1,
        name: "",
        role: "USER",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
      },
      parentComment: {
        id: 1,
        author: {
          id: 1,
          name: "user",
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
          role: "USER",
        },
        body: "parent comment body",
        gameName: "Snake",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
      },
      body: newReplyBody,
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
    };

    return HttpResponse.json(response);
  }),

  // deleteReply
  http.delete<DeleteReplyParams, {}, DeleteReplyResponse>(
    deleteReplyPath,
    async ({ request, params, cookies }) => {
      // user:delete or ROLE_ADMIN
      const { id } = params;
      if (!/^[1-9]\d*$/.test(id)) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            getSingleReplyPath,
            "invalid id"
          )
        );
      }
      await isAuthenticated(request, deleteReplyPath);
      const response: DeleteReplyResponse = {
        message: "Reply successfully removed",
      };
      return HttpResponse.json(response);
    }
  ),
];

export const getSingleReply_ReplyNotFound = http.patch<
  GetSingleReplyParams,
  {},
  NotFound404ResponseType
>(getSingleReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Not Found",
      getSingleReplyPath,
      "reply not found"
    ),
    { status: 404 }
  );
});

export const deleteReply_ReplyNotFound = http.patch<
  DeleteReplyParams,
  {},
  NotFound404ResponseType
>(deleteReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", deleteReplyPath, "reply not found"),
    { status: 404 }
  );
});

export const editReply_ReplyNotFound = http.patch<
  EditReplyParams,
  {},
  NotFound404ResponseType
>(editReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", editReplyPath, "reply not found"),
    { status: 404 }
  );
});
