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

const USERS_URL: string = getEnvironmentVariable("REACT_APP_USERS_URL");
const BAN_ENDPOINT: string = getEnvironmentVariable("REACT_APP_BAN_ENDPOINT");
const UNBAN_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_UNBAN_ENDPOINT"
);
const GRANT_ADMIN_PERMISSIONS_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_GRANT_ADMIN_PERMISSIONS_ENDPOINT"
);
const USERS_FEED_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_USERS_FEED_ENDPOINT"
);
const USERS_COMMENTS_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_USER_COMMENTS_ENDPOINT"
);
const USERS_REPLIES_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_USER_REPLIES_ENDPOINT"
);
const USERS_ACTIVITY_SUMMARY_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_USER_ACCTIVITY_SUMMARY_ENDPOINT"
);

export type GetUserProps = { id: string };
export type GetUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type GetUsersProps = {
  pageNumber?: number;
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
  pageNumber?: number;
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
  pageNumber?: number;
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
        title: `successfully performed actions`,
        body: `user with id ${id} successfully fetched`,
        severity: "success",
      });
      const newUserDetails: UserDetailsType = {
        id: response.data.id,
        name: response.data.name,
        role: response.data.role,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      };
      return {
        user: newUserDetails,
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      openSnackbar({
        title: `failed to fetch user with id ${id}`,
        body: mapResponseErrorToMessage(err),
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
      const response = await axiosPublic.get(USERS_URL + USERS_FEED_ENDPOINT, {
        // GET  {{api-url}}/users/feed?pageNumber=0&pageSize=10&sortBy=id&orderDirection=Asc
        params: {
          pageNumber,
          pageSize,
          sortBy,
          orderDirection,
        },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const users: UserDetailsType[] = response.data.users.map(function (
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
        title: "successfully fetched page of users",
        body: `details about ${response.data.users.length} users out of ${response.data.totaleElements} was fetched`,
        severity: "success",
      });

      return {
        users: users,
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
        title: `failed to perform actions on users`,
        body: mapResponseErrorToMessage(err),
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
          name: response.data.name,
          role: response.data.role,
          id: response.data.id,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        openSnackbar({
          title: `successfully granted permissions`,
          body: `admin permissions granted to user with id ${id}`,
          severity: "success",
        });
        return {
          user: newUserDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `failed to perform actions`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          user: null,
        };
      }
    } else {
      openSnackbar({
        title: `failed to perform actions`,
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
          id: response.data.id,
          name: response.data.name,
          role: response.data.role,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        openSnackbar({
          title: `successfully banned user`,
          body: `user with id ${id} banned`,
          severity: "success",
        });
        return {
          user: newUserDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `failed to ban user with id: ${id}`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          user: null,
        };
      }
    } else {
      openSnackbar({
        title: `failed to ban user with id: ${id}`,
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
          id: response.data.id,
          name: response.data.name,
          role: response.data.role,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        openSnackbar({
          title: `successfully unbanned user`,
          body: `user with id ${id} unbanned`,
          severity: "success",
        });
        return {
          user: newUserDetails,
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `failed to perform actions on the user with id: ${id}`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
          user: null,
        };
      }
    } else {
      openSnackbar({
        title: `failed to perform actions on the user with id: ${id}`,
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

      const comments: CommentDetailsType[] = response.data.comments.map(
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
        title: `successfully fetched comments created by user with id ${userId}`,
        body: `${response.data.comments.length} out of ${response.data.totalElements} comments fetched`,
        severity: "success",
      });
      return {
        comments: comments,
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
        title: "failed to fetch comments",
        body: mapResponseErrorToMessage(err),
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
        title: `successfully fetched replies created by user with id ${userId}`,
        body: `${response.data.replies.length} out of ${response.data.totaleElements} replies fetched`,
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
        title: "failed to fetch replies",
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
      return {
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      openSnackbar({
        title: `could not be performed fetch activity summary for user with id ${getUserActivitySummary.id}`,
        body: mapResponseErrorToMessage(err),
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
