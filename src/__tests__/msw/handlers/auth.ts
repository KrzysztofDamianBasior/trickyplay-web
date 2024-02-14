import { http, HttpResponse } from "msw";

import { isAuthenticated } from "../helpers/isAuthenticated";
import generateErrorResponseBody from "../helpers/generateErrorResponseBody";

import {
  RefreshAccessTokenRequest,
  SignInRequest,
  SignUpRequest,
  SingleSessionSignOutRequest,
} from "../../../shared/models/externalApiRepresentation/Requests";
import {
  RefreshAccessTokenResponse,
  SignInResponse,
  SignOutResponse,
} from "../../../shared/models/externalApiRepresentation/Responses";
import {
  BadRequest400ResponseType,
  InternalServerError500ResponseType,
  NotFound404ResponseType,
  Unauthorized401ResponseType,
} from "../../../shared/models/externalApiRepresentation/Errors";

const refreshAccessTokenPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_AUTH_URL}/${process.env.REACT_APP_REFRESH_ACCESS_TOKEN_ENDPOINT}`;

const signInPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_AUTH_URL}/${process.env.REACT_APP_SIGN_IN_ENDPOINT}`;

const signUpPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_AUTH_URL}/${process.env.REACT_APP_SIGN_UP_ENDPOINT}`;

const singleSessionSignOutPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_AUTH_URL}/${process.env.REACT_APP_SINGLE_SESSION_SIGN_OUT_ENDPOINT}`;

const allSessionsSignOutPath = `${process.env.REACT_APP_TRICKYPLAY_API_BASE_URL}/${process.env.REACT_APP_AUTH_URL}/${process.env.REACT_APP_ALL_SESSIONS_SIGN_OUT_ENDPOINT}`;

