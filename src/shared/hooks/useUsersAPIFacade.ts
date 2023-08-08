import { useContext } from "react";
import {
  ErrorMessageKind,
  mapResponseErrorToMessage,
} from "../utils/mapResponseErrorToMessage";
import { wait } from "../utils";
import { AuthContext } from "../auth/useAuth";

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
export type GetUsersProps = {
  offset: number;
  perPage: number;
};
export type CreateUserProps = {
  name: string;
  password: string;
};
export type UpdateMyPasswordProps = {
  oldPassword: string;
  newPassword: string;
};
export type UpdateMyNameProps = {
  password: string;
  newName: string;
};
export type DeleteMyAccountProps = { id: string; password: string };
export type GrantAdminPermissionsProps = { id: string };

export type GetUsersResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  users: UserDetailsType[];
}>;
export type GetUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;
export type CreateUserResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;
export type UpdateMyPasswordResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;
export type UpdateMyNameResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;
export type GrantAdminPermissionsResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;
export type DeleteMyAccountResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type UsersActionsType = {
  getUsers: (getUsersProps: GetUsersProps) => GetUsersResultType;
  getUser: (getUserProps: GetUserProps) => GetUserResultType;
  createUser: (createUserProps: CreateUserProps) => CreateUserResultType;
  updateMyName: (
    updateMyNameProps: UpdateMyNameProps
  ) => UpdateMyNameResultType;
  updateMyPassword: (
    updateMyPasswordProps: UpdateMyPasswordProps
  ) => UpdateMyPasswordResultType;
  deleteMyAccount: (
    updateMyAccountProps: DeleteMyAccountProps
  ) => DeleteMyAccountResultType;
  grantAdminPermissions: (
    grantAdminPermissionsProps: GrantAdminPermissionsProps
  ) => GrantAdminPermissionsResultType;
};

export default function useUsersAPIFacade(): UsersActionsType {
  const { axiosPrivate, axiosPublic, authState } = useContext(AuthContext);

  const USERS_URL = process.env.REACT_APP_USERS_URL;
  const MY_ACCOUNT_URL = process.env.REACT_APP_MY_ACCOUNT_URL;

  const createUser = async ({
    name,
    password,
  }: CreateUserProps): CreateUserResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPublic.post(
      //     USERS_URL,
      //     JSON.stringify({
      //       name, password
      //     }),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      const now = new Date();
      const newUser: UserDetailsType = {
        name,
        roles: ["User"],
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now.toISOString(),
        lastUpdatedAt: now.toISOString(),
      };
      users.push(newUser);
      return {
        user: newUser,
        message: "Success",
        status: 200,
      };
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        user: null,
      };
    }
  };

  const getUser = async ({ id }: GetUserProps): GetUserResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPublic.get(
      //     USERS_URL,
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
    offset,
    perPage,
  }: GetUsersProps): GetUsersResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPublic.get(
      //     USERS_URL,
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
      return {
        users,
        message: "Success",
        status: 200,
      };
    } catch (err: any) {
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        users: [],
      };
    }
  };

  const updateMyName = async ({
    newName,
    password,
  }: UpdateMyNameProps): UpdateMyNameResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPrivate.patch(
      //     COMMENTS_URL,
      //     JSON.stringify({
      //       newName, password
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
          (element) => element.id === authState.user?.id
        );
        if (user) {
          user.name = newName;
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

  const updateMyPassword = async ({
    newPassword,
    oldPassword,
  }: UpdateMyPasswordProps): UpdateMyPasswordResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPrivate.patch(
      //     COMMENTS_URL,
      //     JSON.stringify({
      //       newPassword, oldPassword
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
          (element) => element.id === authState.user?.id
        );
        if (user) {
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

  const deleteMyAccount = async ({
    id,
    password,
  }: DeleteMyAccountProps): DeleteMyAccountResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPrivate.delete(
      //     USERS_URL,
      //     JSON.stringify({
      //       id, password
      //     }),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      if (authState.user !== null) {
        const userIndex: number = users.findIndex(
          (element) => element.id === id
        );
        if (userIndex !== -1) {
          users.splice(userIndex);
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

  const grantAdminPermissions = async ({
    id,
  }: GrantAdminPermissionsProps): GrantAdminPermissionsResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPrivate.patch(
      //     USERS_URL,
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
    createUser,
    getUser,
    getUsers,
    updateMyPassword,
    updateMyName,
    deleteMyAccount,
    grantAdminPermissions,
  };
}
