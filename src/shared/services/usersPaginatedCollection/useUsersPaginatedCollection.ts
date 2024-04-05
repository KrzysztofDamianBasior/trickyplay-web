import { useContext, useEffect, useReducer, useRef } from "react";

import useUsersAPIFacade, {
  type GetUsersResultType,
} from "../api/useUsersAPIFacade";
import {
  usersPaginatedCollectionReducer,
  usersPaginatedCollectionInitialState,
  type UsersPaginatedCollectionStateType,
} from "./usersPaginatedCollectionReducer";
import { AccountContext, type AuthStateType } from "../account/AccountContext";
import { NotificationContext } from "../snackbars/NotificationsContext";
import { calculateNumberOfPages } from "../../utils";
import { type UserDetailsType } from "../../models/internalAppRepresentation/resources";

export type UseUsersPaginatedCollectionResultType = {
  usersPaginatedCollectionState: UsersPaginatedCollectionStateType;
  handleGrantAdminPermissions: HandleGrantAdminPermissionsType;
  handleUserBan: HandleUserBanType;
  handleUserUnban: HandleUserUnbanType;
  handleUsersPageChange: HandleUsersPageChangeType;
  handleUsersRowsPerPageChange: HandleUsersRowsPerPageChangeType;
  refreshActivePage: () => void;
  authState: AuthStateType;
};

export type HandleGrantAdminPermissionsType = ({
  user,
  page,
}: {
  user: UserDetailsType;
  page: number;
}) => Promise<void>;

export type HandleUserBanType = ({
  user,
  page,
}: {
  user: UserDetailsType;
  page: number;
}) => Promise<void>;

export type HandleUserUnbanType = ({
  user,
  page,
}: {
  user: UserDetailsType;
  page: number;
}) => Promise<void>;

export type HandleUsersPageChangeType = ({
  nextPage,
}: {
  nextPage: number;
}) => Promise<void>;

export type HandleUsersRowsPerPageChangeType = ({
  newUsersPerPage,
}: {
  newUsersPerPage: number;
}) => Promise<void>;

