import { http, HttpResponse } from "msw";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";

import {
  DeleteCommentResponse,
  GetCommentsResponse,
} from "../../../shared/models/externalApiRepresentation/Responses";
import {
  BadRequest400ResponseType,
  InternalServerError500ResponseType,
} from "../../../shared/models/externalApiRepresentation/Errors";
import {
  DeleteCommentParams,
  EditCommentParams,
  GetSingleCommentParams,
} from "../../../shared/models/externalApiRepresentation/Params";
import { CommentRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import {
  AddCommentRequest,
  EditCommentRequest,
} from "../../../shared/models/externalApiRepresentation/Requests";

const getSingleCommentPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_COMMENTS_URL}/:id`;
const getCommentsFeedPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_COMMENTS_URL}/${process.env.REACT_APP_COMMENTS_FEED_ENDPOINT}`;
const addCommentPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_COMMENTS_URL}`;
const editCommentPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_COMMENTS_URL}/:id`;
const deleteCommentPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_COMMENTS_URL}/:id`;

export const snakeCommentsCollectionStub: CommentRepresentation[] = [
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
];

export const snakeCommentStub: CommentRepresentation = {
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
};

export const handlers = [
  // get comments feed
  http.get<{}, {}, GetCommentsResponse | BadRequest400ResponseType>(
    getCommentsFeedPath,
    async ({ request, params, cookies }) => {
      // Construct a URL instance out of the intercepted request.
      const url = new URL(request.url);
      // Read the "id" URL query parameter using the "URLSearchParams" API.
      // Given "/product?id=1", "productId" will equal "1".
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
            getCommentsFeedPath,
            "invalid param"
          )
        );
      }
      const response: GetCommentsResponse = {
        last: true,
        pageNumber: pageNumber === 0 ? pageNumber : parseInt(pageNumber),
        pageSize: pageSize === 10 ? pageSize : parseInt(pageSize),
        totalElements: 2,
        totalPages: 1,
        comments: snakeCommentsCollectionStub,
      };
      return HttpResponse.json(response);
    }
  ),

  // getSingleComment
  http.get<
    GetSingleCommentParams,
    {},
    CommentRepresentation | BadRequest400ResponseType
  >(getSingleCommentPath, async ({ request, params, cookies }) => {
    const { id } = params;

    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          getSingleCommentPath,
          "invalid id"
        )
      );
    }
    const response: CommentRepresentation = {
      ...snakeCommentStub,
      id: parseInt(id),
    };
    return HttpResponse.json(response);
  }),

  // addComment
  http.post<
    {},
    AddCommentRequest,
    CommentRepresentation | BadRequest400ResponseType
  >(addCommentPath, async ({ params, request, cookies }) => {
    // Permission.USER_CREATE
    await isAuthenticated(request, editCommentPath);
    const data = await request.formData();
    let body = data.get("body");
    let gameName = data.get("gameName");

    if (body && gameName) {
      body = body as string; // FormData.get() returns a value of type string | File | null.
      gameName = gameName as string; // FormData.get() returns a value of type string | File | null.

      if (body.length < 1 || body.length > 300) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            addCommentPath,
            "Invalid body length"
          )
        );
      }

      if (!/^(Snake|TicTacToe|Minesweeper)$/.test(gameName)) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            addCommentPath,
            "Invalid game name"
          )
        );
      }

      const response: CommentRepresentation = {
        ...snakeCommentStub,
        body,
        gameName,
      };

      return HttpResponse.json(response, {
        status: 201,
        statusText: "created /comments/1",
      });
    } else {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          addCommentPath,
          "missing request body field"
        )
      );
    }
  }),

  // editComment
  http.patch<
    EditCommentParams,
    EditCommentRequest,
    CommentRepresentation | BadRequest400ResponseType
  >(editCommentPath, async ({ request, params, cookies }) => {
    // Permission.USER_UPDATE
    await isAuthenticated(request, editCommentPath);
    const { id } = params;
    if (!/^[1-9]\d*$/.test(id)) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          deleteCommentPath,
          "invalid id"
        )
      );
    }

    const data = await request.formData();
    let newCommentBody = data.get("newCommentBody");

    newCommentBody = newCommentBody as string; // FormData.get() returns a value of type string | File | null.

    if (newCommentBody.length < 1 && newCommentBody.length > 300) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          editCommentPath,
          "Comment body must contain between 1 and 300 characters."
        )
      );
    }

    const response: CommentRepresentation = {
      ...snakeCommentStub,
      body: newCommentBody,
    };

    return HttpResponse.json(response);
  }),

  // deleteComment
  http.delete<DeleteCommentParams, {}, DeleteCommentResponse>(
    deleteCommentPath,
    async ({ request, params, cookies }) => {
      // user:delete or ROLE_ADMIN
      await isAuthenticated(request, deleteCommentPath);
      const { id } = params;
      if (!/^[1-9]\d*$/.test(id)) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            deleteCommentPath,
            "invalid id"
          )
        );
      }
      const response: DeleteCommentResponse = {
        message: "Comment successfully removed",
      };
      return HttpResponse.json(response);
    }
  ),
];

export const getCommentsFeed_InternalServerError = http.get<
  {},
  {},
  InternalServerError500ResponseType
>(getCommentsFeedPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getCommentsFeedPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getSingleComment_InternalServerError = http.get<
  GetSingleCommentParams,
  {},
  InternalServerError500ResponseType
>(getSingleCommentPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getSingleCommentPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const addComment_InternalServerError = http.post<
  {},
  AddCommentRequest,
  InternalServerError500ResponseType
>(addCommentPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      addCommentPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const editComment_InternalServerError = http.patch<
  EditCommentParams,
  EditCommentRequest,
  InternalServerError500ResponseType
>(editCommentPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      editCommentPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const deleteComment_InternalServerError = http.delete<
  DeleteCommentParams,
  {},
  InternalServerError500ResponseType
>(deleteCommentPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      deleteCommentPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});
