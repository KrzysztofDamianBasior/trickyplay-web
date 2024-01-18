import { useEffect, useContext, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import axios, { AxiosRequestConfig } from "axios";

import {
  type AuthStateType,
  type AccountContextType,
  type DeleteAccountResultType,
  type SignInProps,
  type SignInResultType,
  type SignUpProps,
  type SignUpResultType,
  type SignOutResultType,
  type UpdateAccountResultType,
  type AccountActivitySummaryResultType,
  type UpdateUsernameProps,
  type UpdatePasswordProps,
  authInitialState,
} from "./AccountContext";
import { NotificationContext } from "../snackbars/NotificationsContext";
import { getEnvironmentVariable, mapResponseErrorToMessage } from "../../utils";
import { type UserDetailsType } from "../api/useUsersAPIFacade";

// Base urls
const BASE_URL: string = getEnvironmentVariable(
  "REACT_APP_TRICKYPLAY_API_BASE_URL"
);
const AUTH_URL: string = getEnvironmentVariable("REACT_APP_AUTH_URL");
const ACCOUNT_URL: string = getEnvironmentVariable("REACT_APP_ACCOUNT_URL");

// Auth urls
const SIGN_IN_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_SIGN_IN_ENDPOINT"
);
const SIGN_UP_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_SIGN_UP_ENDPOINT"
);
const ALL_SESSIONS_SIGN_OUT_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_ALL_SESSIONS_SIGN_OUT_ENDPOINT"
);
const SINGLE_SESSION_SIGN_OUT_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_SINGLE_SESSION_SIGN_OUT_ENDPOINT"
);
const REFRESH_ACCESS_TOKEN_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_REFRESH_ACCESS_TOKEN_ENDPOINT"
);
const ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT: string = getEnvironmentVariable(
  "REACT_APP_ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT"
);

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

