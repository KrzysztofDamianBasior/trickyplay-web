import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, test } from "vitest";

import useUsersAPIFacade from "../useUsersAPIFacade";

import notificationContextAndSigningAccountContextWrapperCreator from "../../__tests__/beds/notificationContextAndSigningAccountContextWrapperCreator";
import {
  adminName,
  password,
  userName,
} from "../../../../__tests__/msw/stubs/users";

describe("useUsersAPIFacade hook behavior for happy paths (optimistic network behavior)", () => {
  test("getUser returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(
      () => {
        expect(result.current.authState.status).toEqual("LOGGED_IN");
      },
      { timeout: 5000 }
    );

    const getUserResult = await result.current.getUser({
      id: "1",
    });
    expect(getUserResult.message).toEqual("Success");
    expect(getUserResult.status).toEqual(200);
    expect(getUserResult.user?.id).toEqual(1);
  });

  test("getUsers returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const getUsersResult = await result.current.getUsers({
      orderDirection: "Asc",
      pageNumber: 0,
      pageSize: 10,
      sortBy: "id",
    });
    expect(getUsersResult.message).toEqual("Success");
    expect(getUsersResult.status).toEqual(200);
    expect(getUsersResult.users?.length).toBeGreaterThan(0);
  });

  test("getUserComments returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const getUserCommentsResult = await result.current.getUserComments({
      userId: "1",
      orderDirection: "Asc",
      pageNumber: 0,
      pageSize: 10,
      sortBy: "id",
    });
    expect(getUserCommentsResult.message).toEqual("Success");
    expect(getUserCommentsResult.status).toEqual(200);
    expect(getUserCommentsResult.comments?.length).toBeGreaterThan(0);
  });

  test("getUserReplies returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const getUserRepliesResult = await result.current.getUserReplies({
      userId: "1",
      orderDirection: "Asc",
      pageNumber: 0,
      pageSize: 10,
      sortBy: "id",
    });
    expect(getUserRepliesResult.message).toEqual("Success");
    expect(getUserRepliesResult.status).toEqual(200);
    expect(getUserRepliesResult.replies?.length).toBeGreaterThan(0);
  });

  test("grantAdminPermissions returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: adminName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const grantAdminPermissionsResult =
      await result.current.grantAdminPermissions({
        id: "1",
      });
    expect(grantAdminPermissionsResult.message).toEqual("Success");
    expect(grantAdminPermissionsResult.status).toEqual(200);
    expect(grantAdminPermissionsResult.user?.role).toBe("ADMIN");
  });

  test("banUser returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: adminName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const banUserResult = await result.current.banUser({
      id: "1",
    });
    expect(banUserResult.message).toEqual("Success");
    expect(banUserResult.status).toEqual(200);
    expect(banUserResult.user?.role).toBe("BANNED");
  });

  test("unbanUser returns correct value", async () => {
    const { result } = renderHook(() => useUsersAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: adminName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const unbanUserResult = await result.current.unbanUser({
      id: "3",
    });
    expect(unbanUserResult.message).toEqual("Success");
    expect(unbanUserResult.status).toEqual(200);
    expect(unbanUserResult.user?.role).toBe("USER");
  });
});
