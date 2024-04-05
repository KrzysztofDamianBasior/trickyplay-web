import { type UserDetailsType } from "../../models/internalAppRepresentation/resources";
import { calculateNumberOfPages, regroupEntities } from "../../utils";

export const usersPaginatedCollectionInitialState: UsersPaginatedCollectionStateType =
  {
    usersPaginatedCollection: [[], [], [], [], []],
    status: "LOADING",
    totalNumberOfAllUsers: 50,
    usersActivePage: 0,
    usersPerPage: 10,
  };

export type UsersPaginatedCollectionStateType = {
  usersPaginatedCollection: UserDetailsType[][];
  status: UsersPaginatedCollectionStatusType;
  totalNumberOfAllUsers: number;
  usersActivePage: number;
  usersPerPage: number;
};

export type UsersPaginatedCollectionStatusType = "LOADING" | "READY" | "ERROR";

export type UsersPaginatedCollectionActionType =
  | AddUserActionType
  | AddUsersActionType
  | SetUsersStatusActionType
  | SetUsersRowsPerPageActionType
  | SetActiveUsersPageActionType
  | BanUserActionType
  | UnbanUserActionType
  | GrantAdminPermissionsActionType;

export type AddUserActionType = {
  type: "ADD_USER";
  payload: {
    user: UserDetailsType;
  };
};

export type AddUsersActionType = {
  type: "ADD_USERS";
  payload: {
    users: UserDetailsType[];
    usersPage: number;
    totalNumberOfAllUsers: number;
  };
};

export type SetUsersStatusActionType = {
  type: "SET_USERS_STATUS";
  payload: { newUsersStatus: UsersPaginatedCollectionStatusType };
};

export type SetActiveUsersPageActionType = {
  type: "SET_ACTIVE_USERS_PAGE";
  payload: { newActiveUsersPage: number };
};

export type SetUsersRowsPerPageActionType = {
  type: "SET_USERS_PER_PAGE";
  payload: {
    newUsersPerPage: number;
  };
};

export type GrantAdminPermissionsActionType = {
  type: "GRANT_ADMIN_PERMISSIONS";
  payload: { user: UserDetailsType; userPage: number };
};

export type BanUserActionType = {
  type: "BAN_USER";
  payload: { user: UserDetailsType; userPage: number };
};

export type UnbanUserActionType = {
  type: "UNBAN_USER";
  payload: { user: UserDetailsType; userPage: number };
};

