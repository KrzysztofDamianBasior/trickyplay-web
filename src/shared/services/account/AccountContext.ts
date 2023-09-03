import { createContext } from "react";
import { AxiosInstance } from "axios";

import { ErrorMessageKind } from "../../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "../api/useUsersAPIFacade";
import { axiosPrivate, axiosPublic } from "./useAccount";

export type AuthStatusType = "LOGGED_IN" | "LOGGED_OUT" | "LOADING";

export type AuthStateType = {
  iss: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatusType;
  user: UserDetailsType | null;
};

export type SignInProps = { username: string; password: string };
export type SignInResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type SignUpProps = { username: string; password: string };
export type SignUpResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type SignOutResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type DeleteAccountProps = { password: string };
export type DeleteAccountResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type UpdatePasswordProps = {
  oldPassword: string;
  newPassword: string;
};
export type UpdatePasswordResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type UpdateUsernameProps = {
  password: string;
  newName: string;
};
export type UpdateUsernameResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type AccountContextType = {
  signIn: (userData: SignInProps) => SignInResultType;
  signUp: (userData: SignUpProps) => SignUpResultType;
  signOut: () => SignOutResultType;
  authState: AuthStateType;
  axiosPrivate: AxiosInstance;
  axiosPublic: AxiosInstance;
  deleteMyAccount: (userData: DeleteAccountProps) => DeleteAccountResultType;
  updateMyPassword: (userData: UpdatePasswordProps) => UpdatePasswordResultType;
  updateMyUsername: (userData: UpdateUsernameProps) => UpdateUsernameResultType;
};

export const authInitialState: AuthStateType = {
  status: "LOGGED_OUT",
  accessToken: null,
  refreshToken: null,
  iss: null,
  user: null,
};

export const AccountContext = createContext<AccountContextType>({
  authState: authInitialState,
  signIn: async (userData: SignInProps) => {
    return { message: "Internal server error", status: 500, user: null };
  },

  signUp: async (userData: SignUpProps) => {
    return { message: "Internal server error", status: 500, user: null };
  },

  signOut: async () => {
    return { message: "Internal server error", status: 500 };
  },

  updateMyUsername: async (updateMyNameProps: UpdateUsernameProps) => {
    return { message: "Internal server error", status: 500, user: null };
  },

  updateMyPassword: async (updateMyPasswordProps: UpdatePasswordProps) => {
    return { message: "Internal server error", status: 500, user: null };
  },

  deleteMyAccount: async (deleteMyAccountProps: DeleteAccountProps) => {
    return { message: "Internal server error", status: 500, user: null };
  },

  axiosPrivate: axiosPrivate,
  axiosPublic: axiosPublic,
});
