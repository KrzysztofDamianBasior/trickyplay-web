import { http, HttpResponse } from "msw";

import { isAuthenticated } from "../helpers/isAuthenticated";
import generateErrorResponseBody from "../helpers/generateErrorResponseBody";
import { extractUsernameAndPasswordOrThrow } from "../helpers/extractUsernameAndPasswordOrThrow";

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
import { TPUserRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";

import {
  allSessionsSignOutPath,
  refreshAccessTokenPath,
  signInPath,
  signUpPath,
  singleSessionSignOutPath,
} from "../urls";

import { usersCollectionStub } from "../stubs/users";

// refresh-access-token
// Intuitively, a get request is the right solution for retrieving a new refresh token, however, this operation requires a secret password that should not be sent in the URL, and a get request does not allow the request body to have a semantic meaning
// Moreover, the problem in sending the secret in the get request body is the javascript engine. According to the documentation and the spec XMLHttpRequest ignores the body of the request in case the method is GET. If you perform a request in Chrome/Electron with XMLHttpRequest and you try to put a json body in the send method this just gets ignored. Using fetch which is the modern replacement for XMLHtppRequest also seems to fail in Chrome/Electron.
// From the HTTP 1.1 2014 Spec: A payload within a GET request message has no defined semantics; sending a payload body on a GET request might cause some existing implementations to reject the request.
export const refreshAccessToken = http.post<
  {},
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse
>(refreshAccessTokenPath, async ({ params, request, cookies }) => {
  const data = await request.formData();
  let refreshToken = data.get("refreshToken");
  if (!refreshToken) {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        refreshAccessTokenPath,
        "lack of refresh token"
      ),
      { status: 400 }
    );
  }
  refreshToken = refreshToken as string;

  return HttpResponse.json({
    accessToken: refreshToken,
  });
});

export const singleSessionSignOut = http.post<
  {},
  SingleSessionSignOutRequest,
  SignOutResponse
>(singleSessionSignOutPath, async ({ params, request, cookies }) => {
  isAuthenticated(request, singleSessionSignOutPath);

  const data = await request.formData();
  let refreshToken = data.get("refreshToken");
  if (!refreshToken) {
    throw HttpResponse.json(
      generateErrorResponseBody(
        "Bad Request",
        refreshAccessTokenPath,
        "lack of refresh token"
      ),
      { status: 400 }
    );
  }

  return HttpResponse.json({
    message: "successfully signed out",
    numberOfRefreshTokensRemoved: 1,
  });
});

export const allSessionsSignOut = http.post<{}, {}, SignOutResponse>(
  allSessionsSignOutPath,
  async ({ params, request, cookies }) => {
    isAuthenticated(request, allSessionsSignOutPath);

    return HttpResponse.json({
      message: "successfully signed out",
      numberOfRefreshTokensRemoved: 5,
    });
  }
);

export const signIn = http.post<{}, SignInRequest, SignInResponse>(
  signInPath,
  async ({ params, request, cookies }) => {
    const data = await request.formData();
    const { username, password } = extractUsernameAndPasswordOrThrow({
      formData: data,
      path: signInPath,
    });

    const user = usersCollectionStub.find((u) => u.name === username);
    if (user == null) {
      const responseBody = generateErrorResponseBody(
        "Not Found",
        signInPath,
        "user not found"
      );
      throw HttpResponse.json(responseBody, { status: 404 });
    }

    const response: SignInResponse = {
      accessToken: username,
      refreshToken: username,
      userPublicInfo: user,
    };

    return HttpResponse.json(response);
  }
);

export const signUp = http.post<{}, SignUpRequest, SignInResponse>(
  signUpPath,
  async ({ params, request, cookies }) => {
    const data = await request.formData();
    const { username, password } = extractUsernameAndPasswordOrThrow({
      formData: data,
      path: signInPath,
    });

    const idOfUserWithTheSameName = usersCollectionStub.findIndex(
      (u) => u.name === username
    );

    if (idOfUserWithTheSameName !== -1) {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          signUpPath,
          "this username has already been taken"
        ),
        { status: 400 }
      );
    }

    // three oneliners which handle search for next id:
    const nextId =
      usersCollectionStub.reduce((a, b) => (a.id > b.id ? a : b)).id + 1; // time complexity:  O(n)
    // const nextId = commentsCollectionStub.sort((a, b) => b.id - a.id)[0].id +1; // time complexity:  O(nlogn)
    // const nextId:number = Math.max(...commentsCollectionStub.map(comm=>comm.id)) +1;     // time complexity: >O(2n)

    const now = new Date();

    const user: TPUserRepresentation = {
      id: nextId,
      name: username,
      role: "USER",
      createdAt: now.toISOString().split(".")[0],
      updatedAt: now.toISOString().split(".")[0],
    };

    usersCollectionStub.push(user);

    const response: SignInResponse = {
      accessToken: username,
      refreshToken: username,
      userPublicInfo: user,
    };

    return HttpResponse.json(response, {
      status: 201,
      statusText: "created /users/1",
    });
  }
);

// --------------------------------------------------------------

export const refreshAccessToken_RefreshTokenNotFound = http.post<
  {},
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
  {},
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
  {},
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
  {},
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
  {},
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
  {},
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
  {},
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
  {},
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
  {},
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
  {},
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

export const allSessionsSignOut_InternalServerError = http.post<
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

export const handlers = [
  refreshAccessToken,
  singleSessionSignOut,
  allSessionsSignOut,
  signIn,
  signUp,
];

export const internalServerErrorHandlers = [
  refreshAccessToken_InternalServerError,
  singleSessionSignOut_InternalServerError,
  allSessionsSignOut_InternalServerError,
  signIn_InternalServerError,
  signUp_InternalServerError,
];
