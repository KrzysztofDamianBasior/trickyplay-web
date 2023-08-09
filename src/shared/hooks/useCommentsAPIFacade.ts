import { useContext } from "react";

import { AuthContext } from "./useAuth";
import { mapResponseErrorToMessage, wait } from "../utils";
import { ErrorMessageKind } from "../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "./useUsersAPIFacade";
import { ReplyDetailsType } from "./useRepliesAPIFacade";

import { replies } from "./useRepliesAPIFacade";

export type CommentDetailsType = {
  id: string;
  body: string;
  author: UserDetailsType;
  replies: ReplyDetailsType[] | null;
  createdAt: string;
  lastUpdatedAt: string;
};

export const comments: CommentDetailsType[] = [
  {
    id: "1",
    body: "First comment",
    author: {
      id: "1",
      name: "Dinotrex",
      roles: ["User"],
      createdAt: "2023-08-06T11:23:36.172Z",
      lastUpdatedAt: "2023-08-06T11:23:36.172Z",
    },
    createdAt: "2023-08-06T11:23:36.172Z",
    lastUpdatedAt: "2023-08-06T11:23:36.172Z",
    replies: null,
  },
  {
    id: "2",
    body: "Second comment",
    author: {
      id: "2",
      name: "Margary",
      roles: ["User"],
      createdAt: "2023-08-06T11:23:36.172Z",
      lastUpdatedAt: "2023-08-06T11:23:36.172Z",
    },
    createdAt: "2023-08-06T11:24:14.887Z",
    lastUpdatedAt: "2023-08-06T11:24:14.887Z",
    replies: null,
  },
];

// offset-based pagination:
// -offset (alternatively page or skip) - indicates how many elements should be omitted from the response
// -per_page (alternatively limit or count) - indicates how many items should be on one page of results
// offset = page * per_page - per_page

export type DeleteCommentProps = { id: string };
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
  comments: CommentDetailsType[];
  totalNumberOfComments: number;
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
  getCommentsWithReplies: (
    getCommentsProps: GetCommentsProps
  ) => GetCommentsResultType;
  getCommentsWithoutReplies: (
    getCommentsProps: GetCommentsProps
  ) => GetCommentsResultType;
  getCommentWithReplies: (
    getCommentProps: GetCommentProps
  ) => GetCommentResultType;
  getCommentWithoutReplies: (
    getCommentProps: GetCommentProps
  ) => GetCommentResultType;
  createComment: (
    createCommentProps: CreateCommentProps
  ) => CreateCommentResultType;
  updateComment: (
    updateCommentProps: UpdateCommentProps
  ) => UpdateCommentResultType;
  deleteComment: (
    deleteCommentProps: DeleteCommentProps
  ) => DeleteCommentResultType;
};

export default function useCommentsAPIFacade(): CommentsActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AuthContext);
  const COMMENTS_URL = process.env.REACT_APP_COMMENTS_URL;

  const deleteComment = async ({
    id,
  }: DeleteCommentProps): DeleteCommentResultType => {
    try {
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
      if (authState.user !== null) {
        const commentIndex: number = comments.findIndex(
          (comment) => comment.id === id
        );
        if (commentIndex !== -1) {
          comments.splice(commentIndex);
          return {
            message: "Success",
            status: 200,
          };
        } else {
          return {
            message: "Not Found",
            status: 404,
          };
        }
      } else {
        return {
          message: "Unauthorized",
          status: 401,
        };
      }
    } catch (err: any) {
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
      if (authState.user !== null) {
        const now = new Date();
        const comment: CommentDetailsType | undefined = comments.find(
          (comment) => comment.id === id
        );
        if (comment) {
          comment.body = body;
          comment.lastUpdatedAt = now.toISOString();
          return {
            comment,
            message: "Success",
            status: 200,
          };
        } else {
          return {
            message: "Not Found",
            status: 404,
            comment: null,
          };
        }
      } else {
        return {
          message: "Unauthorized",
          status: 401,
          comment: null,
        };
      }
    } catch (err: any) {
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
          author: {
            id: authState.user.id,
            name: authState.user?.name,
            roles: ["User"],
            createdAt: authState.user.createdAt,
            lastUpdatedAt: authState.user.lastUpdatedAt,
          },
          body,
          replies: [],
          id: Math.random().toString(36).substr(2, 9),
          createdAt: now.toISOString(),
          lastUpdatedAt: now.toISOString(),
        };
        comments.push(comment);
        await wait(0, 500);
        return {
          comment,
          message: "Success",
          status: 200,
        };
      } else {
        return {
          message: "Unauthorized",
          status: 401,
          comment: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const getCommentWithReplies = async ({
    id,
  }: GetCommentProps): GetCommentResultType => {
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
        comment.replies = replies.filter(
          (reply) => reply.parentId === comment.id
        );
        return {
          comment,
          message: "Success",
          status: 200,
        };
      } else {
        return {
          message: "Not Found",
          status: 404,
          comment: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const getCommentWithoutReplies = async ({
    id,
  }: GetCommentProps): GetCommentResultType => {
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
        return {
          comment,
          message: "Success",
          status: 200,
        };
      } else {
        return {
          message: "Not Found",
          status: 404,
          comment: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comment: null,
      };
    }
  };

  const getCommentsWithReplies = async ({
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
          commentsSet = comments.slice(offset, offset + perPage);
        } else {
          commentsSet = comments.slice(offset);
        }
      }
      commentsSet.forEach((comment) => {
        comment.replies = replies.filter(
          (reply) => reply.parentId === comment.id
        );
      });

      return {
        comments: commentsSet,
        message: "Success",
        status: 200,
        totalNumberOfComments: comments.length,
      };
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comments: [],
        totalNumberOfComments: 0,
      };
    }
  };

  const getCommentsWithoutReplies = async ({
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
          commentsSet = comments.slice(offset, offset + perPage);
        } else {
          commentsSet = comments.slice(offset);
        }
      }
      commentsSet.forEach((comment) => (comment.replies = null));

      return {
        comments: commentsSet,
        message: "Success",
        status: 200,
        totalNumberOfComments: comments.length,
      };
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comments: [],
        totalNumberOfComments: 0,
      };
    }
  };

  return {
    createComment,
    deleteComment,
    updateComment,
    getCommentWithReplies,
    getCommentWithoutReplies,
    getCommentsWithReplies,
    getCommentsWithoutReplies,
  };
}
