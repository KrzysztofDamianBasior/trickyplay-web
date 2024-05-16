import { useContext } from "react";

import { AccountContext, type AuthStateType } from "../account/AccountContext";
import { NotificationContext } from "../snackbars/NotificationsContext";
import { type CommentDetailsType } from "../../models/internalAppRepresentation/resources";
import { type ErrorMessageKind } from "../../utils/mapResponseErrorToMessage";
import { getEnvironmentVariable, mapResponseErrorToMessage } from "../../utils";

const COMMENTS_URL: string = getEnvironmentVariable("VITE_COMMENTS_URL");
const COMMENTS_FEED_ENDPOINT: string = getEnvironmentVariable(
  "VITE_COMMENTS_FEED_ENDPOINT"
);

const USERS_URL: string = getEnvironmentVariable("VITE_USERS_URL");
const USER_COMMENTS_ENDPOINT: string = getEnvironmentVariable(
  "VITE_USER_COMMENTS_ENDPOINT"
);

export type DeleteCommentProps = {
  id: string;
};
export type DeleteCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type GetCommentProps = { id: string };
export type GetCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;

export type GetCommentsByAuthorProps = {
  authorId: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  orderDirection: string;
};
export type GetCommentsByGameNameProps = {
  gameName: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  orderDirection: string;
};
export type GetCommentsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comments: CommentDetailsType[] | null;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
}>;

export type CreateCommentProps = {
  body: string;
  gameName: string;
};
export type CreateCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;

export type UpdateCommentProps = {
  id: string;
  newCommentBody: string;
};
export type UpdateCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;

export type CommentsActionsType = {
  getCommentsByAuthor: (
    getCommentsProps: GetCommentsByAuthorProps
  ) => GetCommentsResultType;
  getCommentsByGameName: (
    getCommentsProps: GetCommentsByGameNameProps
  ) => GetCommentsResultType;
  getComment: (getCommentProps: GetCommentProps) => GetCommentResultType;
  createComment: (
    createCommentProps: CreateCommentProps
  ) => CreateCommentResultType;
  updateComment: (
    updateCommentProps: UpdateCommentProps
  ) => UpdateCommentResultType;
  deleteComment: (
    deleteCommentProps: DeleteCommentProps
  ) => DeleteCommentResultType;
  authState: AuthStateType;
};

