import { useContext, useEffect, useReducer, useRef, useState } from "react";

import useUsersAPIFacade, { UserDetailsType } from "../api/useUsersAPIFacade";
import {
  usersPaginatedCollectionReducer,
  usersPaginatedCollectionInitialState,
  UsersPaginatedCollectionStateType,
} from "./usersPaginatedCollectionReducer";
import { AccountContext } from "../account/AccountContext";
import { calculateNumberOfPages } from "../../utils";
import { NotificationContext } from "../snackbars/NotificationsContext";

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

    const [usersActivePage, setUsersActivePage] = useState<number>(0);
    const [usersPerPage, setUsersPerPage] = useState<number>(10);

    const {
      banUser,
      getUser,
      getUserComments,
      getUserReplies,
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

        const getUsersResultType = await getUsers({
          page: usersActivePage,
          perPage: usersPerPage,
        });

        if (getUsersResultType.totalNumberOfUsers && getUsersResultType.users) {
          setUsersActivePage(0);
          usersPaginatedCollectionDispatch({
            type: "ADD_USERS",
            payload: {
              usersActivePage: 0,
              usersPerPage,
              users: getUsersResultType.users,
              usersPage: 0,
              totalNumberOfAllUsers: getUsersResultType.totalNumberOfUsers,
            },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
          openSnackbar({
            severity: "success",
            title: "successfully fetch users",
            body: "users section successfully populated",
          });
        } else {
          ///////////////// notify user of an error
          openSnackbar({
            severity: "error",
            title: "failed to fetch users",
            body: "failed to populate users section",
          });
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
          // const currentUsersPage =
          //   usersPaginatedCollectionState.usersActivePage;

          const usersPaginatedCollectionLength =
            usersPaginatedCollectionState.usersPaginatedCollection.length;

          // const usersPerPage = usersPaginatedCollectionState.usersPerPage;

          if (
            usersActivePage < usersPaginatedCollectionLength - 1 &&
            usersPaginatedCollectionState.usersPaginatedCollection[
              usersActivePage
            ].length < usersPerPage
          ) {
            usersPaginatedCollectionDispatch({
              type: "SET_USERS_STATUS",
              payload: { newUsersStatus: "LOADING" },
            });

            const getUsersResult = await getUsers({
              page: usersActivePage,
              perPage: usersPerPage,
            });
            if (
              getUsersResult.users !== null &&
              getUsersResult.totalNumberOfUsers !== null
            ) {
              if (
                usersActivePage <
                calculateNumberOfPages({
                  perPage: usersActivePage,
                  totalNumberOfEntities: getUsersResult.totalNumberOfUsers,
                })
              ) {
                usersPaginatedCollectionDispatch({
                  type: "ADD_USERS",
                  payload: {
                    usersActivePage,
                    usersPerPage,
                    users: getUsersResult.users,
                    usersPage: usersActivePage,
                    totalNumberOfAllUsers: getUsersResult.totalNumberOfUsers,
                  },
                });
                openSnackbar({
                  severity: "success",
                  title: "successfully fetch users",
                  body: "users section successfully populated",
                });
              } else {
                setUsersActivePage(0);
                // usersPaginatedCollectionDispatch({
                //   type: "SET_ACTIVE_USERS_PAGE",
                //   payload: { newActiveUsersPage: 0 },
                // });
                openSnackbar({
                  severity: "info",
                  title:
                    "the active users page exceeds the total number of users",
                  body: "page 0 is set",
                });
              }
              usersPaginatedCollectionDispatch({
                type: "SET_USERS_STATUS",
                payload: { newUsersStatus: "READY" },
              });
            } else {
              ///////////////// notify user of an error
              openSnackbar({
                severity: "error",
                title: "failed to fetch users",
                body: "failed to populate users section",
              });
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
    }, [usersActivePage, usersPerPage]);

    const refreshActivePage = async () => {
      usersPaginatedCollectionDispatch({
        type: "SET_USERS_STATUS",
        payload: { newUsersStatus: "LOADING" },
      });

      const getUsersResult = await getUsers({
        page: usersActivePage,
        perPage: usersPerPage,
      });
      if (
        getUsersResult.users !== null &&
        getUsersResult.totalNumberOfUsers !== null
      ) {
        if (
          usersActivePage <
          calculateNumberOfPages({
            perPage: usersPerPage,
            totalNumberOfEntities: getUsersResult.totalNumberOfUsers,
          })
        ) {
          usersPaginatedCollectionDispatch({
            type: "ADD_USERS",
            payload: {
              usersActivePage,
              usersPerPage,
              users: getUsersResult.users,
              usersPage: usersActivePage,
              totalNumberOfAllUsers: getUsersResult.totalNumberOfUsers,
            },
          });
          openSnackbar({
            severity: "success",
            title: "successfully fetch users",
            body: "users section successfully populated",
          });
        } else {
          setUsersActivePage(0);
          // commentsPaginatedCollectionDispatch({
          //   type: "SET_ACTIVE_COMMENTS_PAGE",
          //   payload: { newActiveCommentsPage: 0 },
          // });
          openSnackbar({
            severity: "info",
            title: "the active users page exceeds the total number of users",
            body: "page 0 is set",
          });
        }
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "READY" },
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: "failed to fetch users",
          body: "failed to populate users section",
        });
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
        setUsersActivePage(nextPage);
        // usersPaginatedCollectionDispatch({
        //   type: "SET_ACTIVE_USERS_PAGE",
        //   payload: { newActiveUsersPage: nextPage },
        // });
        openSnackbar({
          severity: "success",
          title: "the active users page has changed",
          body: `successfully changed active users page to page: ${nextPage}`,
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: `failed to change the active users page to page: ${nextPage}`,
          body: "new users page exceeds the total number of users",
        });
      }
    };

    const handleUsersRowsPerPageChange = async ({
      newUsersPerPage,
    }: {
      newUsersPerPage: number;
    }) => {
      const prevUsersPerPage = usersPerPage;
      if (
        usersActivePage <
        calculateNumberOfPages({
          perPage: newUsersPerPage,
          totalNumberOfEntities:
            usersPaginatedCollectionState.totalNumberOfAllUsers,
        })
      ) {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_PER_PAGE",
          payload: {
            prevUsersPerPage,
            newUsersPerPage,
          },
        });
        setUsersPerPage(newUsersPerPage);
        openSnackbar({
          severity: "success",
          title: "the number of users per page has changed",
          body: `the number of users per page has changed to ${usersPerPage} users per page`,
        });
      } else {
        setUsersActivePage(0);
        // commentsPaginatedCollectionDispatch({
        //   type: "SET_ACTIVE_COMMENTS_PAGE",
        //   payload: { newActiveCommentsPage: 0 },
        // });
        openSnackbar({
          severity: "info",
          title: "the active users page exceeds the total number of users",
          body: "page 0 is set",
        });
      }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleUserBan = async ({
      user,
      page,
    }: {
      user: UserDetailsType;
      page: number;
    }) => {
      if (authState.user && authState.user.roles.includes("Admin")) {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });

        const banUserResult = await banUser({ id: user.id });

        if (banUserResult.user && banUserResult.status === 200) {
          usersPaginatedCollectionDispatch({
            type: "BAN_USER",
            payload: { user: banUserResult.user, userPage: page },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
          openSnackbar({
            severity: "success",
            title: "user banned",
            body: `successfully banned user with id: ${banUserResult.user.id}`,
          });
        } else {
          ///////////////// notify user of an error
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
          openSnackbar({
            severity: "error",
            title: `user not banned`,
            body: `could not ban user with id: ${user.id}`,
          });
        }
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `user not banned`,
          body: `could not ban user with id: ${user.id}, lack of sufficient permissions`,
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
      if (authState.user && authState.user.roles.includes("Admin")) {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });

        const grantAdminPermissionsResult = await grantAdminPermissions({
          id: user.id,
        });

        if (
          grantAdminPermissionsResult.user &&
          grantAdminPermissionsResult.status === 200
        ) {
          usersPaginatedCollectionDispatch({
            type: "GRANT_ADMIN_PERMISSIONS",
            payload: { user: grantAdminPermissionsResult.user, userPage: page },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
          openSnackbar({
            severity: "success",
            title: "admin permissions granted",
            body: `successfully granted admin permissions to user with id: ${grantAdminPermissionsResult.user.id}`,
          });
        } else {
          ///////////////// notify user of an error
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
          openSnackbar({
            severity: "error",
            title: `admin permissions not granted`,
            body: `could not grant admin permissions to user with id: ${user.id}`,
          });
        }
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `admin permissions not granted`,
          body: `could not grant admin permissions to user with id: ${user.id}, lack of sufficient permissions`,
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
      if (authState.user && authState.user.roles.includes("Admin")) {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "LOADING" },
        });

        const unbanUserResult = await unbanUser({ id: user.id });

        if (unbanUserResult.user && unbanUserResult.status === 200) {
          usersPaginatedCollectionDispatch({
            type: "UNBAN_USER",
            payload: { user: unbanUserResult.user, userPage: page },
          });
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "READY" },
          });
          openSnackbar({
            severity: "success",
            title: "user unbanned",
            body: `successfully unbanned user with id: ${unbanUserResult.user.id}`,
          });
        } else {
          ///////////////// notify user of an error
          usersPaginatedCollectionDispatch({
            type: "SET_USERS_STATUS",
            payload: { newUsersStatus: "ERROR" },
          });
          openSnackbar({
            severity: "error",
            title: `user not unbanned`,
            body: `could not unban user with id: ${user.id}`,
          });
        }
      } else {
        usersPaginatedCollectionDispatch({
          type: "SET_USERS_STATUS",
          payload: { newUsersStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `user not unbanned`,
          body: `could not unban user with id: ${user.id}, lack of sufficient permissions`,
        });
      }
    };

    return {
      usersPaginatedCollectionState,
      usersActivePage,
      usersPerPage,
      handleGrantAdminPermissions,
      handleUserBan,
      handleUsersPageChange,
      handleUsersRowsPerPageChange,
      handleUserUnban,
      refreshActivePage,
    };
  };

export default useUsersPaginatedCollection;

export type UseUsersPaginatedCollectionResultType = {
  usersPaginatedCollectionState: UsersPaginatedCollectionStateType;
  usersPerPage: number;
  usersActivePage: number;
  handleGrantAdminPermissions: HandleGrantAdminPermissionsType;
  handleUserBan: HandleUserBanType;
  handleUserUnban: HandleUserUnbanType;
  handleUsersPageChange: HandleUsersPageChangeType;
  handleUsersRowsPerPageChange: HandleUsersRowsPerPageChangeType;
  refreshActivePage: () => void;
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