export default function useAccount(): AccountContextType {
  const [authState, setAuthState] = useLocalStorage<AuthStateType>(
    "AUTH_STATE",
    authInitialState
  );
  const { openSnackbar } = useContext(NotificationContext);
  // Flag to prevent multiple token refresh requests
  const isRefreshing = useRef<boolean>(false);

  // Create a list to hold the request queue
  const refreshAndRetryQueue = useRef<RetryQueueItem[]>([]);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${authState?.accessToken}`;
        }
        console.log("auth token has been set");
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, // just return the response
      async (error) => {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);

        const originalRequest: AxiosRequestConfig = error.config;

        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          // 403- forbiden due to token expiration, 401- unauntehnticated
          if (!isRefreshing.current) {
            // we only want to retry once
            openSnackbar({
              title: "authentication info",
              body: "access token has expired, a request to renew the token has been sent",
              severity: "info",
            });

            isRefreshing.current = true;
            const response = await axiosPublic.post(
              // POST {{api-url}}/auth/refresh-access-token
              // "refreshToken": "{{refresh-token}}"
              AUTH_URL + REFRESH_ACCESS_TOKEN_ENDPOINT,
              { refreshToken: authState.refreshToken },
              { withCredentials: true }
            ); // response.data.accessToken
            isRefreshing.current = false;

            if (response.status === 200) {
              // response is successful
              openSnackbar({
                title: "successfully authenticated",
                body: "access token has been renewed",
                severity: "success",
              });

              error.config.headers[
                "Authorization"
              ] = `Bearer ${response.data.accessToken}`;

              // Retry all requests in the queue with the new token
              refreshAndRetryQueue.current.forEach(
                ({ config, resolve, reject }) => {
                  axiosPrivate
                    .request(config)
                    .then((response) => resolve(response))
                    .catch((err) => reject(err));
                }
              );

              // Clear the queue
              refreshAndRetryQueue.current.length = 0;

              setAuthState((prev) => {
                return { ...prev, accessToken: response.data.accessToken };
              });

              // Retry the original request
              return axiosPrivate(originalRequest);
            } else {
              // You can clear all storage and redirect the user to the login page
              openSnackbar({
                title: "authentication actions failed",
                body: "access token failed to renew",
                severity: "error",
              });

              refreshAndRetryQueue.current.length = 0;
              // localStorage.clear();
              // window.location.href = "/";
              singleSessionSignOut();
              return Promise.reject(error);
            }
          } else {
            return new Promise<void>((resolve, reject) => {
              refreshAndRetryQueue.current.push({
                config: originalRequest,
                resolve,
                reject,
              });
            });
          }
        }
        // Return a Promise rejection if the status code is not 401
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [authState.accessToken, authState.refreshToken]);

  const singleSessionSignOut = async (): SignOutResultType => {
    if (authState.user !== null) {
      try {
        const response = await axios.post(
          AUTH_URL + SINGLE_SESSION_SIGN_OUT_ENDPOINT,
          // POST {{api-url}}/auth/single-session-sign-out
          // {
          //     "refreshToken": "{refresh-token}"
          // }
          {
            refreshToken: authState.refreshToken,
          }
        );
        // response.data.numberOfRefreshTokensRemoved
        // response.data.message
        openSnackbar({
          title: `actions were successfully performed`,
          body: "successfully logged out of a single account",
          severity: "success",
        });
        setAuthState(authInitialState);
        return {
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `actions could not be performed`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
        };
      }
    } else {
      openSnackbar({
        title: `actions could not be performed`,
        body: "authorization failed",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
      };
    }
  };

  const allSessionsSignOut = async (): SignOutResultType => {
    if (authState.user !== null) {
      try {
        const response = await axios.post(
          AUTH_URL + ALL_SESSIONS_SIGN_OUT_ENDPOINT
          // POST {{api-url}}/auth/all-sessions-sign-out

          // {
          //   headers: { Authorization: `Bearer ${authState?.accessToken}` },
          // }
        );
        // console.log(response.data.message);
        // console.log(response.data.numberOfRefreshTokensRemoved);
        openSnackbar({
          title: `actions were successfully performed`,
          body: `successfully logged out from ${response.data.numberOfRefreshTokensRemoved} accounts`,
          severity: "success",
        });
        setAuthState(authInitialState);
        return {
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `actions could not be performed`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
        };
      }
    } else {
      openSnackbar({
        title: `actions could not be performed`,
        body: "authorization failed",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
      };
    }
  };

  const signIn = async ({
    username,
    password,
  }: SignInProps): SignInResultType => {
    try {
      const response = await axiosPublic.post(
        // {{api-url}}/auth/sign-in
        // {
        //   "username": "test",
        //   "password": "test123"
        // }
        AUTH_URL + SIGN_IN_ENDPOINT,
        {
          username,
          password,
        }
      );

      const newUser: UserDetailsType = {
        name: response.data.userPublicInfo.name,
        role: response.data.userPublicInfo.role,
        id: response.data.userPublicInfo.id,
        createdAt: response.data.userPublicInfo.createdAt,
        updatedAt: response.data.userPublicInfo.updatedAt,
      };

      openSnackbar({
        title: `actions were successfully performed`,
        body: "successfully logged in",
        severity: "success",
      });
      setAuthState({
        user: newUser,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        iss: "TrickyPlay",
        status: "LOGGED_IN",
      });
      return {
        user: newUser,
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      setAuthState(authInitialState);
      openSnackbar({
        title: `actions could not be performed`,
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

  const signUp = async ({
    username,
    password,
  }: SignUpProps): SignUpResultType => {
    try {
      const response = await axiosPublic.post(
        // POST {{api-url}}/auth/sign-up
        // {
        //   "username": "testUser123",
        //   "password": "testUser1234"
        // }
        ACCOUNT_URL + SIGN_UP_ENDPOINT,
        { username, password }
      );

      const newUser: UserDetailsType = {
        name: response.data.userPublicInfo.name,
        role: response.data.userPublicInfo.role,
        id: response.data.userPublicInfo.id,
        createdAt: response.data.userPublicInfo.createdAt,
        updatedAt: response.data.userPublicInfo.updatedAt,
      };

      setAuthState({
        user: newUser,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        iss: "TrickyPlay",
        status: "LOGGED_IN",
      });
      openSnackbar({
        title: `actions were successfully performed`,
        body: "successfully signed up",
        severity: "success",
      });
      return {
        user: newUser,
        message: "Success",
        status: response.status,
      };
    } catch (err: any) {
      setAuthState(authInitialState);
      openSnackbar({
        title: `actions could not be performed`,
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

  const updateUsername = async ({
    newUsername,
    currentPassword,
  }: UpdateUsernameProps): UpdateAccountResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.patch(
          // PATCH {{api-url}}/account
          // {
          //   "newUsername": "1234asdfasdf",
          //   "newPassword": "12341234asdf"
          // }
          ACCOUNT_URL,
          {
            newUsername,
            currentPassword,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const newUser: UserDetailsType = {
          name: response.data.name,
          role: response.data.role,
          id: response.data.id,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        openSnackbar({
          title: `actions were successfully performed, the username has changed`,
          body: "username changed",
          severity: "success",
        });
        setAuthState((prev) => {
          return { ...prev, user: newUser };
        });
        return {
          user: newUser,
          message: "Success",
          status: 200,
        };
      } catch (err: any) {
        setAuthState(authInitialState);
        openSnackbar({
          title: `actions could not be performed, the username has not changed`,
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
        title: `actions could not be performed, the username has not changed`,
        body: "authorization failed",
        severity: "error",
      });
      setAuthState(authInitialState);
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        user: null,
      };
    }
  };

  const updatePassword = async ({
    newPassword,
    currentPassword,
  }: UpdatePasswordProps): UpdateAccountResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.patch(
          // PATCH {{api-url}}/account
          // {
          //   "newUsername": "1234asdfasdf",
          //   "newPassword": "12341234asdf"
          // }
          ACCOUNT_URL,
          {
            currentPassword,
            newPassword,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const newUser: UserDetailsType = {
          name: response.data.name,
          role: response.data.role,
          id: response.data.id,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        openSnackbar({
          title: `actions were successfully performed`,
          body: "password changed",
          severity: "success",
        });
        setAuthState((prev) => {
          return { ...prev, user: newUser };
        });
        return {
          user: newUser,
          message: "Success",
          status: 200,
        };
      } catch (err: any) {
        setAuthState(authInitialState);
        openSnackbar({
          title: `actions could not be performed, the password has not changed`,
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
        title: `the password has not changed`,
        body: "authorization failed",
        severity: "error",
      });
      setAuthState(authInitialState);
      return {
        message: "Lack of sufficient permissions",
        status: 401,
        user: null,
      };
    }
  };

  // GET {{api-url}}/account/activity-summary
  const accountActivitySummary = async (): AccountActivitySummaryResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.get(
          ACCOUNT_URL + ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT
        );
        return {
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `actions could not be performed`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
        };
      }
    } else {
      openSnackbar({
        title: `actions could not be performed`,
        body: "authorization failed",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
      };
    }
  };

  const deleteAccount = async (): DeleteAccountResultType => {
    if (authState.user !== null) {
      try {
        const response = await axiosPrivate.delete(ACCOUNT_URL); // DELETE {{api-url}}/account
        // response.data.message
        openSnackbar({
          title: `actions were successfully performed`,
          body: "account deleted successfully",
          severity: "success",
        });
        setAuthState(authInitialState);
        return {
          message: "Success",
          status: response.status,
        };
      } catch (err: any) {
        openSnackbar({
          title: `actions could not be performed`,
          body: mapResponseErrorToMessage(err),
          severity: "error",
        });
        return {
          message: mapResponseErrorToMessage(err),
          status: err.response?.status,
        };
      }
    } else {
      openSnackbar({
        title: `actions could not be performed`,
        body: "authorization failed",
        severity: "error",
      });
      return {
        message: "Lack of sufficient permissions",
        status: 401,
      };
    }
  };

  return {
    authState,
    axiosPrivate,
    axiosPublic,
    deleteAccount,
    signIn,
    singleSessionSignOut,
    allSessionsSignOut,
    signUp,
    updatePassword,
    updateUsername,
    accountActivitySummary,
  };
}
