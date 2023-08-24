import { useContext } from "react";

import { AuthContext } from "../account/AccountContext";
import { mapResponseErrorToMessage, wait } from "../../utils";
import { ErrorMessageKind } from "../../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "./useUsersAPIFacade";

export const replies: ReplyDetailsType[] = [
  {
    id: "4",
    body: "Second comment first child",
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
];

export type ReplyDetailsType = {
  id: string;
  parentId: string;
  body: string;
  author: UserDetailsType;
  createdAt: string;
  lastUpdatedAt: string;
};

export type DeleteReplyProps = { id: string };
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

export type GetRepliesProps = {
  parentId: string;
  page: number;
  perPage: number;
  gameName: string;
};
export type GetRepliesResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  replies: ReplyDetailsType[] | null;
  totalNumberOfReplies: number | null;
}>;

export type CreateReplyProps = {
  body: string;
  parentId: string;
};
export type CreateReplyResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  reply: ReplyDetailsType | null;
}>;

export type UpdateReplyProps = {
  id: string;
  body: string;
};
export type UpdateReplyResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  reply: ReplyDetailsType | null;
}>;

export type RepliesActionsType = {
  getReplies: (getRepliesProps: GetRepliesProps) => GetRepliesResultType;
  getReply: (getReplyProps: GetReplyProps) => GetReplyResultType;
  createReply: (createReplyProps: CreateReplyProps) => CreateReplyResultType;
  updateReply: (updateReplyProps: UpdateReplyProps) => UpdateReplyResultType;
  deleteReply: (deleteReplyProps: DeleteReplyProps) => DeleteReplyResultType;
};

export default function useRepliesAPIFacade(): RepliesActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AuthContext);
  const REPLIES_URL = process.env.REACT_APP_REPLIES_URL;

  const deleteReply = async ({
    id,
  }: DeleteReplyProps): DeleteReplyResultType => {
    try {
      if (authState.user !== null) {
        //   const response = await axiosPrivate.delete(
        //     REPLIES_URL,
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
        const replyIndex: number = replies.findIndex(
          (reply) => reply.id === id
        );
        if (replyIndex !== -1) {
          replies.splice(replyIndex);
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

  const updateReply = async ({
    id,
    body,
  }: UpdateReplyProps): UpdateReplyResultType => {
    try {
      if (authState.user !== null) {
        //   const response = await axiosPrivate.patch(
        //     REPLIES_URL,
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
        const reply: ReplyDetailsType | undefined = replies.find(
          (reply) => reply.id === id
        );
        if (reply) {
          reply.body = body;
          reply.lastUpdatedAt = now.toISOString();
          return {
            reply,
            message: "Success",
            status: 200,
          };
        } else {
          return {
            message: "Not Found",
            status: 404,
            reply: null,
          };
        }
      } else {
        return {
          message: "Unauthorized",
          status: 401,
          reply: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        reply: null,
      };
    }
  };

  const createReply = async ({
    body,
    parentId,
  }: CreateReplyProps): CreateReplyResultType => {
    try {
      if (authState.user !== null) {
        //   const response = await axiosPrivate.post(
        //     REPLIES_URL,
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
        const now = new Date();
        const reply: ReplyDetailsType = {
          author: authState.user,
          body,
          parentId,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: now.toISOString(),
          lastUpdatedAt: now.toISOString(),
        };
        replies.push(reply);
        await wait(0, 500);
        return {
          reply,
          message: "Success",
          status: 200,
        };
      } else {
        return {
          message: "Unauthorized",
          status: 401,
          reply: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        reply: null,
      };
    }
  };

  const getReply = async ({ id }: GetReplyProps): GetReplyResultType => {
    try {
      //   const response = await axiosPublic.get(
      //     REPLIES_URL,
      //     JSON.stringify({id}),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      const reply = replies.find((reply) => reply.id === id);
      await wait(0, 500);
      if (reply) {
        return {
          reply,
          message: "Success",
          status: 200,
        };
      } else {
        return {
          message: "Not Found",
          status: 404,
          reply: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        reply: null,
      };
    }
  };

  const getReplies = async ({
    parentId,
    page,
    perPage,
  }: GetRepliesProps): GetRepliesResultType => {
    try {
      //   const response = await axiosPublic.get(
      //     REPLIES_URL,
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

      let repliesSet: ReplyDetailsType[] = replies.filter(
        (reply) => reply.parentId === parentId
      );

      if (offset > replies.length) {
        if (offset + perPage < replies.length) {
          repliesSet = replies.slice(offset, offset + perPage);
        } else {
          repliesSet = replies.slice(offset);
        }
      }

      return {
        replies: repliesSet,
        message: "Success",
        status: 200,
        totalNumberOfReplies: repliesSet.length,
      };
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        replies: null,
        totalNumberOfReplies: null,
      };
    }
  };

  return { createReply, deleteReply, getReplies, getReply, updateReply };
}
