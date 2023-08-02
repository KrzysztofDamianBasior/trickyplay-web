export type UserDetailsType = {
  id: string;
  name: string;
  roles: string[];
} | null;

export type AuthStatusType = "LOGGED_IN" | "LOGGED_OUT" | "LOADING";

export type AuthStateType = {
  iss: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatusType;
  user: UserDetailsType;
};

export type SignInProps = {
  username: string;
  password: string;
};

export type SignUpProps = {
  username: string;
  password: string;
};

export type AuthActionKind = "SIGN_UP" | "SIGN_IN" | "SIGN_OUT";

export type signUpProps = { username: string; password: string };
export type signInProps = { username: string; password: string };

export type AuthContextType = {
  signIn: (userData: signInProps) => void;
  signUp: (userData: signUpProps) => void;
  signOut: () => void;
  authState: AuthStateType;
};