export const handlers = [
  // refresh-access-token
  // Intuitively, a get request is the right solution for retrieving a new refresh token, however, this operation requires a secret password that should not be sent in the URL, and a get request does not allow the request body to have a semantic meaning
  // Moreover, the problem in sending the secret in the get request body is the javascript engine. According to the documentation and the spec XMLHttpRequest ignores the body of the request in case the method is GET. If you perform a request in Chrome/Electron with XMLHttpRequest and you try to put a json body in the send method this just gets ignored. Using fetch which is the modern replacement for XMLHtppRequest also seems to fail in Chrome/Electron.
  // From the HTTP 1.1 2014 Spec: A payload within a GET request message has no defined semantics; sending a payload body on a GET request might cause some existing implementations to reject the request.
  http.post<
    {}, // RefreshAccessTokenParams - no params
    RefreshAccessTokenRequest,
    RefreshAccessTokenResponse | BadRequest400ResponseType
  >(refreshAccessTokenPath, async ({ params, request, cookies }) => {
    const data = await request.formData();
    const refreshToken = data.get("refreshToken");
    if (!refreshToken) {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          refreshAccessTokenPath,
          "lack of refresh token"
        ),
        { status: 400 }
      );
    }

    return HttpResponse.json({
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzA3Mzg2MDI4LCJleHAiOjE3MDc0NzI0MjgsInVzZXJJZCI6IjIiLCJ1c2VyTmFtZSI6InRlc3QiLCJ1c2VyUm9sZSI6IkFETUlOIiwidXNlckNyZWF0ZWRBdCI6IjIwMjMtMTAtMTVUMjA6MzA6MzgiLCJ1c2VyVXBkYXRlZEF0IjoiMjAyMy0xMC0xNVQyMDozMDozOCIsImF1dGhvcml0aWVzIjpbImFkbWluOmNyZWF0ZSIsInVzZXI6Y3JlYXRlIiwidXNlcjpkZWxldGUiLCJhZG1pbjpyZWFkIiwiYWRtaW46dXBkYXRlIiwiYWRtaW46ZGVsZXRlIiwidXNlcjpyZWFkIiwidXNlcjp1cGRhdGUiLCJST0xFX0FETUlOIl19.7abb2NvT2CYNxq48UrGeYGJE1w6J8bjrKMSLudFR584",
    });
  }),

  // single-session-signout
  http.post<
    {},
    SingleSessionSignOutRequest,
    SignOutResponse | Unauthorized401ResponseType
  >(singleSessionSignOutPath, async ({ params, request, cookies }) => {
    await isAuthenticated(request, singleSessionSignOutPath);

    return HttpResponse.json({
      message: "successfully signed out",
      numberOfRefreshTokensRemoved: 1,
    });
  }),

  // all-sessions-sign-out
  http.post<{}, {}, SignOutResponse | Unauthorized401ResponseType>(
    allSessionsSignOutPath,
    async ({ params, request, cookies }) => {
      await isAuthenticated(request, allSessionsSignOutPath);

      return HttpResponse.json({
        message: "successfully signed out",
        numberOfRefreshTokensRemoved: 5,
      });
    }
  ),

  // sign-in
  http.post<{}, SignInRequest, SignInResponse | BadRequest400ResponseType>(
    signInPath,
    async ({ params, request, cookies }) => {
      const data = await request.formData();
      let username = data.get("username");
      let password = data.get("password");

      if (username && password) {
        username = username as string; // FormData.get() returns a value of type string | File | null.
        password = password as string;
        if (!new RegExp("^[a-zA-Z0-9_]{2,16}$").test(username)) {
          return HttpResponse.json(
            generateErrorResponseBody(
              "Bad Request",
              signInPath,
              "Username must contain between 2 and 16 characters. It can only consist of underscores, numbers, lowercase and uppercase letters."
            )
          );
        }
        if (!new RegExp("^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$").test(password)) {
          return HttpResponse.json(
            generateErrorResponseBody(
              "Bad Request",
              signInPath,
              "Password must contain between 4 and 32 characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters."
            )
          );
        }

        const response: SignInResponse = {
          accessToken:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzA3Mzg0Njg2LCJleHAiOjE3MDc0NzEwODYsInVzZXJJZCI6IjIiLCJ1c2VyTmFtZSI6InRlc3QiLCJ1c2VyUm9sZSI6IkFETUlOIiwidXNlckNyZWF0ZWRBdCI6IjIwMjMtMTAtMTVUMjA6MzA6MzgiLCJ1c2VyVXBkYXRlZEF0IjoiMjAyMy0xMC0xNVQyMDozMDozOCIsImF1dGhvcml0aWVzIjpbImFkbWluOmNyZWF0ZSIsInVzZXI6Y3JlYXRlIiwidXNlcjpkZWxldGUiLCJhZG1pbjpyZWFkIiwiYWRtaW46dXBkYXRlIiwiYWRtaW46ZGVsZXRlIiwidXNlcjpyZWFkIiwidXNlcjp1cGRhdGUiLCJST0xFX0FETUlOIl19.rOiVWaYB86JmWqUAJ15VYmDTO1J2nFGIPZ00eJl1Rt4",
          refreshToken: "0e4df047-4ab7-491a-a92e-5104e652291e",
          userPublicInfo: {
            id: 1,
            name: username,
            role: "USER",
            createdAt: "2023-10-15T20:30:38",
            updatedAt: "2023-10-15T20:30:38",
          },
        };
        return HttpResponse.json(response);
      } else {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            signInPath,
            "missing username or password"
          )
        );
      }
    }
  ),

  // sign-up
  http.post<
    {}, // SingleSessionSignOutParams - no params
    SignUpRequest,
    SignInResponse | BadRequest400ResponseType
  >(signUpPath, async ({ params, request, cookies }) => {
    const data = await request.formData();
    let username = data.get("username");
    let password = data.get("password");

    if (username && password) {
      username = username as string; // FormData.get() returns a value of type string | File | null.
      password = password as string;
      if (!new RegExp("^[a-zA-Z0-9_]{2,16}$").test(username)) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            signInPath,
            "Username must contain between 2 and 16 characters. It can only consist of underscores, numbers, lowercase and uppercase letters."
          )
        );
      }
      if (!new RegExp("^(?=.*[0-9])[a-zA-Z0-9_]{4,32}$").test(password)) {
        return HttpResponse.json(
          generateErrorResponseBody(
            "Bad Request",
            signInPath,
            "Password must contain between 4 and 32 characters. It must contain at least one number. The password can only consist of underscores, numbers, lowercase and uppercase letters."
          )
        );
      }

      const response: SignInResponse = {
        accessToken:
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzA3Mzg0Njg2LCJleHAiOjE3MDc0NzEwODYsInVzZXJJZCI6IjIiLCJ1c2VyTmFtZSI6InRlc3QiLCJ1c2VyUm9sZSI6IkFETUlOIiwidXNlckNyZWF0ZWRBdCI6IjIwMjMtMTAtMTVUMjA6MzA6MzgiLCJ1c2VyVXBkYXRlZEF0IjoiMjAyMy0xMC0xNVQyMDozMDozOCIsImF1dGhvcml0aWVzIjpbImFkbWluOmNyZWF0ZSIsInVzZXI6Y3JlYXRlIiwidXNlcjpkZWxldGUiLCJhZG1pbjpyZWFkIiwiYWRtaW46dXBkYXRlIiwiYWRtaW46ZGVsZXRlIiwidXNlcjpyZWFkIiwidXNlcjp1cGRhdGUiLCJST0xFX0FETUlOIl19.rOiVWaYB86JmWqUAJ15VYmDTO1J2nFGIPZ00eJl1Rt4",
        refreshToken: "0e4df047-4ab7-491a-a92e-5104e652291e",
        userPublicInfo: {
          id: 1,
          name: username,
          role: "USER",
          createdAt: "2023-10-15T20:30:38",
          updatedAt: "2023-10-15T20:30:38",
        },
      };

      return HttpResponse.json(response, {
        status: 201,
        statusText: "created /users/1",
      });
    } else {
      return HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          signInPath,
          "missing username or password"
        )
      );
    }
  }),
];

