/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import { AccountContext, type AuthStateType } from "../account/AccountContext";
import { NotificationContext } from "../snackbars/NotificationsContext";
import {
  type CommentDetailsType,
  type ReplyDetailsType,
  type UserDetailsType,
} from "../../models/internalAppRepresentation/resources";
import {
  type ErrorMessageKind,
  mapResponseErrorToMessage,
} from "../../utils/mapResponseErrorToMessage";
import { getEnvironmentVariable } from "../../utils";

const USERS_URL: string = getEnvironmentVariable("VITE_USERS_URL");
const BAN_ENDPOINT: string = getEnvironmentVariable("VITE_BAN_ENDPOINT");
const UNBAN_ENDPOINT: string = getEnvironmentVariable("VITE_UNBAN_ENDPOINT");
const GRANT_ADMIN_PERMISSIONS_ENDPOINT: string = getEnvironmentVariable(
  "VITE_GRANT_ADMIN_PERMISSIONS_ENDPOINT"
);
const USERS_FEED_ENDPOINT: string = getEnvironmentVariable(
  "VITE_USERS_FEED_ENDPOINT"
);
const USERS_COMMENTS_ENDPOINT: string = getEnvironmentVariable(
  "VITE_USER_COMMENTS_ENDPOINT"
);
const USERS_REPLIES_ENDPOINT: string = getEnvironmentVariable(
  "VITE_USER_REPLIES_ENDPOINT"
);
const USERS_ACTIVITY_SUMMARY_ENDPOINT: string = getEnvironmentVariable(
  "VITE_USER_ACCTIVITY_SUMMARY_ENDPOINT"
);

export type GetUserProps = { id: string };
export type GetUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type GetUsersProps = {
  pageNumber: number;
  pageSize?: number;
  sortBy?: string;
  orderDirection?: string;
};
export type GetUsersResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  users: UserDetailsType[] | null;
}>;

export type GrantAdminPermissionsProps = { id: string };
export type GrantAdminPermissionsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type BanUserProps = { id: string };
export type BanUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type GetUserActivitySummaryProps = { id: string };
export type GetUserActivitySummaryResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type UnbanUserProps = { id: string };
export type UnbanUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type GetUserCommentsProps = {
  userId: string;
  pageNumber: number;
  pageSize?: number;
  sortBy?: string;
  orderDirection?: string;
};
export type GetUserCommentsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  comments: CommentDetailsType[] | null;
}>;

export type GetUserRepliesProps = {
  userId: string;
  pageNumber: number;
  pageSize?: number;
  sortBy?: string;
  orderDirection?: string;
};
export type GetUserRepliesResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  replies: ReplyDetailsType[] | null;
}>;

export type UsersActionsType = {
  getUser: (getUserProps: GetUserProps) => GetUserResultType;
  getUsers: (getUsersProps: GetUsersProps) => GetUsersResultType;
  grantAdminPermissions: (
    grantAdminPermissionsProps: GrantAdminPermissionsProps // {{api-url}}/users/:id/grant-admin-permissions
  ) => GrantAdminPermissionsResultType;
  getUserComments: (
    // {{api-url}}/users/:id/comments
    getUserCommentsProps: GetUserCommentsProps
  ) => GetUserCommentsResultType;
  getUserReplies: (
    // {{api-url}}/users/:id/replies
    getUserRepliesProps: GetUserRepliesProps
  ) => GetUserRepliesResultType;
  getUserActivitySummary: (
    // {{api-url}}/users/:id/activity-summary
    getUserActivitySummary: GetUserActivitySummaryProps
  ) => GetUserActivitySummaryResultType;
  banUser: (banUserProps: BanUserProps) => BanUserResultType; // {{api-url}}/users/:id/ban-account
  unbanUser: (unbanUserProps: UnbanUserProps) => UnbanUserResultType; // {{api-url}}/users/:id/unban-account
  authState: AuthStateType;
};

