import { useContext } from "react";
import {
  ErrorMessageKind,
  mapResponseErrorToMessage,
} from "../../utils/mapResponseErrorToMessage";
import { wait } from "../../utils";
import { AccountContext } from "../account/AccountContext";
import { GameNameType } from "../games/gamesDetails";
import { ReplyDetailsType } from "./useRepliesAPIFacade";
import { CommentDetailsType } from "./useCommentsAPIFacade";
import { comments } from "./useCommentsAPIFacade";
import { replies } from "./useRepliesAPIFacade";
import { NotificationContext } from "../snackbars/NotificationsContext";

export type UserDetailsType = {
  id: string;
  name: string;
  roles: ("User" | "Admin")[];
  createdAt: string;
  lastUpdatedAt: string;
};

const users: UserDetailsType[] = [
  {
    id: "1",
    name: "Dinotrex",
    roles: ["User"],
    createdAt: "2023-08-06T11:23:36.172Z",
    lastUpdatedAt: "2023-08-06T11:23:36.172Z",
  },
  {
    id: "2",
    name: "Margary",
    roles: ["User"],
    createdAt: "2023-08-06T11:23:36.172Z",
    lastUpdatedAt: "2023-08-06T11:23:36.172Z",
  },
  {
    id: "3",
    name: "Everday",
    roles: ["User", "Admin"],
    createdAt: "2023-08-06T11:23:36.172Z",
    lastUpdatedAt: "2023-08-06T11:23:36.172Z",
  },
];

export type GetUserProps = { id: string };
export type GetUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type GetUsersProps = {
  page: number;
  perPage: number;
};
export type GetUsersResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  users: UserDetailsType[] | null;
  totalNumberOfUsers: number | null;
}>;

export type GrantAdminPermissionsProps = { id: string };
export type GrantAdminPermissionsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type GetUserCommentsProps = {
  page: number;
  perPage: number;
  gameName: GameNameType;
  userId: string;
};
export type GetUserCommentsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  comments: CommentDetailsType[] | null;
  totalNumberOfComments: number | null;
}>;

export type GetUserRepliesProps = {
  page: number;
  perPage: number;
  userId: string;
};
export type GetUserRepliesResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  replies: ReplyDetailsType[] | null;
  totalNumberOfReplies: number | null;
}>;

export type UsersActionsType = {
  getUsers: (getUsersProps: GetUsersProps) => GetUsersResultType;
  getUser: (getUserProps: GetUserProps) => GetUserResultType;

  grantAdminPermissions: (
    grantAdminPermissionsProps: GrantAdminPermissionsProps
  ) => GrantAdminPermissionsResultType;
  getUserComments: (
    getUserCommentsProps: GetUserCommentsProps
  ) => GetUserCommentsResultType;
  getUserReplies: (
    getUserRepliesProps: GetUserRepliesProps
  ) => GetUserRepliesResultType;
};

export default function useUsersAPIFacade(): UsersActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);
  const USERS_URL = process.env.REACT_APP_USERS_URL;

  const getUser = async ({ id }: GetUserProps): GetUserResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPublic.get(
      //     USERS_URL + "/" + id,
      //     JSON.stringify({id}),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      const user = users.find((element) => element.id === id);
      if (user) {
        openSnackbar({
          title: `successfully performed actions on user with id: ${id}`,
          body: "user successfully fetched",
          severity: "success",
        });
        return {
          user,
          message: "Success",
          status: 200,
        };
      } else {
        openSnackbar({
          title: `failed to perform actions on the user with id: ${id}`,
          body: "user not found",
          severity: "error",
        });
        return {
          message: "Not found",
          status: 404,
          user: null,
        };
      }
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
  };

  const getUsers = async ({
    page,
    perPage,
  }: GetUsersProps): GetUsersResultType => {
    try {
      await wait(0, 500);
      const offset = page * perPage - perPage;
      //   const response = await axiosPublic.get(
      //     USERS_URL?page=2&per_page=5,
      //     JSON.stringify({
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

      let usersSet: UserDetailsType[] = [];
      if (offset > users.length) {
        if (offset + perPage < users.length) {
          usersSet = users.slice(offset, offset + perPage);
        } else {
          usersSet = users.slice(offset);
        }
      }
      openSnackbar({
        title: "successfully performed actions on users",
        body: "users successfully fetched",
        severity: "success",
      });
      return {
        users: usersSet,
        message: "Success",
        status: 200,
        totalNumberOfUsers: users.length,
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
        totalNumberOfUsers: null,
      };
    }
  };

  const grantAdminPermissions = async ({
    id,
  }: GrantAdminPermissionsProps): GrantAdminPermissionsResultType => {
    try {
      if (authState.user !== null) {
        await wait(0, 500);
        //   const response = await axiosPrivate.patch(
        //     USERS_URL + "/" + id, + "/grant-admin-permissions",
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
        const now = new Date();
        const user: UserDetailsType | undefined = users.find(
          (element) => element.id === id
        );
        if (user) {
          user.roles = ["User", "Admin"];
          user.lastUpdatedAt = now.toISOString();
          openSnackbar({
            title: `successfully performed actions on user with id: ${id}`,
            body: "permissions granted",
            severity: "success",
          });
          return {
            user,
            message: "Success",
            status: 200,
          };
        } else {
          openSnackbar({
            title: `failed to perform actions on the user with id: ${id}`,
            body: "user not found",
            severity: "error",
          });
          return {
            message: "Not found",
            status: 404,
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
  };

  const getUserComments = async ({
    userId,
    page,
    perPage,
    gameName,
  }: GetUserCommentsProps): GetUserCommentsResultType => {
    try {
      await wait(0, 500);
      const offset = page * perPage - perPage;
      //   const response = await axiosPublic.get(
      //     USERS_URL?page=2&per_page=5,
      //     JSON.stringify({
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

      let commentsSet: CommentDetailsType[] = [];
      if (offset > comments.length) {
        if (offset + perPage < comments.length) {
          commentsSet = comments
            .filter((comm) => (comm.author.id = userId))
            .slice(offset, offset + perPage);
        } else {
          commentsSet = comments
            .filter((comm) => comm.author.id === userId)
            .slice(offset);
        }
      }
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
        title: "failed to fetch comments",
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

  const getUserReplies = async ({
    page,
    perPage,
    userId,
  }: GetUserRepliesProps): GetUserRepliesResultType => {
    try {
      await wait(0, 500);
      const offset = page * perPage - perPage;
      //   const response = await axiosPublic.get(
      //     USERS_URL?page=2&per_page=5,
      //     JSON.stringify({
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

      let repliesSet: ReplyDetailsType[] = [];
      if (offset > replies.length) {
        if (offset + perPage < replies.length) {
          repliesSet = replies
            .filter((reply) => reply.author.id === userId)
            .slice(offset, offset + perPage);
        } else {
          repliesSet = replies
            .filter((reply) => reply.author.id === userId)
            .slice(offset);
        }
      }
      openSnackbar({
        title: "successfully performed actions on replies",
        body: "replies fetched successfully",
        severity: "success",
      });
      return {
        replies: repliesSet,
        message: "Success",
        status: 200,
        totalNumberOfReplies: replies.length,
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
        totalNumberOfReplies: null,
      };
    }
  };

  return {
    getUser,
    getUsers,
    grantAdminPermissions,
    getUserComments,
    getUserReplies,
  };
}