// --------------------------------------------------------------

export const refreshAccessToken_RefreshTokenNotFound = http.post<
  {}, // RefreshAccessTokenParams - no params
  RefreshAccessTokenRequest,
  NotFound404ResponseType
>(refreshAccessTokenPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Not Found",
      refreshAccessTokenPath,
      "refresh token not found"
    ),
    { status: 404 }
  );
});

export const refreshAccessToken_RefreshTokenExpiredOrRevoked = http.post<
  {}, // RefreshAccessTokenParams - no params
  RefreshAccessTokenRequest,
  Unauthorized401ResponseType
>(refreshAccessTokenPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Unauthorized",
      refreshAccessTokenPath,
      "refresh token expired or revoked"
    ),
    { status: 401 }
  );
});

export const refreshAccessToken_InternalServerError = http.post<
  {}, // RefreshAccessTokenParams - no params
  RefreshAccessTokenRequest,
  InternalServerError500ResponseType
>(refreshAccessTokenPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      refreshAccessTokenPath,
      "internal server error"
    ),
    { status: 500 }
  );
});

export const signIn_UserNotFound = http.post<
  {}, // RefreshAccessTokenParams - no params
  SignInRequest,
  NotFound404ResponseType
>(signInPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Not Found",
      signInPath,
      "there is no user with this name"
    ),
    { status: 404 }
  );
});

export const signIn_InvalidCredentialsFormat = http.post<
  {}, // RefreshAccessTokenParams - no params
  SignInRequest,
  BadRequest400ResponseType
>(signInPath, async ({ params, request, cookies }) => {
  // If you specify invalid username format or the password is too short or too long (controlled by the @Pattern and @Length validation annotations), you will get HTTP 400 (Bad Request) status.
  return HttpResponse.json(
    generateErrorResponseBody(
      "Bad Request",
      signInPath,
      "invalid username format or the password is too short or too long"
    ),
    { status: 400 }
  );
});

export const signIn_InternalServerError = http.post<
  {}, // RefreshAccessTokenParams - no params
  SignInRequest,
  InternalServerError500ResponseType
>(signInPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      signInPath,
      "internal server error"
    ),
    { status: 500 }
  );
});

export const signUp_NameTaken = http.post<
  {}, // RefreshAccessTokenParams - no params
  SignUpRequest,
  BadRequest400ResponseType
>(signUpPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Bad Request",
      signUpPath,
      "this username has already been taken"
    ),
    { status: 400 }
  );
});

export const signUp_InvalidCredentialsFormat = http.post<
  {}, // RefreshAccessTokenParams - no params
  SignUpRequest,
  BadRequest400ResponseType
>(signUpPath, async ({ params, request, cookies }) => {
  // If you specify invalid username format or the password is too short or too long (controlled by the @Pattern and @Length validation annotations), you will get HTTP 400 (Bad Request) status.
  return HttpResponse.json(
    generateErrorResponseBody(
      "Bad Request",
      signUpPath,
      "invalid username format or the password is too short or too long"
    ),
    { status: 400 }
  );
});

export const signUp_InternalServerError = http.post<
  {}, // RefreshAccessTokenParams - no params
  SignUpRequest,
  InternalServerError500ResponseType
>(signUpPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      signUpPath,
      "internal server error"
    ),
    { status: 500 }
  );
});

export const singleSessionSignOut_RefreshTokenNotFound = http.post<
  {}, // RefreshAccessTokenParams - no params
  RefreshAccessTokenRequest,
  NotFound404ResponseType
>(singleSessionSignOutPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Not Found",
      singleSessionSignOutPath,
      "refresh token not found"
    ),
    { status: 404 }
  );
});

export const singleSessionSignOut_InvalidRefreshTokenFormat = http.post<
  {},
  RefreshAccessTokenRequest,
  BadRequest400ResponseType
>(singleSessionSignOutPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Bad Request",
      singleSessionSignOutPath,
      "invalid refresh token format"
    ),
    { status: 404 }
  );
});

export const singleSessionSignOut_InternalServerError = http.post<
  {},
  RefreshAccessTokenRequest,
  InternalServerError500ResponseType
>(singleSessionSignOutPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      singleSessionSignOutPath,
      "internal server error"
    ),
    { status: 500 }
  );
});

export const allSessionsSignOut_UserNotFound = http.post<
  {},
  {},
  NotFound404ResponseType
>(allSessionsSignOutPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Not Found",
      allSessionsSignOutPath,
      "user not found"
    ),
    { status: 404 }
  );
});

export const allSessionSignOut_InternalServerError = http.post<
  {},
  {},
  InternalServerError500ResponseType
>(allSessionsSignOutPath, async ({ params, request, cookies }) => {
  return HttpResponse.json(
    generateErrorResponseBody(
      "Internal Server Error",
      allSessionsSignOutPath,
      "internal server error"
    ),
    { status: 500 }
  );
});
