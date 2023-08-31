import { UserDetailsType } from "../api/useUsersAPIFacade";
import { regroupEntities } from "../../utils";

export const usersPaginatedCollectionInitialState: UsersPaginatedCollectionStateType =
  {
    usersPaginatedCollection: [[], [], [], [], []],
    status: "LOADING",
    totalNumberOfAllUsers: 50,
    // usersPerPage: 10,
    // usersActivePage: 0,
  };

export type UsersPaginatedCollectionStateType = {
  usersPaginatedCollection: UserDetailsType[][];
  status: UsersPaginatedCollectionStatusType;
  totalNumberOfAllUsers: number;
  // usersActivePage: number;
  // usersPerPage: number;
};

export type UsersPaginatedCollectionStatusType = "LOADING" | "READY" | "ERROR";

export type UsersPaginatedCollectionActionType =
  | AddUserActionType
  | AddUsersActionType
  | SetUsersStatusActionType
  | SetUsersRowsPerPageActionType
  // | SetActiveUsersPageActionType
  | BanUserActionType
  | UnbanUserActionType
  | GrantAdminPermissionsActionType;

export type AddUserActionType = {
  type: "ADD_USER";
  payload: { user: UserDetailsType; usersPerPage: number };
};

export type AddUsersActionType = {
  type: "ADD_USERS";
  payload: {
    users: UserDetailsType[];
    usersPage: number;
    totalNumberOfAllUsers: number;
    usersPerPage: number;
    usersActivePage: number;
  };
};
export type SetUsersStatusActionType = {
  type: "SET_USERS_STATUS";
  payload: { newUsersStatus: UsersPaginatedCollectionStatusType };
};

// export type SetActiveUsersPageActionType = {
//   type: "SET_ACTIVE_USERS_PAGE";
//   payload: { newActiveUsersPage: number };
// };

export type SetUsersRowsPerPageActionType = {
  type: "SET_USERS_PER_PAGE";
  payload: { prevUsersPerPage: number; newUsersPerPage: number };
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
  let user: UserDetailsType | undefined | null = null;

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
        ].length < action.payload.usersPerPage
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

      usersPaginatedCollectionNewState.usersPaginatedCollection[
        action.payload.usersPage
      ] = action.payload.users;

      const oldTotalNumberOfUsers = state.totalNumberOfAllUsers;
      usersPaginatedCollectionNewState.totalNumberOfAllUsers =
        action.payload.totalNumberOfAllUsers;

      if (
        oldTotalNumberOfUsers !==
        usersPaginatedCollectionNewState.totalNumberOfAllUsers
      ) {
        usersPaginatedCollectionNewState.usersPaginatedCollection =
          regroupEntities<UserDetailsType>({
            currentEntitiesPaginatedCollection:
              usersPaginatedCollectionNewState.usersPaginatedCollection,
            currentPerPage: action.payload.usersPerPage,
            newPerPage: action.payload.usersPerPage,
            newTotalNumberOfAllEntities:
              usersPaginatedCollectionNewState.totalNumberOfAllUsers,
          });
        // if (
        //   usersPaginatedCollectionNewState.usersPaginatedCollection.length - 1 <
        //   usersPaginatedCollectionNewState.usersActivePage
        // ) {
        //   usersPaginatedCollectionNewState.usersActivePage = 0;
        // }
      }

      return { ...usersPaginatedCollectionNewState };

    case "SET_USERS_STATUS":
      // modifies: areRepliesLoading

      usersPaginatedCollectionNewState.status = action.payload.newUsersStatus;
      return { ...usersPaginatedCollectionNewState };

    case "BAN_USER":
      user = usersPaginatedCollectionNewState.usersPaginatedCollection[
        action.payload.userPage
      ].find((rep) => rep.id === action.payload.user.id);

      if (user) {
        user.roles = ["Banned"];
      }

      return { ...usersPaginatedCollectionNewState };

    case "UNBAN_USER":
      user = usersPaginatedCollectionNewState.usersPaginatedCollection[
        action.payload.userPage
      ].find((rep) => rep.id === action.payload.user.id);

      if (user) {
        user.roles = ["User"];
      }

      return { ...usersPaginatedCollectionNewState };

    case "GRANT_ADMIN_PERMISSIONS":
      user = usersPaginatedCollectionNewState.usersPaginatedCollection[
        action.payload.userPage
      ].find((rep) => rep.id === action.payload.user.id);

      if (user) {
        user.roles = ["Admin"];
      }

      return { ...usersPaginatedCollectionNewState };

    // case "SET_ACTIVE_USERS_PAGE":
    //   if (
    //     action.payload.newActiveUsersPage <
    //     usersPaginatedCollectionNewState.usersPaginatedCollection.length
    //   ) {
    //     usersPaginatedCollectionNewState.usersActivePage =
    //       action.payload.newActiveUsersPage;
    //   }

    //   return { ...usersPaginatedCollectionNewState };

    case "SET_USERS_PER_PAGE":
      let prevUsersPerPage = action.payload.prevUsersPerPage;
      let newUsersPerPage = action.payload.newUsersPerPage;

      usersPaginatedCollectionNewState.usersPaginatedCollection =
        regroupEntities<UserDetailsType>({
          currentEntitiesPaginatedCollection:
            usersPaginatedCollectionNewState.usersPaginatedCollection,
          currentPerPage: prevUsersPerPage,
          newPerPage: newUsersPerPage,
          newTotalNumberOfAllEntities:
            usersPaginatedCollectionNewState.totalNumberOfAllUsers,
        });
      // if (
      //   usersPaginatedCollectionNewState.usersPaginatedCollection.length - 1 <
      //   usersPaginatedCollectionNewState.usersActivePage
      // ) {
      //   usersPaginatedCollectionNewState.usersActivePage = 0;
      // }

      return { ...usersPaginatedCollectionNewState };

    default:
      return { ...state };
  }
}
