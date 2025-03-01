import { act, renderHook } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import useAccount from "../useAccount";

import NotificationContextWrapper from "../../__tests__/beds/NotificationContextWrapper";
import { server } from "../../../../__tests__/msw/server";
import { signIn_InternalServerError } from "../../../../__tests__/msw/handlers/auth";
import {
  password,
  userName,
  usersCollectionStub,
} from "../../../../__tests__/msw/stubs/users";

describe("useAccount hook behavior for happy paths (optimistic network behavior)", () => {
  it("should correctly set the initial state of the account context", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    expect(result.current.authState.accessToken).toBeNull();
    expect(result.current.authState.refreshToken).toBeNull();
    expect(result.current.authState.status).toEqual("LOGGED_OUT");
    expect(result.current.authState.user).toBeNull();
  });

  it("should correctly populate the account context with user data when the signIn is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    await act(async () => {
      const signInResult = await result.current.signIn({
        username: userName,
        password: password,
      });
      expect(signInResult.message).toEqual("Success");
      expect(signInResult.status).toEqual(200);
      expect(signInResult.user).toBeTruthy();
      expect(signInResult.user?.name).toEqual(userName);
    });

    expect(result.current.authState.accessToken).toBeTruthy();
    expect(result.current.authState.refreshToken).toBeTruthy();
    expect(result.current.authState.status).toEqual("LOGGED_IN");
    expect(result.current.authState.user).toBeTruthy();
    expect(result.current.authState.user?.name).toEqual(userName);
  });

  it("should correctly populate the account context with user data when the signUp is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    await act(async () => {
      const signUpResult = await result.current.signUp({
        username: "signUpUsername",
        password: "signUpPa22word",
      });
      expect(signUpResult.message).toEqual("Success");
      expect(signUpResult.status).toEqual(201);
      expect(signUpResult.user).toBeTruthy();
      expect(signUpResult.user?.name).toEqual("signUpUsername");
      expect(signUpResult.user?.role).toEqual("USER");
      expect(signUpResult.user?.id).toBeTruthy();
      expect(signUpResult.user?.createdAt).toBeTruthy();
      expect(signUpResult.user?.updatedAt).toBeTruthy();
    });

    expect(result.current.authState.accessToken).toBeTruthy();
    expect(result.current.authState.refreshToken).toBeTruthy();
    expect(result.current.authState.status).toEqual("LOGGED_IN");
    expect(result.current.authState.user).toBeTruthy();
    expect(result.current.authState.user?.name).toEqual("signUpUsername");
    expect(result.current.authState.user?.role).toEqual("USER");
    expect(result.current.authState.user?.id).toBeTruthy();
    expect(result.current.authState.user?.updatedAt).toBeTruthy();
    expect(result.current.authState.user?.createdAt).toBeTruthy();
  });

  it("should remove the user data from the account context after the singleSessionSignOut is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    await act(async () => {
      await result.current.signIn({
        username: userName,
        password: password,
      });
    });

    await act(async () => {
      const signOutResult = await result.current.singleSessionSignOut();
      expect(signOutResult.status).toEqual(200);
      expect(signOutResult.message).toEqual("Success");
    });

    expect(result.current.authState.accessToken).toBeNull();
    expect(result.current.authState.refreshToken).toBeNull();
    expect(result.current.authState.status).toEqual("LOGGED_OUT");
    expect(result.current.authState.user).toBeNull();
  });

  it("should remove the user data from the account context after the allSessionsSignOut is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    await act(async () => {
      await result.current.signIn({
        username: userName,
        password: password,
      });
    });

    await act(async () => {
      const signOutResult = await result.current.allSessionsSignOut();
      expect(signOutResult.status).toEqual(200);
      expect(signOutResult.message).toEqual("Success");
    });

    expect(result.current.authState.accessToken).toBeNull();
    expect(result.current.authState.refreshToken).toBeNull();
    expect(result.current.authState.status).toEqual("LOGGED_OUT");
    expect(result.current.authState.user).toBeNull();
  });

  it("should correctly update the user information in the account context after updateUsername is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    let userUpdatedAt: string | undefined = undefined;
    let userCreatedAt: string | undefined = undefined;
    await act(async () => {
      const user = await result.current.signUp({
        username: "newUser",
        password: "pa22wOrd",
      });
      userUpdatedAt = user.user?.updatedAt;
      userCreatedAt = user.user?.createdAt;
    });

    const delay = (delayInMs: number) => {
      return new Promise((resolve) => setTimeout(resolve, delayInMs));
    };
    await delay(1000);

    await act(async () => {
      const updateUsernameResult = await result.current.updateUsername({
        newUsername: "newName",
      });
      expect(updateUsernameResult.status).toEqual(200);
      expect(updateUsernameResult.message).toEqual("Success");
      expect(updateUsernameResult.user).toBeTruthy();
      expect(updateUsernameResult.user?.name).toEqual("newName");
      expect(updateUsernameResult.user?.id).toBeTruthy();
      expect(updateUsernameResult.user?.role).toEqual("USER");
      expect(updateUsernameResult.user?.createdAt).toEqual(userCreatedAt);

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const newUpdatedAt = new Date(updateUsernameResult.user?.updatedAt!); // when we pass undefined as a constructor parameter then invalid date will be returned, getTime() method called on invalid date will return NaN
      const previousUpdatedAt = new Date(userUpdatedAt!);

      expect(newUpdatedAt.getTime() > previousUpdatedAt.getTime()).toBeTruthy();
    });

    expect(result.current.authState.accessToken).toBeTruthy();
    expect(result.current.authState.refreshToken).toBeTruthy();
    expect(result.current.authState.status).toEqual("LOGGED_IN");
    expect(result.current.authState.user).toBeTruthy();
    expect(result.current.authState.user?.name).toEqual("newName");
    expect(result.current.authState.user?.role).toEqual("USER");
    expect(result.current.authState.user?.id).toBeTruthy();
    expect(result.current.authState.user?.createdAt).toEqual(userCreatedAt);

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const newUpdatedAt = new Date(result.current.authState.user?.updatedAt!); // when we pass undefined as a constructor parameter then invalid date will be returned, getTime() method called on invalid date will return NaN
    const previousUpdatedAt = new Date(userUpdatedAt!);

    expect(newUpdatedAt.getTime() > previousUpdatedAt.getTime()).toBeTruthy();
  });

  it("should correctly update the user information in the account context after updatePassword is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    let userUpdatedAt: string | undefined = undefined;
    let userCreatedAt: string | undefined = undefined;
    await act(async () => {
      const user = await result.current.signUp({
        username: "newUser",
        password: "pa22wOrd",
      });
      userUpdatedAt = user.user?.updatedAt;
      userCreatedAt = user.user?.createdAt;
    });

    const delay = (delayInMs: number) => {
      return new Promise((resolve) => setTimeout(resolve, delayInMs));
    };
    await delay(1000);

    await act(async () => {
      const updatePasswordResult = await result.current.updatePassword({
        newPassword: "Pa22w0rD",
      });
      expect(updatePasswordResult.status).toEqual(200);
      expect(updatePasswordResult.message).toEqual("Success");
      expect(updatePasswordResult.user).toBeTruthy();
      expect(updatePasswordResult.user?.name).toEqual("newUser");
      expect(updatePasswordResult.user?.id).toBeTruthy();
      expect(updatePasswordResult.user?.role).toEqual("USER");
      expect(updatePasswordResult.user?.createdAt).toEqual(userCreatedAt);

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const newUpdatedAt = new Date(updatePasswordResult.user?.updatedAt!); // when we pass undefined as a constructor parameter then invalid date will be returned, getTime() method called on invalid date will return NaN
      const previousUpdatedAt = new Date(userUpdatedAt!);

      expect(newUpdatedAt.getTime() > previousUpdatedAt.getTime()).toBeTruthy();
    });

    expect(result.current.authState.accessToken).toBeTruthy();
    expect(result.current.authState.refreshToken).toBeTruthy();
    expect(result.current.authState.status).toEqual("LOGGED_IN");
    expect(result.current.authState.user).toBeTruthy();
    expect(result.current.authState.user?.name).toEqual("newUser");
    expect(result.current.authState.user?.role).toEqual("USER");
    expect(result.current.authState.user?.id).toBeTruthy();
    expect(result.current.authState.user?.createdAt).toEqual(userCreatedAt);

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const newUpdatedAt = new Date(result.current.authState.user?.updatedAt!); // when we pass undefined as a constructor parameter then invalid date will be returned, getTime() method called on invalid date will return NaN
    const previousUpdatedAt = new Date(userUpdatedAt!);

    expect(newUpdatedAt.getTime() > previousUpdatedAt.getTime()).toBeTruthy();
  });

  it("should remove the user data from the account context after deleteAccount is called", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    await act(async () => {
      await result.current.signIn({
        username: userName,
        password: password,
      });
    });

    const usersCollectionLength = usersCollectionStub.length;

    await act(async () => {
      const deleteAccountResult = await result.current.deleteAccount();
      expect(deleteAccountResult.status).toEqual(200);
      expect(deleteAccountResult.message).toEqual("Success");
    });

    expect(result.current.authState.accessToken).toBeNull();
    expect(result.current.authState.refreshToken).toBeNull();
    expect(result.current.authState.status).toEqual("LOGGED_OUT");
    expect(result.current.authState.user).toBeNull();
    expect(usersCollectionStub.length).toEqual(usersCollectionLength - 1);
  });
});

describe("useAccount hook behavior when internal server errors occur", () => {
  it("should correctly set the initial state of the account context", async () => {
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );
    expect(result.current.authState.accessToken).toBeNull();
    expect(result.current.authState.refreshToken).toBeNull();
    expect(result.current.authState.status).toEqual("LOGGED_OUT");
    expect(result.current.authState.user).toBeNull();
  });

  it("should set LOGGED_OUT status in the AccountContext when signIn is called", async () => {
    server.use(signIn_InternalServerError);
    const { result } = renderHook(
      () => useAccount({ openSnackbar: () => {} }),
      {
        wrapper: NotificationContextWrapper,
      }
    );

    await act(async () => {
      const signInResult = await result.current.signIn({
        username: userName,
        password: password,
      });
      expect(signInResult.user).toBeNull();
      expect(signInResult.status).toEqual(500);
    });

    expect(result.current.authState.accessToken).toBeNull();
    expect(result.current.authState.refreshToken).toBeNull();
    expect(result.current.authState.status).toEqual("LOGGED_OUT");
    expect(result.current.authState.user).toBeNull();
  });
});