export default function useCommentsAPIFacade(): CommentsActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);

  const deleteComment = async ({
    id,
  }: DeleteCommentProps): DeleteCommentResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.delete(COMMENTS_URL + "/" + id); // {{api-url}}/comments/:id
        // response.data.message
        openSnackbar({
          title: "Comment removed successfully",
          body: `Successfully removed comment with id: ${id}`,
          severity: "success",
        });
        return {
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        // eslint-disable-next-line eqeqeq
        if (err.response?.status != 403 || err.response?.status != 401) {
          // for axiosPrivate error notifications do not include errors 403 and 401
          openSnackbar({
            title: mapResponseErrorToMessage(err),
            body: `Failed to remove comment with id: ${id}`,
            severity: "error",
          });
        }
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
        };
      }
    } else {
      openSnackbar({
        title: "Error",
        body: `Failed to remove comment with id: ${id}, you are not signed in`,
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
      };
    }
  };

  const updateComment = async ({
    id,
    newCommentBody,
  }: UpdateCommentProps): UpdateCommentResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.patch(
          //  {{api-url}}/comments/:id
          // {
          //   "newCommentBody": "asdf"
          // }
          COMMENTS_URL + "/" + id,
          {
            newCommentBody,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newCommentDetails: CommentDetailsType = {
          author: {
            id: response.data?.author?.id,
            name: response.data?.author?.name,
            role: response.data?.author?.role,
            createdAt: response.data?.author?.createdAt,
            updatedAt: response.data?.author?.updatedAt,
          },
          id: response.data?.id,
          body: response.data?.body,
          gameName: response.data?.gameName,
          createdAt: response.data?.createdAt,
          updatedAt: response.data?.updatedAt,
        };

        openSnackbar({
          title: "Comment updated successfully",
          body: `Successfully updated comment with id: ${id}`,
          severity: "success",
        });
        return {
          comment: newCommentDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        // eslint-disable-next-line eqeqeq
        if (err.response?.status != 403 || err.response?.status != 401) {
          // for axiosPrivate error notifications do not include errors 403 and 401
          openSnackbar({
            title: mapResponseErrorToMessage(err),
            body: `Failed to update comment with id: ${id}`,
            severity: "error",
          });
        }
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          comment: null,
        };
      }
    } else {
      openSnackbar({
        title: "Error",
        body: `Failed to update comment with id: ${id}, you are not signed in`,
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        comment: null,
      };
    }
  };

  const createComment = async ({
    body,
    gameName,
  }: CreateCommentProps): CreateCommentResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.post(
          // POST {{api-url}}/comments
          //   {
          //     "body": "asdf",
          //     "gameName": "Snake"
          //   }
          COMMENTS_URL,
          {
            body,
            gameName,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const newCommentDetails: CommentDetailsType = {
          author: {
            id: response.data?.author?.id,
            name: response.data.author?.name,
            role: response.data.author?.role,
            createdAt: response.data?.author?.createdAt,
            updatedAt: response.data?.author?.updatedAt,
          },
          body: response.data?.body,
          id: response.data?.id,
          gameName: response.data?.gameName,
          createdAt: response.data?.createdAt,
          updatedAt: response.data?.updatedAt,
        };

        openSnackbar({
          title: "Comment created successfully",
          body: `Successfully added comment with id: ${newCommentDetails.id}`,
          severity: "success",
        });
        return {
          comment: newCommentDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        // eslint-disable-next-line eqeqeq
        if (err.response?.status != 403 || err.response?.status != 401) {
          // for axiosPrivate error notifications do not include errors 403 and 401
          openSnackbar({
            title: mapResponseErrorToMessage(err),
            body: `Failed to create new comment`,
            severity: "error",
          });
        }
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          comment: null,
        };
      }
    } else {
      openSnackbar({
        title: `Error`,
        body: "Failed to create new comment, you are not signed in",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        comment: null,
      };
    }
  };

  const getComment = async ({ id }: GetCommentProps): GetCommentResultType => {
    try {
      const response = await axiosPublic.get(COMMENTS_URL + "/" + id); // GET {{api-url}}/comments/:id

      const newCommentDetails: CommentDetailsType = {
        author: {
          id: response.data?.author?.id,
          name: response.data?.author?.name,
          role: response.data?.author?.role,
          createdAt: response.data?.author?.createdAt,
          updatedAt: response.data?.author?.updatedAt,
        },
        body: response.data?.body,
        id: response.data?.id,
        gameName: response.data?.gameName,
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt,
      };

      openSnackbar({
        title: "Success",
        body: `Successfully fetched the comment with id: ${newCommentDetails.id}`,
        severity: "success",
      });
      return {
        comment: newCommentDetails,
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      openSnackbar({
        title: mapResponseErrorToMessage(err),
        body: `Failed to fetch the comment with id: ${id}`,
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const getCommentsByGameName = async ({
    gameName,
    orderDirection,
    pageNumber,
    pageSize,
    sortBy,
  }: GetCommentsByGameNameProps): GetCommentsResultType => {
    // const offset = page * perPage - perPage;
    try {
      const response = await axiosPublic.get(
        // GET {{api-url}}/comments/feed?gameName=Snake&pageNumber=0&pageSize=3&sortBy=id&orderDirection=Asc
        COMMENTS_URL + "/" + COMMENTS_FEED_ENDPOINT,
        {
          params: {
            gameName,
            orderDirection,
            pageNumber,
            pageSize,
            sortBy,
          },
        }
      );
      const comments: CommentDetailsType[] = response.data?.comments?.map(
        function (
          comment: CommentDetailsType & { _links: any },
          index: number
        ) {
          return {
            id: comment.id,
            body: comment.body,
            gameName: comment.gameName,
            author: {
              id: comment.author.id,
              name: comment.author.name,
              role: comment.author.role,
              createdAt: comment.author.createdAt,
              updatedAt: comment.author.updatedAt,
            },
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          };
        }
      );

      openSnackbar({
        title: `Successfully fetched comments for ${gameName}`,
        body: `Page ${pageNumber + 1} with ${
          response.data?.comments?.length
        } out of ${
          response.data?.totalElements
        } comments fetched successfully.`,
        severity: "success",
      });
      return {
        comments: comments,
        message: "Success",
        status: response.status,
        isLast: response.data?.last,
        pageNumber: response.data?.pageNumber,
        pageSize: response.data?.pageSize,
        totalElements: response.data?.totalElements,
        totalPages: response.data?.totalPages,
      };
    } catch (err: any) {
      openSnackbar({
        title: mapResponseErrorToMessage(err),
        body: `Failed to fetch comments`,
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comments: null,
        isLast: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      };
    }
  };

  const getCommentsByAuthor = async ({
    authorId,
    orderDirection,
    pageNumber,
    pageSize,
    sortBy,
  }: GetCommentsByAuthorProps): GetCommentsResultType => {
    try {
      // const offset = page * perPage - perPage;
      const response = await axiosPublic.get(
        // {{api-url}}/users/:id/comments?pageNumber=0&pageSize=3&sortBy=id&orderDirection=Asc
        USERS_URL + "/" + authorId + "/" + USER_COMMENTS_ENDPOINT,
        {
          params: {
            orderDirection,
            pageNumber,
            pageSize,
            sortBy,
          },
        }
      );

      const comments: CommentDetailsType[] = response.data?.comments?.map(
        function (
          comment: CommentDetailsType & { _links: any },
          index: number
        ) {
          return {
            id: comment.id,
            body: comment.body,
            gameName: comment.gameName,
            author: {
              id: comment.author.id,
              name: comment.author.name,
              role: comment.author.role,
              createdAt: comment.author.createdAt,
              updatedAt: comment.author.updatedAt,
            },
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
          };
        }
      );

      openSnackbar({
        title: `Successfully fetched comments created by user with id ${authorId}`,
        body: `Page ${pageNumber + 1} with ${
          response.data?.comments?.length
        } out of ${
          response.data?.totalElements
        } comments fetched successfully.`,
        severity: "success",
      });
      return {
        comments: comments,
        message: "Success",
        status: response.status,
        isLast: response.data?.last,
        pageNumber: response.data?.pageNumber,
        pageSize: response.data?.pageSize,
        totalElements: response.data?.totalElements,
        totalPages: response.data?.totalPages,
      };
    } catch (err: any) {
      openSnackbar({
        title: mapResponseErrorToMessage(err),
        body: "Failed to fetch comments",
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comments: null,
        isLast: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      };
    }
  };

  return {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    getCommentsByAuthor,
    getCommentsByGameName,
    authState,
  };
}
