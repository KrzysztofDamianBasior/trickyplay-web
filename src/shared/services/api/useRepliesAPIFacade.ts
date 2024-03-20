import { useContext } from "react";

import { AccountContext, type AuthStateType } from "../account/AccountContext";
import { NotificationContext } from "../snackbars/NotificationsContext";
import {
  type CommentDetailsType,
  type ReplyDetailsType,
} from "../../models/internalAppRepresentation/resources";
import { type ErrorMessageKind } from "../../utils/mapResponseErrorToMessage";
import { getEnvironmentVariable, mapResponseErrorToMessage } from "../../utils";

const REPLIES_URL: string = getEnvironmentVariable("REACT_APP_REPLIES_URL");
const REPLIES_FEED_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_REPLIES_FEED_ENDPOINT"
);

const USERS_URL: string = getEnvironmentVariable("REACT_APP_USERS_URL");
const USER_REPLIES_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_USER_REPLIES_ENDPOINT"
);

export type DeleteReplyProps = ReplyDetailsType;
export type DeleteReplyResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type GetReplyProps = { id: string };
export type GetReplyResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  reply: ReplyDetailsType | null;
}>;

export type GetRepliesByAuthorProps = {
  authorId: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  orderDirection: string;
};
export type GetRepliesByParentCommentProps = {
  parentCommentId: string | null;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  orderDirection: string;
};
export type GetRepliesResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  replies: ReplyDetailsType[] | null;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
}>;

export type CreateReplyProps = {
  body: string;
  parentCommentId: string;
};
export type CreateReplyResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  reply: ReplyDetailsType | null;
}>;

export type UpdateReplyProps = {
  currentReplyDetails: ReplyDetailsType;
  newReplyBody: string;
};
export type UpdateReplyResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  reply: ReplyDetailsType | null;
}>;

export type RepliesActionsType = {
  getRepliesByParentComment: (
    getRepliesProps: GetRepliesByParentCommentProps
  ) => GetRepliesResultType;
  getRepliesByAuthor: (
    getRepliesProps: GetRepliesByAuthorProps
  ) => GetRepliesResultType;
  getReply: (getReplyProps: GetReplyProps) => GetReplyResultType;
  createReply: (createReplyProps: CreateReplyProps) => CreateReplyResultType;
  updateReply: (updateReplyProps: UpdateReplyProps) => UpdateReplyResultType;
  deleteReply: (deleteReplyProps: DeleteReplyProps) => DeleteReplyResultType;
  authState: AuthStateType;
};

