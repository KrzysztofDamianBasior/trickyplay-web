/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import { type AxiosInstance } from "axios";

import { axiosPrivate, axiosPublic } from "./useAccount";
import { type ErrorMessageKind } from "../../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "../../models/internalAppRepresentation/resources";

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

export type DeleteAccountResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type AccountActivitySummaryResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
}>;

export type UpdateUsernameProps = {
  newUsername: string;
};
export type UpdatePasswordProps = {
  newPassword: string;
};
export type UpdateAccountResultType = Promise<{
  status: number;
  message: ErrorMessageKind | "Success";
  user: UserDetailsType | null;
}>;

export type AccountContextType = {
  signIn: (userData: SignInProps) => SignInResultType;
  signUp: (userData: SignUpProps) => SignUpResultType;
  singleSessionSignOut: () => SignOutResultType;
  allSessionsSignOut: () => SignOutResultType;
  authState: AuthStateType;
  axiosPrivate: AxiosInstance;
  axiosPublic: AxiosInstance;
  deleteAccount: () => DeleteAccountResultType;
  updateUsername: (userData: UpdateUsernameProps) => UpdateAccountResultType;
  updatePassword: (userData: UpdatePasswordProps) => UpdateAccountResultType;
  accountActivitySummary: () => AccountActivitySummaryResultType;
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
    return { message: "Unauthenticated", status: 401, user: null };
  },
  signUp: async (userData: SignUpProps) => {
    return { message: "Unauthenticated", status: 401, user: null };
  },
  singleSessionSignOut: async () => {
    return { message: "Unauthenticated", status: 401, user: null };
  },
  allSessionsSignOut: async () => {
    return { message: "Unauthenticated", status: 401, user: null };
  },
  updateUsername: async (updateAccountProps: UpdateUsernameProps) => {
    return { message: "Unauthenticated", status: 401, user: null };
  },
  updatePassword: async (updateAccountProps: UpdatePasswordProps) => {
    return { message: "Unauthenticated", status: 401, user: null };
  },
  deleteAccount: async () => {
    return { message: "Unauthenticated", status: 401, user: null };
  },
  accountActivitySummary: async () => {
    return { message: "Unauthenticated", status: 401 };
  },
  axiosPrivate: axiosPrivate,
  axiosPublic: axiosPublic,
});