export function usersPaginatedCollectionReducer(
  state: UsersPaginatedCollectionStateType,
  action: UsersPaginatedCollectionActionType
): UsersPaginatedCollectionStateType {
  let usersPaginatedCollectionNewState: UsersPaginatedCollectionStateType =
    JSON.parse(JSON.stringify(state));

  const currentPaginatedCollectionLength =
    state.usersPaginatedCollection.length;
  const indexOfLastPaginatedCollectionPage =
    currentPaginatedCollectionLength - 1;

  switch (action.type) {
    case "ADD_USER":
      // modifies: usersPaginatedCollection, totalNumberOfAllUsers
      if (
        indexOfLastPaginatedCollectionPage >= 0 &&
        usersPaginatedCollectionNewState.usersPaginatedCollection[
          indexOfLastPaginatedCollectionPage
        ].length < usersPaginatedCollectionNewState.usersPerPage
      ) {
        usersPaginatedCollectionNewState.usersPaginatedCollection[
          indexOfLastPaginatedCollectionPage
        ].push(action.payload.user);
      } else {
        usersPaginatedCollectionNewState.usersPaginatedCollection.push([
          action.payload.user,
        ]);
      }

      usersPaginatedCollectionNewState.totalNumberOfAllUsers += 1;
      return { ...usersPaginatedCollectionNewState };

    case "ADD_USERS":
      // modifies: usersPaginatedCollection, totalNumberOfAllUsers, usersCurrentPage

      if (
        action.payload.usersPage <
        usersPaginatedCollectionNewState.usersPaginatedCollection.length
      ) {
        usersPaginatedCollectionNewState.usersPaginatedCollection[
          action.payload.usersPage
        ] = action.payload.users;

        usersPaginatedCollectionNewState.totalNumberOfAllUsers =
          action.payload.totalNumberOfAllUsers;

        if (
          state.usersActivePage <
          calculateNumberOfPages({
            perPage: state.usersActivePage,
            totalNumberOfEntities: action.payload.totalNumberOfAllUsers,
          })
        ) {
          usersPaginatedCollectionNewState.usersPaginatedCollection =
            regroupEntities<UserDetailsType>({
              currentEntitiesPaginatedCollection:
                usersPaginatedCollectionNewState.usersPaginatedCollection,
              currentPerPage: usersPaginatedCollectionNewState.usersPerPage,
              newPerPage: usersPaginatedCollectionNewState.usersPerPage,
              newTotalNumberOfAllEntities:
                usersPaginatedCollectionNewState.totalNumberOfAllUsers,
            });
        } else {
          usersPaginatedCollectionNewState.usersActivePage = 0;
          usersPaginatedCollectionNewState.usersPaginatedCollection =
            regroupEntities<UserDetailsType>({
              currentEntitiesPaginatedCollection:
                usersPaginatedCollectionNewState.usersPaginatedCollection,
              currentPerPage: usersPaginatedCollectionNewState.usersPerPage,
              newPerPage: usersPaginatedCollectionNewState.usersPerPage,
              newTotalNumberOfAllEntities:
                usersPaginatedCollectionNewState.totalNumberOfAllUsers,
            });
        }
      }

      return { ...usersPaginatedCollectionNewState };

    case "SET_USERS_STATUS":
      // modifies: areRepliesLoading
      usersPaginatedCollectionNewState.status = action.payload.newUsersStatus;
      return { ...usersPaginatedCollectionNewState };

    case "BAN_USER":
      if (
        action.payload.userPage <
        usersPaginatedCollectionNewState.usersPaginatedCollection.length
      ) {
        const indexOfUserToUpdate =
          usersPaginatedCollectionNewState.usersPaginatedCollection[
            action.payload.userPage
          ].findIndex((usr) => usr.id === action.payload.user.id);

        if (indexOfUserToUpdate >= 0) {
          usersPaginatedCollectionNewState.usersPaginatedCollection[
            action.payload.userPage
          ][indexOfUserToUpdate].role = "BANNED";
        }
      }

      return { ...usersPaginatedCollectionNewState };

    case "UNBAN_USER":
      if (
        action.payload.userPage <
        usersPaginatedCollectionNewState.usersPaginatedCollection.length
      ) {
        const indexOfUserToUpdate =
          usersPaginatedCollectionNewState.usersPaginatedCollection[
            action.payload.userPage
          ].findIndex((usr) => usr.id === action.payload.user.id);

        if (indexOfUserToUpdate >= 0) {
          usersPaginatedCollectionNewState.usersPaginatedCollection[
            action.payload.userPage
          ][indexOfUserToUpdate].role = "USER";
        }
      }

      return { ...usersPaginatedCollectionNewState };

    case "GRANT_ADMIN_PERMISSIONS":
      if (
        action.payload.userPage <
        usersPaginatedCollectionNewState.usersPaginatedCollection.length
      ) {
        const indexOfUserToUpdate =
          usersPaginatedCollectionNewState.usersPaginatedCollection[
            action.payload.userPage
          ].findIndex((usr) => usr.id === action.payload.user.id);

        if (indexOfUserToUpdate >= 0) {
          usersPaginatedCollectionNewState.usersPaginatedCollection[
            action.payload.userPage
          ][indexOfUserToUpdate].role = "ADMIN";
        }
      }

      return { ...usersPaginatedCollectionNewState };

    case "SET_ACTIVE_USERS_PAGE":
      if (
        action.payload.newActiveUsersPage <
        usersPaginatedCollectionNewState.usersPaginatedCollection.length
      ) {
        usersPaginatedCollectionNewState.usersActivePage =
          action.payload.newActiveUsersPage;
      }

      return { ...usersPaginatedCollectionNewState };

    case "SET_USERS_PER_PAGE":
      // let prevUsersPerPage = action.payload.prevUsersPerPage;
      usersPaginatedCollectionNewState.usersPaginatedCollection =
        regroupEntities<UserDetailsType>({
          currentEntitiesPaginatedCollection:
            usersPaginatedCollectionNewState.usersPaginatedCollection,
          // currentPerPage: prevUsersPerPage,
          currentPerPage: state.usersPerPage,
          newPerPage: action.payload.newUsersPerPage,
          newTotalNumberOfAllEntities: state.totalNumberOfAllUsers,
        });

      usersPaginatedCollectionNewState.usersPerPage =
        action.payload.newUsersPerPage;

      if (
        usersPaginatedCollectionNewState.usersPaginatedCollection.length - 1 <
        usersPaginatedCollectionNewState.usersActivePage
      ) {
        usersPaginatedCollectionNewState.usersActivePage = 0;
      }

      return { ...usersPaginatedCollectionNewState };

    default:
      return { ...state };
  }
}
