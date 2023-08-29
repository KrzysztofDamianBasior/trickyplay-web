import { useContext } from "react";

import { AccountContext } from "../account/AccountContext";
import { mapResponseErrorToMessage, wait } from "../../utils";
import { ErrorMessageKind } from "../../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "./useUsersAPIFacade";
import { GameNameType } from "../games/gamesDetails";
import { NotificationContext } from "../snackbars/NotificationsContext";

export type CommentDetailsType = {
  id: string;
  body: string;
  author: UserDetailsType;
  createdAt: string;
  lastUpdatedAt: string;
  gameName: GameNameType;
};

export const comments: CommentDetailsType[] = [
  {
    id: "1",
    body: "First comment",
    author: {
      id: "1",
      name: "Dinotrex",
      roles: ["User"],
      createdAt: "2023-08-06T11:23:36.172Z", // ISO-8601 stored in UTC
      lastUpdatedAt: "2023-08-06T11:23:36.172Z", // ISO-8601 stored in UTC
    },
    createdAt: "2023-08-06T11:23:36.172Z", // ISO-8601 stored in UTC
    lastUpdatedAt: "2023-08-06T11:23:36.172Z", // ISO-8601 stored in UTC
    gameName: "Minesweeper",
  },
  {
    id: "2",
    body: "Second comment",
    author: {
      id: "2",
      name: "Margary",
      roles: ["User"],
      createdAt: "2023-08-06T11:23:36.172Z", // ISO-8601 stored in UTC
      lastUpdatedAt: "2023-08-06T11:23:36.172Z", // ISO-8601 stored in UTC
    },
    createdAt: "2023-08-06T11:24:14.887Z", // ISO-8601 stored in UTC
    lastUpdatedAt: "2023-08-06T11:24:14.887Z", // ISO-8601 stored in UTC
    gameName: "Minesweeper",
  },
];

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

export type GetCommentsProps = {
  gameName: string;
  page: number;
  perPage: number;
};
export type GetCommentsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comments: CommentDetailsType[] | null;
  totalNumberOfComments: number | null;
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
  body: string;
};
export type UpdateCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;

export type CommentsActionsType = {
  getComments: (getCommentsProps: GetCommentsProps) => GetCommentsResultType;
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
  // getCommentsWithReplies: (
  //   getCommentsProps: GetCommentsProps
  // ) => GetCommentsWithRepliesResultType;
  // getCommentWithReplies: (
  //   getCommentProps: GetCommentProps
  // ) => GetCommentWithRepliesResultType;
};

type Props = {
  userId?: string;
};

