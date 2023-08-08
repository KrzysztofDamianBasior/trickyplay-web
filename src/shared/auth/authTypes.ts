import { AxiosInstance } from "axios";
import { ErrorMessageKind } from "../utils/mapResponseErrorToMessage";
import { UserDetailsType } from "../hooks/useUsersAPIFacade";

export type AuthStatusType = "LOGGED_IN" | "LOGGED_OUT" | "LOADING";

export type AuthStateType = {
  iss: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatusType;
  user: UserDetailsType | null;
};

export type SignInProps = {
  username: string;
  password: string;
};

export type SignUpProps = {
  username: string;
  password: string;
};

export type signUpProps = { username: string; password: string };
export type signInProps = { username: string; password: string };

export type AuthContextType = {
  signIn: (userData: signInProps) => SignInResult;
  signUp: (userData: signUpProps) => SignUpResult;
  signOut: () => SignOutResult;
  authState: AuthStateType;
  axiosPrivate: AxiosInstance;
  axiosPublic: AxiosInstance;
};

export type SignInResult = Promise<ErrorMessageKind | "Success">;
export type SignUpResult = Promise<ErrorMessageKind | "Success">;
export type SignOutResult = Promise<ErrorMessageKind | "Success">;
