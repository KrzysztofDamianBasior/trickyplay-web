import { useContext } from "react";
import {
  ErrorMessageKind,
  mapResponseErrorToMessage,
} from "../utils/mapResponseErrorToMessage";
import { wait } from "../utils";
import { AuthContext } from "../context/AuthContext";

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

export type UsersActionsType = {
  getUsers: (getUsersProps: GetUsersProps) => GetUsersResultType;
  getUser: (getUserProps: GetUserProps) => GetUserResultType;

  grantAdminPermissions: (
    grantAdminPermissionsProps: GrantAdminPermissionsProps
  ) => GrantAdminPermissionsResultType;
};

export default function useUsersAPIFacade(): UsersActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AuthContext);
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
        return {
          user,
          message: "Success",
          status: 200,
        };
      } else {
        return {
          message: "Not Found",
          status: 404,
          user: null,
        };
      }
    } catch (err: any) {
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
    await wait(0, 500);
    const offset = page * perPage - perPage;
    try {
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
      return {
        users: usersSet,
        message: "Success",
        status: 200,
        totalNumberOfUsers: users.length,
      };
    } catch (err: any) {
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
    await wait(0, 500);
    try {
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
      if (authState.user !== null) {
        const now = new Date();
        const user: UserDetailsType | undefined = users.find(
          (element) => element.id === id
        );
        if (user) {
          user.roles = ["User", "Admin"];
          user.lastUpdatedAt = now.toISOString();
          return {
            user,
            message: "Success",
            status: 200,
          };
        } else {
          return {
            message: "Not Found",
            status: 404,
            user: null,
          };
        }
      } else {
        return {
          message: "Unauthorized",
          status: 401,
          user: null,
        };
      }
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        user: null,
      };
    }
  };

  return {
    getUser,
    getUsers,
    grantAdminPermissions,
  };
}
