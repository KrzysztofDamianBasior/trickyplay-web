import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import useUsersPaginatedCollection from "../useUsersPaginatedCollection";
import { usersPaginatedCollectionInitialState } from "../usersPaginatedCollectionReducer";
import { calculateNumberOfPages } from "../../../utils";

import notificationContextAndSigningAccountContextWrapperCreator from "../../__tests__/beds/notificationContextAndSigningAccountContextWrapperCreator";
import {
  bannedStub,
  usersCollectionStub,
} from "../../../../__tests__/msw/stubs/users";
import {
  userName,
  adminName,
  password,
  userStub,
} from "../../../../__tests__/msw/stubs/users";

describe("useUsersPaginatedCollection hook behavior for happy paths (optimistic network behavior)", () => {
  it("should correctly set the initial state of the usersPaginatedCollection", async () => {
    const { result } = renderHook(() => useUsersPaginatedCollection(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    expect(result.current.usersPaginatedCollectionState).toEqual(
      usersPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.usersPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const numberOfUsers = usersCollectionStub.length;

    expect(
      result.current.usersPaginatedCollectionState.totalNumberOfAllUsers
    ).toEqual(numberOfUsers);
    expect(
      result.current.usersPaginatedCollectionState.usersActivePage
    ).toEqual(usersPaginatedCollectionInitialState.usersActivePage);
    expect(
      result.current.usersPaginatedCollectionState.usersPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: usersPaginatedCollectionInitialState.usersPerPage,
        totalNumberOfEntities: numberOfUsers,
      })
    );
    expect(
      result.current.usersPaginatedCollectionState.usersPaginatedCollection[0]
        .length
    ).toEqual(
      usersPaginatedCollectionInitialState.usersPerPage < numberOfUsers
        ? usersPaginatedCollectionInitialState.usersPerPage
        : numberOfUsers
    );
    expect(result.current.usersPaginatedCollectionState.usersPerPage).toEqual(
      usersPaginatedCollectionInitialState.usersPerPage
    );
  });

  it("should correctly set usersPaginatedCollectionState when handleUserBan is called", async () => {
    const { result } = renderHook(() => useUsersPaginatedCollection(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: adminName,
          password: password,
        },
      }),
    });

    expect(result.current.usersPaginatedCollectionState).toEqual(
      usersPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.usersPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleUserBan({
        page: 0,
        user: {
          id: userStub.id.toString(),
          name: userStub.name,
          createdAt: userStub.createdAt,
          updatedAt: userStub.updatedAt,
          role: userStub.role,
        },
      });
    });

    expect(
      result.current.usersPaginatedCollectionState.usersPaginatedCollection[0].find(
        (usr) => usr.id.toString() === userStub.id.toString()
      )?.role
    ).toEqual("BANNED");
  });

  it("should correctly set usersPaginatedCollectionState when handleUserUnban is called", async () => {
    const { result } = renderHook(() => useUsersPaginatedCollection(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: adminName,
          password: password,
        },
      }),
    });

    expect(result.current.usersPaginatedCollectionState).toEqual(
      usersPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.usersPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleUserUnban({
        page: 0,
        user: {
          id: bannedStub.id.toString(),
          name: bannedStub.name,
          createdAt: bannedStub.createdAt,
          updatedAt: bannedStub.updatedAt,
          role: bannedStub.role,
        },
      });
    });

    expect(
      result.current.usersPaginatedCollectionState.usersPaginatedCollection[0].find(
        (usr) => usr.id.toString() === bannedStub.id.toString()
      )?.role
    ).toEqual("USER");
  });

  it("should correctly set usersPaginatedCollectionState when handleGrandAdminPermissions is called", async () => {
    const { result } = renderHook(() => useUsersPaginatedCollection(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: adminName,
          password: password,
        },
      }),
    });

    expect(result.current.usersPaginatedCollectionState).toEqual(
      usersPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.usersPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleGrantAdminPermissions({
        page: 0,
        user: {
          id: userStub.id.toString(),
          name: userStub.name,
          createdAt: userStub.createdAt,
          updatedAt: userStub.updatedAt,
          role: userStub.role,
        },
      });
    });

    expect(
      result.current.usersPaginatedCollectionState.usersPaginatedCollection[0].find(
        (usr) => usr.id.toString() === userStub.id.toString()
      )?.role
    ).toEqual("ADMIN");
  });

  it("should correctly set usersPaginatedCollectionState when handleUsersPageChange is called", async () => {
    const { result } = renderHook(() => useUsersPaginatedCollection(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    expect(result.current.usersPaginatedCollectionState).toEqual(
      usersPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.usersPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleUsersPageChange({
        nextPage: 0,
      });
    });

    expect(
      result.current.usersPaginatedCollectionState.usersActivePage
    ).toEqual(0);
  });

  it("should correctly set usersPaginatedCollectionState when handleUsersRowsPerPageChange is called", async () => {
    const { result } = renderHook(() => useUsersPaginatedCollection(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    expect(result.current.usersPaginatedCollectionState).toEqual(
      usersPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.usersPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleUsersRowsPerPageChange({
        newUsersPerPage: 1,
      });
    });

    expect(result.current.usersPaginatedCollectionState.usersPerPage).toEqual(
      1
    );
  });
});