export default function useCommentsAPIFacade({
  userId,
}: Props): CommentsActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);
  const COMMENTS_URL = process.env.REACT_APP_COMMENTS_URL;

  const deleteComment = async ({
    id,
  }: DeleteCommentProps): DeleteCommentResultType => {
    try {
      if (authState.user !== null) {
        //   const response = await axiosPrivate.delete(
        //     COMMENTS_URL,
        //     JSON.stringify({
        //       id
        //     }),
        //     {
        //       headers: { "Content-Type": "application/json" },
        //       withCredentials: true,
        //     }
        //   );
        //   console.log(JSON.stringify(response?.data));
        //   console.log(JSON.stringify(response));
        await wait(0, 500);
        const commentIndex: number = comments.findIndex(
          (comment) => comment.id === id
        );
        if (commentIndex !== -1) {
          comments.splice(commentIndex);
          openSnackbar({
            title: `successfully performed actions on the comment with id: ${id}`,
            body: "comment removed successfully",
            severity: "success",
          });
          return {
            message: "Success",
            status: 200,
          };
        } else {
          openSnackbar({
            title: `failed to perform actions on the comment with id: ${id}`,
            body: "comment not found",
            severity: "error",
          });
          return {
            message: "Not found",
            status: 404,
          };
        }
      } else {
        openSnackbar({
          title: `failed to perform actions on the comment with id: ${id}`,
          body: "you do not have sufficient permissions",
          severity: "error",
        });
        return {
          message: "Lack of sufficient permissions",
          status: 401,
        };
      }
    } catch (err: any) {
      openSnackbar({
        title: `failed to perform actions on the comment with id: ${id}`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
      };
    }
  };

  const updateComment = async ({
    id,
    body,
  }: UpdateCommentProps): UpdateCommentResultType => {
    try {
      if (authState.user !== null) {
        //   const response = await axiosPrivate.patch(
        //     COMMENTS_URL,
        //     JSON.stringify({
        //       id, body
        //     }),
        //     {
        //       headers: { "Content-Type": "application/json" },
        //       withCredentials: true,
        //     }
        //   );
        //   console.log(JSON.stringify(response?.data));
        //   console.log(JSON.stringify(response));
        await wait(0, 500);
        const now = new Date();
        const comment: CommentDetailsType | undefined = comments.find(
          (comment) => comment.id === id
        );
        if (comment) {
          comment.body = body;
          comment.lastUpdatedAt = now.toISOString();
          openSnackbar({
            title: `successfully performed actions on the comment with id: ${id}`,
            body: "comment updated successfully",
            severity: "error",
          });
          return {
            comment,
            message: "Success",
            status: 200,
          };
        } else {
          openSnackbar({
            title: `failed to perform actions on the comment with id: ${id}`,
            body: "comment not found",
            severity: "error",
          });
          return {
            message: "Not found",
            status: 404,
            comment: null,
          };
        }
      } else {
        openSnackbar({
          title: `failed to perform actions on the comment with id: ${id}`,
          body: "you do not have sufficient permissions",
          severity: "error",
        });
        return {
          message: "Lack of sufficient permissions",
          status: 401,
          comment: null,
        };
      }
    } catch (err: any) {
      openSnackbar({
        title: `failed to perform actions on the comment with id: ${id}`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const createComment = async ({
    body,
    gameName,
  }: CreateCommentProps): CreateCommentResultType => {
    try {
      //   const response = await axiosPrivate.post(
      //     COMMENTS_URL,
      //     JSON.stringify({
      //       body,
      //       parentId
      //     }),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      if (authState.user !== null) {
        const now = new Date();
        const comment: CommentDetailsType = {
          author: authState.user,
          body,
          gameName: "Minesweeper",
          id: Math.random().toString(36).substr(2, 9),
          createdAt: now.toISOString(),
          lastUpdatedAt: now.toISOString(),
        };
        comments.push(comment);
        await wait(0, 500);
        openSnackbar({
          title: `successfully performed actions on the comment with id: ${comment.id}`,
          body: "comment created successfully",
          severity: "error",
        });
        return {
          comment,
          message: "Success",
          status: 200,
        };
      } else {
        openSnackbar({
          title: `failed to create new comment`,
          body: "you do not have sufficient permissions",
          severity: "error",
        });
        return {
          message: "Lack of sufficient permissions",
          status: 401,
          comment: null,
        };
      }
    } catch (err: any) {
      openSnackbar({
        title: `failed to create new comment`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const getComment = async ({ id }: GetCommentProps): GetCommentResultType => {
    try {
      //   const response = await axiosPublic.get(
      //     COMMENTS_URL,
      //     JSON.stringify({id}),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      const comment = comments.find((comment) => comment.id === id);
      await wait(0, 500);
      if (comment) {
        openSnackbar({
          title: "success",
          body: `successfully performed actions on the comment with id: ${comment.id}`,
          severity: "success",
        });
        return {
          comment,
          message: "Success",
          status: 200,
        };
      } else {
        openSnackbar({
          title: `failed to perform actions on the comment with id: ${id}`,
          body: "comment not found",
          severity: "error",
        });
        return {
          message: "Not found",
          status: 404,
          comment: null,
        };
      }
    } catch (err: any) {
      openSnackbar({
        title: `failed to perform actions on the comment with id: ${id}`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const getComments = async ({
    gameName,
    page,
    perPage,
  }: GetCommentsProps): GetCommentsResultType => {
    try {
      //   const response = await axiosPublic.get(
      //     COMMENTS_URL,
      //     JSON.stringify({
      //       gameName
      //       page,
      //       perPage,
      //     }),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      await wait(0, 500);
      const offset = page * perPage - perPage;

      let commentsSet: CommentDetailsType[] = [];
      if (offset > comments.length) {
        if (offset + perPage < comments.length) {
          commentsSet = comments
            .filter((comm) => comm.gameName === gameName)
            .slice(offset, offset + perPage);
        } else {
          commentsSet = comments
            .filter((comm) => comm.gameName === gameName)
            .slice(offset);
        }
      }
      // commentsSet.forEach((comment) => (comment.replies = null));
      openSnackbar({
        title: "successfully performed actions on comments",
        body: "comments fetched successfully",
        severity: "success",
      });
      return {
        comments: commentsSet,
        message: "Success",
        status: 200,
        totalNumberOfComments: comments.length,
      };
    } catch (err: any) {
      openSnackbar({
        title: `failed to fetch comments`,
        body: mapResponseErrorToMessage(err),
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comments: null,
        totalNumberOfComments: null,
      };
    }
  };

  return {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    getComments,
  };
}
