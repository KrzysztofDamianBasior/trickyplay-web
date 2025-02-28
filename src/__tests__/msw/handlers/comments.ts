/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { http, HttpResponse } from "msw";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";
import { sortCollection } from "../helpers/sortCollection";
import { extractPaginationArguments } from "../helpers/extractPaginationArguments";
import { extractGameName } from "../helpers/extractGameNameOrThrow";
import { validateId } from "../helpers/validateId";

import {
  type DeleteCommentResponse,
  type GetCommentsResponse,
} from "../../../shared/models/externalApiRepresentation/Responses";
import { type InternalServerError500ResponseType } from "../../../shared/models/externalApiRepresentation/Errors";
import {
  type DeleteCommentParams,
  type PatchCommentParams,
  type GetSingleCommentParams,
} from "../../../shared/models/externalApiRepresentation/Params";
import { type CommentRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import {
  type AddCommentRequest,
  type PatchCommentRequest,
} from "../../../shared/models/externalApiRepresentation/Requests";

import {
  addCommentPath,
  deleteCommentPath,
  getCommentsFeedPath,
  getSingleCommentPath,
  patchCommentPath,
} from "../urls";
import { commentsCollectionStub } from "../stubs/comments";
import { usersCollectionStub } from "../stubs/users";

export const getCommentsFeed = http.get<{}, {}, GetCommentsResponse>(
  getCommentsFeedPath,
  async ({ request, params, cookies }) => {
    const url = new URL(request.url);
    const { orderDirection, pageNumber, pageSize, sortBy } =
      extractPaginationArguments(url);
    const gameName = extractGameName(url);

    const sortedCollection = sortCollection({
      entitiesCollection:
        gameName === "Snake"
          ? commentsCollectionStub.filter((comm) => comm.gameName === "Snake")
          : gameName === "Minesweeper"
          ? commentsCollectionStub.filter(
              (comm) => comm.gameName === "Minesweeper"
            )
          : commentsCollectionStub.filter(
              (comm) => comm.gameName === "TicTacToe"
            ),
      orderDirection,
      sortBy,
    });

    const response = {
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
  }
);

export const getSingleComment = http.get<
  GetSingleCommentParams,
  {},
  CommentRepresentation
>(getSingleCommentPath, async ({ request, params, cookies }) => {
  const { id } = params;
  validateId({ id, path: getSingleCommentPath });

  const comment = commentsCollectionStub.find(
    (comment) => comment.id === parseInt(id)
  );

  if (comment == null) {
    // or check for comment === undefined
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Not Found",
        getSingleCommentPath,
        "comment not found"
      ),
      { status: 404 }
    );
  }

  return HttpResponse.json(comment);
});

export const addComment = http.post<
  {},
  AddCommentRequest,
  CommentRepresentation
>(addCommentPath, async ({ params, request, cookies }) => {
  const username = isAuthenticated(request, addCommentPath);

  const data = await request.json();
  const body = data["body"];
  const gameName = data["gameName"];

  if (body && gameName) {
    if (body.length < 1 || body.length > 300) {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          addCommentPath,
          "Invalid body length"
        ),
        { status: 400 }
      );
    }

    const signedUser = usersCollectionStub.find(
      (user) => user.name === username
    );
    if (signedUser == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        addCommentPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    const now = new Date();

    // three oneliners which handle search for next id:
    const nextId =
      commentsCollectionStub.reduce((a, b) => (a.id > b.id ? a : b)).id + 1; // time complexity:  O(n)
    // const nextId = commentsCollectionStub.sort((a, b) => b.id - a.id)[0].id +1; // time complexity:  O(nlogn)
    // const nextId:number = Math.max(...commentsCollectionStub.map(comm=>comm.id)) +1;     // time complexity: >O(2n)

    const response: CommentRepresentation = {
      author: signedUser,
      gameName:
        gameName === "Minesweeper"
          ? "Minesweeper"
          : gameName === "Snake"
          ? "Snake"
          : "TicTacToe",
      createdAt: now.toISOString().split(".")[0],
      updatedAt: now.toISOString().split(".")[0],
      body,
      id: nextId,
    };
    return HttpResponse.json(response, {
      status: 201,
      statusText: "created /comments/" + nextId,
    });
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        addCommentPath,
        "field is missing in the request body"
      ),
      { status: 400 }
    );
  }
});

