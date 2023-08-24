import { useEffect, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import axios from "axios";

import {
  type AuthStateType,
  type AuthContextType,
  type DeleteAccountProps,
  type DeleteAccountResultType,
  type SignInProps,
  type SignInResultType,
  type SignUpProps,
  type SignUpResultType,
  type SignOutResultType,
  type UpdatePasswordProps,
  type UpdatePasswordResultType,
  type UpdateUsernameProps,
  type UpdateUsernameResultType,
  authInitialState,
} from "./AccountContext";
import { NotificationContext } from "../snackbars/NotificationsContext";
import {
  getEnvironmentVariable,
  mapResponseErrorToMessage,
  wait,
} from "../../utils";
import { UserDetailsType } from "../api/useUsersAPIFacade";

const BASE_URL: string = getEnvironmentVariable("REACT_APP_BASE_URL");
const AUTH_URL: string = getEnvironmentVariable("REACT_APP_AUTH_URL");
const MYACCOUNT_URL: string = getEnvironmentVariable("REACT_APP_AUTH_URL");

const REFRESH_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_REFRESH_ENDPOINT"
);
const SIGNIN_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_SIGNIN_ENDPOINT"
);
const SIGNUP_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_SIGNUP_ENDPOINT"
);
const SIGNOUT_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_SIGNOUT_ENDPOINT"
);

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default function useAuth(): AuthContextType {
  const [authState, setAuthState] = useLocalStorage<AuthStateType>(
    "AUTH_STATE",
    authInitialState
  );
  const { openSnackbar } = useContext(NotificationContext);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${authState?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, // just return the response
      async (error) => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);

        const prevRequest = error?.config;
        let refreshRetry = false;
        // 403- forbiden due to token expiration
        // 401- unauntehnticated
        // we only want to retry once

        if (
          (error?.response?.status === 403 || error.response.status === 401) &&
          !prevRequest?.sent &&
          !refreshRetry
        ) {
          // if (error.response.status === 401 && !refreshRetry) { // 401- unauntehnticated
          refreshRetry = true;
          prevRequest.sent = true;

          const response = await axiosPublic.post(
            AUTH_URL + REFRESH_ENDPOINT,
            { refreshToken: authState.refreshToken },
            { withCredentials: true }
          );
          // const newAccessToken = await refresh();

          if (response.status === 200) {
            // response is successful
            setAuthState((prev) => {
              return { ...prev, accessToken: response.data.accessToken };
            });
            prevRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.accessToken}`;
            return axiosPrivate(prevRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [authState, setAuthState]);

  const signOut = async (): SignOutResultType => {
    // await axiosPrivate.post('logout', {}, {withCredentials: true});
    setAuthState(authInitialState);
    await wait(0, 500);
    return {
      message: "Success",
      status: 200,
    };
  };

  const signIn = async ({
    username,
    password,
  }: SignInProps): SignInResultType => {
    await wait(0, 500);
    try {
      //  const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
      //   const response = await axiosPublic.post(
      //     LOGIN_URL,
      //     JSON.stringify({
      //       username: username,
      //       password: password,
      //     }),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      //   console.log(JSON.stringify(response?.data));
      //   console.log(JSON.stringify(response));
      //   const accessToken = response?.data?.accessToken;
      //   const roles = response?.data?.roles;
      //   // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['accessToken']}`;

      // if (Math.random() > 0.5) throw new Error();
      const now = new Date();
      const newUser: UserDetailsType = {
        name: username,
        roles: ["User"],
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now.toISOString(),
        lastUpdatedAt: now.toISOString(),
      };

      setAuthState({
        user: newUser,
        accessToken: "asdf",
        refreshToken: "asdf",
        iss: "TrickyPlay",
        status: "LOGGED_IN",
      });
      return {
        user: newUser,
        message: "Success",
        status: 200,
      };
    } catch (err: any) {
      setAuthState(authInitialState);
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        user: null,
      };
    }
  };

  const signUp = async ({
    username,
    password,
  }: SignUpProps): SignUpResultType => {
    await wait(0, 500);
    try {
      // const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;
      // const response = await axios.post(
      //   REGISTER_URL,
      //   JSON.stringify({ username, password }),
      //   {
      //     headers: { "Content-Type": "application/json" },
      //     withCredentials: true,
      //   }
      // );
      // console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      //   // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['accessToken']}`;
      // setAuthState({ ....... });

      // if (Math.random() > 0.5) throw new Error();
      const now = new Date();
      const newUser: UserDetailsType = {
        name: username,
        roles: ["User"],
        id: Math.random().toString(36).substr(2, 9),
        createdAt: now.toISOString(),
        lastUpdatedAt: now.toISOString(),
      };

      setAuthState({
        user: newUser,
        accessToken: "asdf",
        refreshToken: "asdf",
        iss: "TrickyPlay",
        status: "LOGGED_IN",
      });
      return {
        user: newUser,
        message: "Success",
        status: 200,
      };
    } catch (err: any) {
      setAuthState(authInitialState);
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        user: null,
      };
    }
  };

  const updateMyUsername = async ({
    newName,
    password,
  }: UpdateUsernameProps): UpdateUsernameResultType => {
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
        const user: UserDetailsType | undefined = authState.user;
        if (user) {
          user.name = newName;
          user.lastUpdatedAt = now.toISOString();
          setAuthState((prev) => {
            return { ...prev, user };
          });
          return {
            user,
            message: "Success",
            status: 200,
          };
        } else {
          setAuthState(authInitialState);
          return {
            message: "Not Found",
            status: 404,
            user: null,
          };
        }
      } else {
        setAuthState(authInitialState);
        return {
          message: "Unauthorized",
          status: 401,
          user: null,
        };
      }
    } catch (err: any) {
      setAuthState(authInitialState);
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
  }: UpdatePasswordProps): UpdatePasswordResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPrivate.patch(
      //     UPDATE_PASSWORD_URL,
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
        const user: UserDetailsType = authState.user;
        if (user) {
          user.lastUpdatedAt = now.toISOString();
          setAuthState((prev) => {
            return { ...prev, user };
          });
          return {
            user,
            message: "Success",
            status: 200,
          };
        } else {
          setAuthState(authInitialState);
          return {
            message: "Not Found",
            status: 404,
            user: null,
          };
        }
      } else {
        setAuthState(authInitialState);
        return {
          message: "Unauthorized",
          status: 401,
          user: null,
        };
      }
    } catch (err: any) {
      setAuthState(authInitialState);
      return {
        message: mapResponseErrorToMessage(err),
        status: err.response?.status,
        user: null,
      };
    }
  };

  const deleteMyAccount = async ({
    password,
  }: DeleteAccountProps): DeleteAccountResultType => {
    await wait(0, 500);
    try {
      //   const response = await axiosPrivate.delete(
      //     DELETE_ACCOUNT_URL,
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
        setAuthState(authInitialState);
        return {
          message: "Success",
          status: 200,
        };
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

  return {
    authState,
    axiosPrivate,
    axiosPublic,
    deleteMyAccount,
    signIn,
    signOut,
    signUp,
    updateMyPassword,
    updateMyUsername,
  };
}