export default function useRepliesAPIFacade(): RepliesActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);

  const deleteReply = async ({
    id,
    author,
  }: DeleteReplyProps): DeleteReplyResultType => {
    if (
      authState.user !== null &&
      (authState.user.role === "ADMIN" || authState.user.id === author.id)
    ) {
      try {
        const response = await axiosPrivate.delete(REPLIES_URL + "/" + id); // DELETE {{api-url}}/replies/:id
        // response.data.message
        //   {
        //     "message": "Reply successfully removed",
        //   }
        openSnackbar({
          title: `Successfully performed actions on the reply with id: ${id}`,
          body: "Reply removed successfully",
          severity: "success",
        });
        return {
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `Failed to perform actions on the reply with id: ${id}`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
        };
      }
    } else {
      openSnackbar({
        title: `Failed to perform actions on the reply with id: ${id}`,
        body: "You do not have sufficient permissions",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
      };
    }
  };

  const updateReply = async ({
    newReplyBody,
    currentReplyDetails,
  }: UpdateReplyProps): UpdateReplyResultType => {
    if (
      authState.user !== null &&
      (authState.user.role === "ADMIN" ||
        authState.user.id === currentReplyDetails.author.id)
    ) {
      try {
        const response = await axiosPrivate.patch(
          // {{api-url}}/replies/:id    "newReplyBody": "asdf"
          REPLIES_URL + "/" + currentReplyDetails.id,
          {
            newReplyBody,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newReplyDetails: ReplyDetailsType = {
          author: {
            id: response.data.author.id,
            name: response.data.author.name,
            role: response.data.author.role,
            createdAt: response.data.author.createdAt,
            updatedAt: response.data.author.updatedAt,
          },
          body: response.data.body,
          id: response.data.id,
          parentCommentId: response.data.parentComment.id,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        openSnackbar({
          title: `Successfully performed actions on the reply with id: ${newReplyDetails.id}`,
          body: "Reply updated successfully",
          severity: "error",
        });
        return {
          reply: newReplyDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `Failed to perform actions on the reply with id: ${currentReplyDetails.id}`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          reply: null,
        };
      }
    } else {
      openSnackbar({
        title: `Failed to perform actions on the reply with id: ${currentReplyDetails.id}`,
        body: "You do not have sufficient permissions",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        reply: null,
      };
    }
  };

  const createReply = async ({
    body,
    parentCommentId,
  }: CreateReplyProps): CreateReplyResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.post(
          // {{api-url}}/replies
          //   {
          //     "body": "asdf",
          //     "parentCommentId": 2
          //   }
          REPLIES_URL,
          {
            body,
            parentCommentId,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const newReplyDetails: ReplyDetailsType = {
          author: {
            id: response.data.author.id,
            name: response.data.author.name,
            role: response.data.author.role,
            createdAt: response.data.author.createdAt,
            updatedAt: response.data.author.updatedAt,
          },
          id: response.data.id,
          body: response.data.body,
          parentCommentId: response.data.parentComment.id,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        openSnackbar({
          title: `Successfully performed actions on the reply with id: ${newReplyDetails.id}`,
          body: "Reply created successfully",
          severity: "success",
        });
        return {
          reply: newReplyDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `Failed to create new reply`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          reply: null,
        };
      }
    } else {
      openSnackbar({
        title: `Failed to create new reply`,
        body: "You do not have sufficient permissions",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        reply: null,
      };
    }
  };

  const getReply = async ({ id }: GetReplyProps): GetReplyResultType => {
    try {
      const response = await axiosPublic.get(REPLIES_URL + "/" + id); // {{api-url}}/replies/:id

      const newReplyDetails: ReplyDetailsType = {
        author: {
          id: response.data.author.id,
          name: response.data.author.name,
          role: response.data.author.role,
          createdAt: response.data.author.createdAt,
          updatedAt: response.data.author.updatedAt,
        },
        body: response.data.body,
        id: response.data.id,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        parentCommentId: response.data.parentComment.id,
      };

      openSnackbar({
        title: "Success",
        body: `Successfully fetched reply with id: ${newReplyDetails.id}`,
        severity: "success",
      });
      return {
        reply: newReplyDetails,
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      openSnackbar({
        title: `Failed to perform actions on the reply with id: ${id}`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        reply: null,
      };
    }
  };

  const getRepliesByParentComment = async ({
    parentCommentId,
    pageNumber,
    pageSize,
    orderDirection,
    sortBy,
  }: GetRepliesByParentCommentProps): GetRepliesResultType => {
    // const offset = page * perPage - perPage;
    try {
      const response = await axiosPublic.get(
        REPLIES_URL + "/" + REPLIES_FEED_ENDPOINT, // {{api-url}}/replies/feed?parentCommentId=2&pageNumber=0&pageSize=3&sortBy=id&orderDirection=Asc
        {
          params: {
            orderDirection,
            pageNumber,
            pageSize,
            sortBy,
            parentCommentId,
          },
        }
      );

      const replies: ReplyDetailsType[] = response.data.replies.map(function (
        reply: Omit<ReplyDetailsType, "parentCommentId"> & { _links: any } & {
          parentComment: CommentDetailsType & { _links: any };
        },
        index: number
      ) {
        return {
          id: reply.id,
          body: reply.body,
          author: {
            id: reply.author.id,
            name: reply.author.name,
            role: reply.author.role,
            createdAt: reply.author.createdAt,
            updatedAt: reply.author.updatedAt,
          },
          parentCommentId: reply.parentComment.id,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        };
      });
      openSnackbar({
        title: "Successfully performed actions on replies",
        body: "Replies fetched successfully",
        severity: "success",
      });
      return {
        replies: replies,
        message: "Success",
        status: response.status,
        isLast: response.data.last,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      };
    } catch (err: any) {
      openSnackbar({
        title: `Failed to fetch replies`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        replies: null,
        isLast: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      };
    }
  };

  const getRepliesByAuthor = async ({
    authorId,
    pageNumber,
    pageSize,
    orderDirection,
    sortBy,
  }: GetRepliesByAuthorProps): GetRepliesResultType => {
    // const offset = page * perPage - perPage;
    try {
      const response = await axiosPublic.get(
        // {{api-url}}/users/:id/replies?pageNumber=0&pageSize=3&sortBy=id&orderDirection=Asc
        USERS_URL + "/" + authorId + "/" + USER_REPLIES_ENDPOINT,
        {
          params: {
            orderDirection,
            pageNumber,
            pageSize,
            sortBy,
          },
        }
      );

      const replies: ReplyDetailsType[] = response.data.replies.map(function (
        reply: Omit<ReplyDetailsType, "parentCommentId"> & { _links: any } & {
          parentComment: CommentDetailsType & { _links: any };
        },
        index: number
      ) {
        return {
          id: reply.id,
          body: reply.body,
          author: {
            id: reply.author.id,
            name: reply.author.name,
            role: reply.author.role,
            createdAt: reply.author.createdAt,
            updatedAt: reply.author.updatedAt,
          },
          parentCommentId: reply.parentComment.id,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        };
      });
      openSnackbar({
        title: "Successfully performed actions on replies",
        body: "Replies fetched successfully",
        severity: "success",
      });
      return {
        replies: replies,
        message: "Success",
        status: response.status,
        isLast: response.data.last,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      };
    } catch (err: any) {
      openSnackbar({
        title: `failed to fetch replies`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        replies: null,
        isLast: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      };
    }
  };

  return {
    createReply,
    deleteReply,
    getRepliesByAuthor,
    getRepliesByParentComment,
    getReply,
    updateReply,
    authState,
  };
}