export const patchComment = http.patch<
  PatchCommentParams,
  PatchCommentRequest,
  CommentRepresentation
>(patchCommentPath, async ({ request, params, cookies }) => {
  const username = isAuthenticated(request, patchCommentPath);
  const { id } = params;
  validateId({ id, path: patchCommentPath });

  const data = await request.json();
  const newCommentBody = data["newCommentBody"];

  if (newCommentBody !== null) {
    if (newCommentBody.length < 1 && newCommentBody.length > 300) {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          patchCommentPath,
          "Comment body must contain between 1 and 300 characters."
        ),
        { status: 400 }
      );
    }

    const comment = commentsCollectionStub.find(
      (comment) => comment.id === parseInt(id)
    );
    if (comment == null) {
      // or check for comment === undefined
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Not Found",
          patchCommentPath,
          "comment not found"
        ),
        { status: 404 }
      );
    }

    const signedUser = usersCollectionStub.find(
      (user) => user.name === username
    );
    if (signedUser == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        addCommentPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    if (comment.author.name === username || signedUser.role === "ADMIN") {
      const now = new Date();
      const response: CommentRepresentation = {
        ...comment,
        updatedAt: now.toISOString().split(".")[0],
        body: newCommentBody,
      };
      return HttpResponse.json(response);
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Forbidden",
          patchCommentPath,
          "you do not have permission to perform actions on this entity"
        )
      );
    }
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        addCommentPath,
        "field is missing in the request body"
      )
    );
  }
});

export const deleteComment = http.delete<
  DeleteCommentParams,
  {},
  DeleteCommentResponse
>(deleteCommentPath, async ({ request, params, cookies }) => {
  const username = await isAuthenticated(request, deleteCommentPath);

  const { id } = params;
  validateId({ id, path: deleteCommentPath });

  const comment = commentsCollectionStub.find(
    (comment) => comment.id === parseInt(id)
  );
  if (comment == null) {
    // or check for comment === undefined
    return HttpResponse.json(
      generateErrorResponseBody(
        "Not Found",
        deleteCommentPath,
        "comment not found"
      ),
      { status: 404 }
    );
  }

  const signedUser = usersCollectionStub.find((user) => user.name === username);
  if (signedUser == null) {
    const responseBody = generateErrorResponseBody(
      "Not Found",
      deleteCommentPath,
      "user not found"
    );
    throw HttpResponse.json(responseBody, { status: 404 });
  }

  if (comment.author.name === username || signedUser.role === "ADMIN") {
    commentsCollectionStub.splice(
      commentsCollectionStub.findIndex((c) => c.id === comment.id),
      1
    );

    const response: DeleteCommentResponse = {
      message: "Comment successfully removed",
    };
    return HttpResponse.json(response);
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Forbidden",
        patchCommentPath,
        "you do not have permission to perform actions on this entity"
      ),
      { status: 403 }
    );
  }
});

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

export const patchComment_InternalServerError = http.patch<
  PatchCommentParams,
  PatchCommentRequest,
  InternalServerError500ResponseType
>(patchCommentPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      patchCommentPath,
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

export const handlers = [
  getCommentsFeed,
  getSingleComment,
  addComment,
  patchComment,
  deleteComment,
];

export const internalServerErrorHandlers = [
  getCommentsFeed_InternalServerError,
  getSingleComment_InternalServerError,
  addComment_InternalServerError,
  patchComment_InternalServerError,
  deleteComment_InternalServerError,
];
