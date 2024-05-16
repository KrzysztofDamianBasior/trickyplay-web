import { http, HttpResponse } from "msw";

import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { isAuthenticated } from "../helpers/isAuthenticated";
import { extractParentCommentId } from "../helpers/extractParentCommentIdOrThrow";
import { extractPaginationArguments } from "../helpers/extractPaginationArguments";
import { sortCollection } from "../helpers/sortCollection";
import { validateId } from "../helpers/validateId";

import {
  type DeleteReplyResponse,
  type GetRepliesResponse,
} from "../../../shared/models/externalApiRepresentation/Responses";
import {
  type InternalServerError500ResponseType,
  type NotFound404ResponseType,
} from "../../../shared/models/externalApiRepresentation/Errors";
import {
  type DeleteReplyParams,
  type PatchReplyParams,
  type GetSingleReplyParams,
} from "../../../shared/models/externalApiRepresentation/Params";
import { type ReplyRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";
import {
  type AddReplyRequest,
  type PatchReplyRequest,
} from "../../../shared/models/externalApiRepresentation/Requests";

import {
  addReplyPath,
  deleteReplyPath,
  getRepliesFeedPath,
  getSingleReplyPath,
  patchReplyPath,
} from "../urls";

import { repliesCollectionStub } from "../stubs/replies";
import { usersCollectionStub } from "../stubs/users";
import { commentsCollectionStub } from "../stubs/comments";

export const getRepliesFeed = http.get<{}, {}, GetRepliesResponse>(
  getRepliesFeedPath,
  async ({ request, params, cookies }) => {
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url);
    const { orderDirection, pageNumber, pageSize, sortBy } =
      extractPaginationArguments(url);
    const parentCommentId = extractParentCommentId(url);

    const sortedCollection = sortCollection({
      entitiesCollection: repliesCollectionStub.filter(
        (reply) => reply.parentComment.id === parentCommentId
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
  }
);

export const getSingleReply = http.get<
  GetSingleReplyParams,
  {},
  ReplyRepresentation
>(getSingleReplyPath, async ({ request, params, cookies }) => {
  const { id } = params;
  validateId({ id, path: getSingleReplyPath });

  const reply = repliesCollectionStub.find((r) => r.id === parseInt(id));

  if (reply == null) {
    // or check for reply === undefined
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Not Found",
        getSingleReplyPath,
        "reply not found"
      ),
      { status: 404 }
    );
  }

  return HttpResponse.json(reply);
});

export const addReply = http.post<{}, AddReplyRequest, ReplyRepresentation>(
  addReplyPath,
  async ({ params, request, cookies }) => {
    const username = isAuthenticated(request, addReplyPath);

    const data = await request.formData();
    let body = data.get("body");
    let parentCommentId = data.get("parentCommentId");

    if (body !== null && parentCommentId !== null) {
      body = body as string; // FormData.get() returns a value of type string | File | null.
      parentCommentId = parentCommentId as string; // FormData.get() returns a value of type string | File | null.

      if (body.length < 1 || body.length > 300) {
        throw HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            addReplyPath,
            "Invalid body length"
          )
        );
      }

      if (!/^[1-9]\d*$/.test(parentCommentId)) {
        throw HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            addReplyPath,
            "Invalid parentCommendId"
          )
        );
      }
      const parentComment = commentsCollectionStub.find(
        (comment) => comment.id === parseInt(parentCommentId as string)
      );
      if (parentComment == null) {
        const responseBody = generateErrorResponseBody(
          "Not Found",
          addReplyPath,
          "comment not found"
        );
        throw HttpResponse.json(responseBody, { status: 404 });
      }

      const signedUser = usersCollectionStub.find(
        (user) => user.name === username
      );
      if (signedUser == null) {
        const responseBody = generateErrorResponseBody(
          "Not Found",
          addReplyPath,
          "user not found"
        );
        throw HttpResponse.json(responseBody, { status: 404 });
      }

      const now = new Date();

      // three oneliners which handle search for next id:
      const nextId =
        repliesCollectionStub.reduce((a, b) => (a.id > b.id ? a : b)).id + 1; // time complexity:  O(n)
      // const nextId = commentsCollectionStub.sort((a, b) => b.id - a.id)[0].id +1; // time complexity:  O(nlogn)
      // const nextId:number = Math.max(...commentsCollectionStub.map(comm=>comm.id)) +1;     // time complexity: >O(2n)

      const response: ReplyRepresentation = {
        body,
        createdAt: now.toISOString().split(".")[0],
        updatedAt: now.toISOString().split(".")[0],
        author: signedUser,
        id: nextId,
        parentComment: parentComment,
      };

      return HttpResponse.json(response, {
        status: 201,
        statusText: "created /replies/" + nextId,
      });
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          addReplyPath,
          "field is missing in the request body"
        )
      );
    }
  }
);

