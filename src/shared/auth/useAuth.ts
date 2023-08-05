import { createContext, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import axios from "axios";

import type {
  AuthStateType,
  AuthContextType,
  signInProps,
  signUpProps,
  SignInResult,
  SignUpResult,
} from "./authTypes";

export const authInitialState: AuthStateType = {
  status: "LOGGED_OUT",
  accessToken: null,
  refreshToken: null,
  iss: null,
  user: null,
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const AuthContext = createContext<AuthContextType>({
  authState: authInitialState,
  signIn: (userData: signInProps) => {},
  signUp: (userData: signUpProps) => {},
  signOut: () => {},
  axiosPrivate: axiosPrivate,
  axiosPublic: axiosPublic,
});

export default function useAuth(): AuthContextType {
  const [authState, setAuthState] = useLocalStorage<AuthStateType>(
    "AUTH_STATE",
    authInitialState
  );

  useEffect(() => {
    const refresh = async () => {
      // const response = await axiosPublic.get("/refresh", {
      //   withCredentials: true,
      // });
      // setAuthState((prev) => {
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

    //     axios.defaults.baseURL = 'http://localhost:8000/api/';
    //     let refresh = false;
    //     axios.interceptors.response.use(resp => resp, async error => {
    //         if (error.response.status === 401 && !refresh) { // 401- unauntehnticated
    //             refresh = true;
    //             const response = await axios.post('refresh', {}, {withCredentials: true});
    //             if (response.status === 200) { // response is successful
    //                 axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;
    //                 return axios(error.config);
    //             }
    //         }
    //         refresh = false;
    //         return error;
    //     });

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

  const signOut = async () => {
    setAuthState(authInitialState);
    // await axios.post('logout', {}, {withCredentials: true});
  };

  const signIn = async ({
    username,
    password,
  }: signInProps): Promise<SignInResult> => {
    setAuthState({
      user: {
        name: username,
        id: "asdf",
        roles: ["User"],
      },
      accessToken: "asdf",
      refreshToken: "asdf",
      iss: "TrickyPlay",
      status: "LOGGED_IN",
    });
    const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
    try {
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
      //   // setAuthState({ user, pwd, roles, accessToken });
      if (Math.random() > 0.5) throw new Error();
      return "Success";
    } catch (err: any) {
      if (!err?.response) {
        return "No Server Response";
      } else if (err.response?.status === 400) {
        return "Missing Username or Password";
      } else if (err.response?.status === 401) {
        return "Unauthorized";
      } else {
        return "Login Failed";
      }
    }
  };
  const signUp = async ({
    username,
    password,
  }: signUpProps): Promise<SignUpResult> => {
    setAuthState({
      user: {
        name: username,
        id: "asdf",
        roles: ["User"],
      },
      accessToken: "asdf",
      refreshToken: "asdf",
      iss: "TrickyPlay",
      status: "LOGGED_IN",
    });
    const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;
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
    // setAuthState({ user, pwd, roles, accessToken });
    try {
      if (Math.random() > 0.5) throw new Error();
      return "Success";
    } catch (err: any) {
      if (!err?.response) {
        return "No Server Response";
      } else if (err.response?.status === 400) {
        return "Missing Username or Password";
      } else if (err.response?.status === 401) {
        return "Unauthorized";
      } else {
        return "Registration Failed";
      }
    }
  };

  return { authState, signIn, signOut, signUp, axiosPrivate, axiosPublic };
}
