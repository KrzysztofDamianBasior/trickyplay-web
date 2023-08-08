import { useContext } from "react";

import { AuthContext } from "../auth/useAuth";
import { mapResponseErrorToMessage, wait } from "../utils";
import { ErrorMessageKind } from "../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "./useUsersAPIFacade";

export type CommentDetailsType = {
  id: string;
  body: string;
  author: UserDetailsType;
  parentId: null | string;
  createdAt: string;
  lastUpdatedAt: string;
};

const comments: CommentDetailsType[] = [
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
    parentId: null,
    createdAt: "2023-08-06T11:23:36.172Z",
    lastUpdatedAt: "2023-08-06T11:23:36.172Z",
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
    parentId: null,
    createdAt: "2023-08-06T11:24:14.887Z",
    lastUpdatedAt: "2023-08-06T11:24:14.887Z",
  },
  {
    id: "3",
    body: "First comment first child",
    author: {
      id: "2",
      name: "Margary",
      roles: ["User"],
      createdAt: "2023-08-06T11:23:36.172Z",
      lastUpdatedAt: "2023-08-06T11:23:36.172Z",
    },
    parentId: "1",
    createdAt: "2023-08-06T11:25:01.245Z",
    lastUpdatedAt: "2023-08-06T11:25:01.245Z",
  },
  {
    id: "4",
    body: "Second comment second child",
    author: {
      id: "2",
      name: "Margary",
      roles: ["User"],
      createdAt: "2023-08-06T11:23:36.172Z",
      lastUpdatedAt: "2023-08-06T11:23:36.172Z",
    },
    parentId: "2",
    createdAt: "2023-08-06T11:25:33.405Z",
    lastUpdatedAt: "2023-08-06T11:25:33.405Z",
  },
];

// offset-based pagination:
// -offset (alternatively page or skip) - indicates how many elements should be omitted from the response
// -per_page (alternatively limit or count) - indicates how many items should be on one page of results
// offset = page * per_page - per_page

export type DeleteCommentProps = { id: string };
export type GetCommentProps = { id: string };
export type GetCommentsProps = {
  gameName: string;
  offset: number;
  perPage: number;
};
export type CreateCommentProps = {
  body: string;
  parentId: string;
};
export type UpdateCommentProps = {
  id: string;
  body: string;
};

export type GetCommentsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comments: CommentDetailsType[];
}>;
export type GetCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;
export type CreateCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;
export type UpdateCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comment: CommentDetailsType | null;
}>;
export type DeleteCommentResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
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
    parentId,
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
          parentId,
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

  const getComment = async ({ id }: GetCommentProps): GetCommentResultType => {
    try {
      //   const response = await axiosPublic.post(
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

  const getComments = async ({
    gameName,
    offset,
    perPage,
  }: GetCommentsProps): GetCommentsResultType => {
    try {
      //   const response = await axiosPublic.post(
      //     COMMENTS_URL,
      //     JSON.stringify({
      //       gameName
      //       offset,
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
      return {
        comments,
        message: "Success",
        status: 200,
      };
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        comments: [],
      };
    }
  };

  return {
    createComment,
    deleteComment,
    getComment,
    getComments,
    updateComment,
  };
}