export const patchReply = http.patch<
  PatchReplyParams,
  PatchReplyRequest,
  ReplyRepresentation
>(patchReplyPath, async ({ request, params, cookies }) => {
  const username = isAuthenticated(request, patchReplyPath);
  const { id } = params;
  validateId({ id, path: patchReplyPath });

  const data = await request.formData();
  let newReplyBody = data.get("newReplyBody");

  if (newReplyBody !== null) {
    newReplyBody = newReplyBody as string; // FormData.get() returns a value of type string | File | null.

    if (newReplyBody.length < 1 && newReplyBody.length > 300) {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          patchReplyPath,
          "Reply body must contain between 1 and 300 characters."
        )
      );
    }

    const reply = repliesCollectionStub.find((r) => r.id === parseInt(id));
    if (reply == null) {
      // or check for comment === undefined
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Not Found",
          patchReplyPath,
          "reply not found"
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
        patchReplyPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    if (reply.author.name === username || signedUser.role === "ADMIN") {
      const now = new Date();
      const response: ReplyRepresentation = {
        ...reply,
        updatedAt: now.toISOString().split(".")[0],
        body: newReplyBody,
      };
      return HttpResponse.json(response);
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Forbidden",
          patchReplyPath,
          "you do not have permission to perform actions on this entity"
        )
      );
    }
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        addReplyPath,
        "field is missing in the request body"
      )
    );
  }
});

export const deleteReply = http.delete<
  DeleteReplyParams,
  {},
  DeleteReplyResponse
>(deleteReplyPath, async ({ request, params, cookies }) => {
  // user:delete or ROLE_ADMIN
  const username = await isAuthenticated(request, deleteReplyPath);

  const { id } = params;
  validateId({ id, path: deleteReplyPath });

  const reply = repliesCollectionStub.find((r) => r.id === parseInt(id));
  if (reply == null) {
    // or check for comment === undefined
    return HttpResponse.json(
      generateErrorResponseBody(
        "Not Found",
        deleteReplyPath,
        "comment not found"
      ),
      { status: 404 }
    );
  }

  const signedUser = usersCollectionStub.find((user) => user.name === username);
  if (signedUser == null) {
    const responseBody = generateErrorResponseBody(
      "Not Found",
      deleteReplyPath,
      "user not found"
    );
    throw HttpResponse.json(responseBody, { status: 404 });
  }

  if (reply.author.name === username || signedUser.role === "ADMIN") {
    repliesCollectionStub.splice(
      repliesCollectionStub.findIndex((r) => r.id === reply.id),
      1
    );

    const response: DeleteReplyResponse = {
      message: "Reply successfully removed",
    };
    return HttpResponse.json(response);
  } else {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Forbidden",
        deleteReplyPath,
        "you do not have permission to perform actions on this entity"
      ),
      { status: 403 }
    );
  }
});

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

export const patchReply_ReplyNotFound = http.patch<
  PatchReplyParams,
  {},
  NotFound404ResponseType
>(patchReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody("Not Found", patchReplyPath, "reply not found"),
    { status: 404 }
  );
});

export const getRepliesFeed_InternalServerError = http.get<
  {},
  {},
  InternalServerError500ResponseType
>(getRepliesFeedPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getRepliesFeedPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const getSingleReply_InternalServerError = http.get<
  GetSingleReplyParams,
  {},
  InternalServerError500ResponseType
>(getSingleReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      getSingleReplyPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const addReply_InternalServerError = http.post<
  {},
  AddReplyRequest,
  InternalServerError500ResponseType
>(addReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      addReplyPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const patchReply_InternalServerError = http.patch<
  PatchReplyParams,
  PatchReplyRequest,
  InternalServerError500ResponseType
>(patchReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      patchReplyPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const deleteReply_InternalServerError = http.delete<
  DeleteReplyParams,
  {},
  InternalServerError500ResponseType
>(deleteReplyPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      deleteReplyPath,
      "Internal Server Error"
    ),
    { status: 500 }
  );
});

export const handlers = [
  getRepliesFeed,
  getSingleReply,
  addReply,
  patchReply,
  deleteReply,
];

export const internalServerErrorHandlers = [
  getRepliesFeed_InternalServerError,
  getSingleReply_InternalServerError,
  addReply_InternalServerError,
  patchReply_InternalServerError,
  deleteReply_InternalServerError,
];

export const replyNotFoundHandlers = [
  getSingleReply_ReplyNotFound,
  patchReply_ReplyNotFound,
  deleteReply_ReplyNotFound,
];
