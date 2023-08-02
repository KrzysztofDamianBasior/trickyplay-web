import { createContext, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import axios from "axios";

import type {
  AuthStateType,
  AuthContextType,
  signInProps,
  signUpProps,
} from "./authTypes";

export const authInitialState: AuthStateType = {
  status: "LOGGED_OUT",
  accessToken: null,
  refreshToken: null,
  iss: null,
  user: null,
};

export const AuthContext = createContext<AuthContextType>({
  authState: authInitialState,
  signIn: (userData: signInProps) => {},
  signUp: (userData: signUpProps) => {},
  signOut: () => {},
});

const BASE_URL = "http://localhost:3000";

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
    "userDetails",
    authInitialState
  );

  useEffect(() => {
    const refresh = async () => {
      const response = await axiosPublic.get("/refresh", {
        withCredentials: true,
      });

      // setAuth((prev) => {
      //   console.log(response.data.accessToken);
      //   return { ...prev, accessToken: response.data.accessToken };
      // });
      // return response.data.accessToken;
    };

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
        const prevRequest = error?.config;
        // 403- forbiden due to expiration
        // we only want to retry once
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [authState]);

  const signOut = () => {
    setAuthState(authInitialState);
    // const logout = async () => {
    //     await axios.post('logout', {}, {withCredentials: true});
    // }
  };

  const signIn = async (userData: signInProps) => {
    setAuthState({
      user: {
        name: userData.username,
        id: "asdf",
        roles: ["User"],
      },
      accessToken: "asdf",
      refreshToken: "asdf",
      iss: "TrickyPlay",
      status: "LOGGED_IN",
    });
    // const {data} = await axios.post('login', {
    //     email, password
    // }, {withCredentials: true});
    // axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;
  };

  const signUp = async (userData: signUpProps) => {
    setAuthState({
      user: {
        name: userData.username,
        id: "asdf",
        roles: ["User"],
      },
      accessToken: "asdf",
      refreshToken: "asdf",
      iss: "TrickyPlay",
      status: "LOGGED_IN",
    });
    // await axios.post('register', {
    //     name, email, password
    // });
  };

  return { authState, signIn, signOut, signUp };
}