export default function useUsersAPIFacade(): UsersActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);

  const getUser = async ({ id }: GetUserProps): GetUserResultType => {
    try {
      const response = await axiosPublic.get(USERS_URL + "/" + id); // GET {{api-url}}/users/:id
      openSnackbar({
        title: "Success",
        body: `Successfully fetched user with id ${id}`,
        severity: "success",
      });
      const newUserDetails: UserDetailsType = {
        id: response.data?.id,
        name: response.data?.name,
        role: response.data?.role,
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt,
      };
      return {
        user: newUserDetails,
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      openSnackbar({
        title: mapResponseErrorToMessage(err),
        body: `Failed to fetch user with id ${id}`,
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        user: null,
      };
    }
  };

  const getUsers = async ({
    pageNumber,
    pageSize,
    sortBy,
    orderDirection,
  }: GetUsersProps): GetUsersResultType => {
    try {
      const response = await axiosPublic.get(
        USERS_URL + "/" + USERS_FEED_ENDPOINT,
        {
          // GET  {{api-url}}/users/feed?pageNumber=0&pageSize=10&sortBy=id&orderDirection=Asc
          params: {
            pageNumber,
            pageSize,
            sortBy,
            orderDirection,
          },
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const users: UserDetailsType[] = response.data?.users?.map(function (
        user: UserDetailsType & { _links: any },
        index: number
      ) {
        return {
          id: user.id,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });
      openSnackbar({
        title: "Successfully fetched page of users",
        body: `Details about ${response.data?.users?.length} users out of ${response.data?.totalElements} was fetched`,
        severity: "success",
      });

      return {
        users: users,
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
        body: `Failed to fetch users`,
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        users: null,
        isLast: false,
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      };
    }
  };

  const grantAdminPermissions = async ({
    id,
  }: GrantAdminPermissionsProps): GrantAdminPermissionsResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.patch(
          // {{api-url}}/users/:id/grant-admin-permissions
          USERS_URL + "/" + id + "/" + GRANT_ADMIN_PERMISSIONS_ENDPOINT,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newUserDetails: UserDetailsType = {
          name: response.data?.name,
          role: response.data?.role,
          id: response.data?.id,
          createdAt: response.data?.createdAt,
          updatedAt: response.data?.updatedAt,
        };
        openSnackbar({
          title: `Successfully granted permissions`,
          body: `Admin permissions granted to user with id ${id}`,
          severity: "success",
        });
        return {
          user: newUserDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        // eslint-disable-next-line eqeqeq
        if (err.response?.status != 403 || err.response?.status != 401) {
          // for axiosPrivate error notifications do not include errors 403 and 401
          openSnackbar({
            title: mapResponseErrorToMessage(err),
            body: `Failed to grant admin permissions`,
            severity: "error",
          });
        }
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          user: null,
        };
      }
    } else {
      openSnackbar({
        title: `Failed to grant admin permissions`,
        body: "You do not have sufficient permissions to grant admin permissions to someone",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        user: null,
      };
    }
  };

  const banUser = async ({ id }: BanUserProps): BanUserResultType => {
    if (authState.user !== null && authState.user.role === "ADMIN") {
      try {
        const response = await axiosPrivate.patch(
          // {{api-url}}/users/:id/ban
          USERS_URL + "/" + id + "/" + BAN_ENDPOINT,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newUserDetails: UserDetailsType = {
          id: response.data?.id,
          name: response.data?.name,
          role: response.data?.role,
          createdAt: response.data?.createdAt,
          updatedAt: response.data?.updatedAt,
        };

        openSnackbar({
          title: `Successfully banned user`,
          body: `User with id ${id} was banned`,
          severity: "success",
        });
        return {
          user: newUserDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        // eslint-disable-next-line eqeqeq
        if (err.response?.status != 403 || err.response?.status != 401) {
          // for axiosPrivate error notifications do not include errors 403 and 401
          openSnackbar({
            title: mapResponseErrorToMessage(err),
            body: `Failed to ban user with id: ${id}`,
            severity: "error",
          });
        }
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          user: null,
        };
      }
    } else {
      openSnackbar({
        title: `Failed to ban user with id: ${id}`,
        body: "You do not have sufficient permissions",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        user: null,
      };
    }
  };

  const unbanUser = async ({
    id,
  }: GrantAdminPermissionsProps): GrantAdminPermissionsResultType => {
    if (authState.user !== null && authState.user.role === "ADMIN") {
      try {
        const response = await axiosPrivate.patch(
          // {{api-url}}/users/:id/unban
          USERS_URL + "/" + id + "/" + UNBAN_ENDPOINT,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const newUserDetails: UserDetailsType = {
          id: response.data?.id,
          name: response.data?.name,
          role: response.data?.role,
          createdAt: response.data?.createdAt,
          updatedAt: response.data?.updatedAt,
        };

        openSnackbar({
          title: `Successfully unbanned user`,
          body: `User with id ${id} unbanned`,
          severity: "success",
        });
        return {
          user: newUserDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        // eslint-disable-next-line eqeqeq
        if (err.response?.status != 403 || err.response?.status != 401) {
          // for axiosPrivate error notifications do not include errors 403 and 401
          openSnackbar({
            title: mapResponseErrorToMessage(err),
            body: `Failed to unban the user with id: ${id}`,
            severity: "error",
          });
        }
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          user: null,
        };
      }
    } else {
      openSnackbar({
        title: "You do not have sufficient permissions",
        body: `Failed to unban the user with id: ${id}`,
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        user: null,
      };
    }
  };

  const getUserComments = async ({
    userId,
    orderDirection,
    pageNumber,
    pageSize,
    sortBy,
  }: GetUserCommentsProps): GetUserCommentsResultType => {
    try {
      // const offset = page * perPage - perPage;
      const response = await axiosPublic.get(
        // {{api-url}}/users/:id/comments?pageNumber=0&pageSize=3&sortBy=id&orderDirection=Asc
        USERS_URL + "/" + userId + "/" + USERS_COMMENTS_ENDPOINT,
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
        title: `Successfully fetched comments created by user with id ${userId}`,
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
        body: `Failed to fetch comments created by user with id ${userId}`,
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

  const getUserReplies = async ({
    userId,
    orderDirection,
    pageNumber,
    pageSize,
    sortBy,
  }: GetUserRepliesProps): GetUserRepliesResultType => {
    try {
      // const offset = page * perPage - perPage;
      const response = await axiosPublic.get(
        // {{api-url}}/users/:id/replies?pageNumber=0&pageSize=3&sortBy=id&orderDirection=Asc
        USERS_URL + "/" + userId + "/" + USERS_REPLIES_ENDPOINT,
        {
          params: {
            orderDirection,
            pageNumber,
            pageSize,
            sortBy,
          },
        }
      );
      const replies: ReplyDetailsType[] = response.data?.replies?.map(function (
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
        title: `Successfully fetched replies created by user with id ${userId}`,
        body: `Page ${pageNumber + 1} with ${
          response.data?.comments?.length
        } out of ${response.data?.totalElements} replies fetched successfully.`,
        severity: "success",
      });
      return {
        replies: replies,
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
        title: `Failed to fetch replies created by user with id ${userId}`,
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

  const getUserActivitySummary = async (
    getUserActivitySummary: GetUserActivitySummaryProps
  ): GetUserActivitySummaryResultType => {
    try {
      const response = await axiosPublic.get(
        // GET {{api-url}}/users/:id/activity-summary
        USERS_URL +
          "/" +
          getUserActivitySummary.id +
          "/" +
          USERS_ACTIVITY_SUMMARY_ENDPOINT
      );
      openSnackbar({
        title: "Success",
        body: `Successfully fetched activity summary for user with id ${getUserActivitySummary.id}`,
        severity: "error",
      });
      return {
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      openSnackbar({
        title: mapResponseErrorToMessage(err),
        body: `Could not fetch activity summary for user with id ${getUserActivitySummary.id}`,
        severity: "error",
      });
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
      };
    }
  };

  return {
    getUser,
    getUsers,
    grantAdminPermissions,
    getUserComments,
    getUserReplies,
    banUser,
    unbanUser,
    getUserActivitySummary,
    authState,
  };
}