const useUsersPaginatedCollection =
  (): UseUsersPaginatedCollectionResultType => {
    const { authState } = useContext(AccountContext);
    const { openSnackbar } = useContext(NotificationContext);

    const isMounted = useRef(false);

    const [usersPaginatedCollectionState, usersPaginatedCollectionDispatch] =
      useReducer(
        usersPaginatedCollectionReducer,
        usersPaginatedCollectionInitialState
      );

    const {
      banUser,
      // getUser,
      // getUserComments,
      // getUserReplies,
      getUsers,
      grantAdminPermissions,
      unbanUser,
    } = useUsersAPIFacade();

    useEffect(() => {
      const fetchUsers = async () => {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });
        const getUsersResult: Awaited<GetUsersResultType> = await getUsers({
          pageNumber: usersPaginatedCollectionState.usersActivePage,
          pageSize: usersPaginatedCollectionState.usersPerPage,
          orderDirection: "Asc",
          sortBy: "id",
        });
        if (
          getUsersResult.status >= 200 &&
          getUsersResult.status < 300 &&
          getUsersResult.users !== null
        ) {
          usersPaginatedCollectionDispatch({
            type: "ADD_USERS",
            payload: {
              users: getUsersResult.users,
              usersPage: usersPaginatedCollectionState.usersActivePage,
              totalNumberOfAllUsers: getUsersResult.totalElements,
            },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
        } else {
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
        }
      };

      fetchUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (isMounted.current) {
        (async () => {
          const usersPaginatedCollectionLength =
            usersPaginatedCollectionState.usersPaginatedCollection.length;
          if (
            usersPaginatedCollectionState.usersActivePage ===
              usersPaginatedCollectionLength - 1 ||
            (usersPaginatedCollectionState.usersActivePage <
              usersPaginatedCollectionLength - 1 &&
              usersPaginatedCollectionState.usersPaginatedCollection[
                usersPaginatedCollectionState.usersActivePage
              ].length < usersPaginatedCollectionState.usersPerPage)
          ) {
            usersPaginatedCollectionDispatch({
              type: "SET_USERS_STATUS",
              payload: { newUsersStatus: "LOADING" },
            });
            const getUsersResult: Awaited<GetUsersResultType> = await getUsers({
              pageNumber: usersPaginatedCollectionState.usersActivePage,
              pageSize: usersPaginatedCollectionState.usersPerPage,
              orderDirection: "Asc",
              sortBy: "id",
            });
            if (
              getUsersResult.status >= 200 &&
              getUsersResult.status < 300 &&
              getUsersResult.users !== null
            ) {
              if (
                usersPaginatedCollectionState.usersActivePage <
                calculateNumberOfPages({
                  perPage: usersPaginatedCollectionState.usersActivePage,
                  totalNumberOfEntities: getUsersResult.totalElements,
                })
              ) {
                usersPaginatedCollectionDispatch({
                  type: "ADD_USERS",
                  payload: {
                    users: getUsersResult.users,
                    usersPage: usersPaginatedCollectionState.usersActivePage,
                    totalNumberOfAllUsers: getUsersResult.totalElements,
                  },
                });
              } else {
                usersPaginatedCollectionDispatch({
                  type: "SET_ACTIVE_USERS_PAGE",
                  payload: { newActiveUsersPage: 0 },
                });
                openSnackbar({
                  severity: "info",
                  title:
                    "The active users page exceeds the total number of users",
                  body: "Page 1 is set",
                });
              }
              usersPaginatedCollectionDispatch({
                type: "SET_USERS_STATUS",
                payload: { newUsersStatus: "READY" },
              });
            } else {
              ///////////////// notify user of an error
              usersPaginatedCollectionDispatch({
                type: "SET_USERS_STATUS",
                payload: { newUsersStatus: "ERROR" },
              });
            }
          }
        })();
      } else {
        isMounted.current = true;
      }
      //   return () => {
      //     // this now gets called when the component unmounts
      //   };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      usersPaginatedCollectionState.usersActivePage,
      usersPaginatedCollectionState.usersPerPage,
    ]);

    const refreshActivePage = async () => {
      usersPaginatedCollectionDispatch({
        type: "SET_USERS_STATUS",
        payload: { newUsersStatus: "LOADING" },
      });
      const getUsersResult: Awaited<GetUsersResultType> = await getUsers({
        pageNumber: usersPaginatedCollectionState.usersActivePage,
        pageSize: usersPaginatedCollectionState.usersPerPage,
        orderDirection: "Asc",
        sortBy: "id",
      });
      if (
        getUsersResult.status >= 200 &&
        getUsersResult.status < 300 &&
        getUsersResult.users !== null
      ) {
        if (
          usersPaginatedCollectionState.usersActivePage <
          calculateNumberOfPages({
            perPage: usersPaginatedCollectionState.usersPerPage,
            totalNumberOfEntities: getUsersResult.totalElements,
          })
        ) {
          usersPaginatedCollectionDispatch({
            type: "ADD_USERS",
            payload: {
              users: getUsersResult.users,
              usersPage: usersPaginatedCollectionState.usersActivePage,
              totalNumberOfAllUsers: getUsersResult.totalElements,
            },
          });
        } else {
          usersPaginatedCollectionDispatch({
            type: "SET_ACTIVE_USERS_PAGE",
            payload: { newActiveUsersPage: 0 },
          });
          openSnackbar({
            severity: "info",
            title: "The active users page exceeds the total number of users",
            body: "Page 1 is set",
          });
        }
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "READY" },
        });
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
      }
    };

    const handleUsersPageChange = async ({
      nextPage,
    }: {
      nextPage: number;
    }) => {
      if (
        nextPage < usersPaginatedCollectionState.usersPaginatedCollection.length
      ) {
        usersPaginatedCollectionDispatch({
          type: "SET_ACTIVE_USERS_PAGE",
          payload: { newActiveUsersPage: nextPage },
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: `Failed to change the active users page to page: ${
            nextPage + 1
          }`,
          body: "Requested users page exceeded the total number of users",
        });
      }
    };

    const handleUsersRowsPerPageChange = async ({
      newUsersPerPage,
    }: {
      newUsersPerPage: number;
    }) => {
      usersPaginatedCollectionDispatch({
        type: "SET_USERS_PER_PAGE",
        payload: {
          newUsersPerPage,
        },
      });
    };

    const handleUserBan = async ({
      user,
      page,
    }: {
      user: UserDetailsType;
      page: number;
    }) => {
      if (authState.user && authState.user.role === "ADMIN") {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });
        const banUserResult = await banUser({ id: user.id });
        if (
          banUserResult.status >= 200 &&
          banUserResult.status < 300 &&
          banUserResult.user !== null
        ) {
          usersPaginatedCollectionDispatch({
            type: "BAN_USER",
            payload: { user: banUserResult.user, userPage: page },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
        } else {
          ///////////////// notify user of an error
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
        }
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `Lack of sufficient permissions`,
          body: `Could not ban user with id: ${user.id}, no changes were applied`,
        });
      }
    };

    const handleGrantAdminPermissions = async ({
      user,
      page,
    }: {
      user: UserDetailsType;
      page: number;
    }) => {
      if (authState.user && authState.user.role === "ADMIN") {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });
        const grantAdminPermissionsResult = await grantAdminPermissions({
          id: user.id,
        });
        if (
          grantAdminPermissionsResult.status >= 200 &&
          grantAdminPermissionsResult.status < 300 &&
          grantAdminPermissionsResult.user !== null
        ) {
          usersPaginatedCollectionDispatch({
            type: "GRANT_ADMIN_PERMISSIONS",
            payload: { user: grantAdminPermissionsResult.user, userPage: page },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
        } else {
          ///////////////// notify user of an error
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
        }
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `Lack of sufficient permissions`,
          body: `Could not grant admin permissions to user with id: ${user.id}, no changes were applied`,
        });
      }
    };

    const handleUserUnban = async ({
      user,
      page,
    }: {
      user: UserDetailsType;
      page: number;
    }) => {
      if (authState.user && authState.user.role === "ADMIN") {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });
        const unbanUserResult = await unbanUser({ id: user.id });
        if (
          unbanUserResult.status >= 200 &&
          unbanUserResult.status < 300 &&
          unbanUserResult.user !== null
        ) {
          usersPaginatedCollectionDispatch({
            type: "UNBAN_USER",
            payload: { user: unbanUserResult.user, userPage: page },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
        } else {
          ///////////////// notify user of an error
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
        }
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `Lack of sufficient permissions`,
          body: `Could not unban user with id: ${user.id}, no changes were applied`,
        });
      }
    };

    return {
      usersPaginatedCollectionState,
      handleGrantAdminPermissions,
      handleUserBan,
      handleUsersPageChange,
      handleUsersRowsPerPageChange,
      handleUserUnban,
      refreshActivePage,
      authState,
    };
  };

export default useUsersPaginatedCollection;
