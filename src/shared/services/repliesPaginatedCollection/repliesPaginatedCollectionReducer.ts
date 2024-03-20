import { type ReplyDetailsType } from "../../models/internalAppRepresentation/resources";
import { calculateNumberOfPages, regroupEntities } from "../../utils";

export const repliesPaginatedCollectionInitialState: RepliesPaginatedCollectionStateType =
  {
    textAlignment: "left",
    repliesPaginatedCollection: [[], [], [], [], []],
    status: "LOADING",
    totalNumberOfAllReplies: 50,
    activeReply: null,
    repliesActivePage: 0,
    repliesPerPage: 10,
  };

export type RepliesPaginatedCollectionStateType = {
  textAlignment: TextAlignentType;
  repliesPaginatedCollection: ReplyDetailsType[][];
  status: RepliesPaginatedCollectionStatusType;
  totalNumberOfAllReplies: number;
  activeReply: ActiveReplyDetailsType;
  repliesActivePage: number;
  repliesPerPage: number;
};

export type ActiveReplyDetailsType = {
  type: ActiveReplyActionType;
  replyId: string;
} | null;

export type ActiveReplyActionType = "Editing";

export type TextAlignentType = "center" | "left" | "right" | "justify";

export type RepliesPaginatedCollectionStatusType =
  | "LOADING"
  | "READY"
  | "ERROR";

export type RepliesPaginatedCollectionActionType =
  | AddReplyActionType
  | AddRepliesActionType
  | DeleteReplyActionType
  | UpdateReplyActionType
  | SetTextAlignmentActionType
  | SetActiveReplyActionType
  | SetRepliesStatusActionType
  | SetActiveRepliesPageActionType
  | SetRepliesRowsPerPageActionType;

export type AddReplyActionType = {
  type: "ADD_REPLY";
  payload: {
    reply: ReplyDetailsType;
    // repliesPerPage: number;
  };
};

export type AddRepliesActionType = {
  type: "ADD_REPLIES";
  payload: {
    replies: ReplyDetailsType[];
    repliesPage: number; //where to add replies
    totalNumberOfAllReplies: number;
    // repliesPerPage: number;
    // repliesActivePage: number;
  };
};

export type DeleteReplyActionType = {
  type: "DELETE_REPLY";
  payload: { replyId: string; replyPage: number };
};

export type UpdateReplyActionType = {
  type: "UPDATE_REPLY";
  payload: { reply: ReplyDetailsType; replyPage: number };
};

export type SetTextAlignmentActionType = {
  type: "SET_TEXT_ALIGNMENT";
  payload: { textAlignment: TextAlignentType };
};

export type SetActiveReplyActionType = {
  type: "SET_ACTIVE_REPLY";
  payload: { replyId: string; type: "Editing" } | null;
};
export type SetRepliesStatusActionType = {
  type: "SET_REPLIES_STATUS";
  payload: { newRepliesStatus: RepliesPaginatedCollectionStatusType };
};

export type SetActiveRepliesPageActionType = {
  type: "SET_ACTIVE_REPLIES_PAGE";
  payload: { newActiveRepliesPage: number };
};

export type SetRepliesRowsPerPageActionType = {
  type: "SET_REPLIES_PER_PAGE";
  payload: { prevRepliesPerPage: number; newRepliesPerPage: number };
};

export function repliesPaginatedCollectionReducer(
  state: RepliesPaginatedCollectionStateType,
  action: RepliesPaginatedCollectionActionType
): RepliesPaginatedCollectionStateType {
  let repliesPaginatedCollectionNewState: RepliesPaginatedCollectionStateType =
    JSON.parse(JSON.stringify(state));
  let reply: ReplyDetailsType | undefined | null = null;

  const currentPaginatedCollectionLength =
    state.repliesPaginatedCollection.length;
  const indexOfLastPaginatedCollectionPage =
    currentPaginatedCollectionLength - 1;

  switch (action.type) {
    case "ADD_REPLY":
      // modifies: repliesPaginatedCollection, totalNumberOfAllReplies

      if (
        indexOfLastPaginatedCollectionPage >= 0 &&
        repliesPaginatedCollectionNewState.repliesPaginatedCollection[
          indexOfLastPaginatedCollectionPage
        ].length < repliesPaginatedCollectionNewState.repliesPerPage
      ) {
        repliesPaginatedCollectionNewState.repliesPaginatedCollection[
          indexOfLastPaginatedCollectionPage
        ].push(action.payload.reply);
      } else {
        repliesPaginatedCollectionNewState.repliesPaginatedCollection.push([
          action.payload.reply,
        ]);
      }

      repliesPaginatedCollectionNewState.totalNumberOfAllReplies += 1;
      return { ...repliesPaginatedCollectionNewState };

    case "DELETE_REPLY":
      // modifies: repliesPaginatedCollection, totalNumberOfAllReplies

      const indexToDelete =
        repliesPaginatedCollectionNewState.repliesPaginatedCollection[
          action.payload.replyPage
        ].findIndex((el) => el.id === action.payload.replyId);

      if (indexToDelete >= 0) {
        repliesPaginatedCollectionNewState.repliesPaginatedCollection[
          action.payload.replyPage
        ].splice(indexToDelete, 1);
        repliesPaginatedCollectionNewState.totalNumberOfAllReplies -= 1;
      }

      return { ...repliesPaginatedCollectionNewState };

    case "ADD_REPLIES":
      // modifies: repliesPaginatedCollection, totalNumberOfAllReplies, repliesCurrentPage

      repliesPaginatedCollectionNewState.repliesPaginatedCollection[
        action.payload.repliesPage
      ] = action.payload.replies;

      const oldTotalNumberOfReplies = state.totalNumberOfAllReplies;
      repliesPaginatedCollectionNewState.totalNumberOfAllReplies =
        action.payload.totalNumberOfAllReplies;

      if (
        oldTotalNumberOfReplies !==
        repliesPaginatedCollectionNewState.totalNumberOfAllReplies
      ) {
        if (
          state.repliesActivePage <
          calculateNumberOfPages({
            perPage: state.repliesActivePage,
            totalNumberOfEntities: action.payload.totalNumberOfAllReplies,
          })
        ) {
          repliesPaginatedCollectionNewState.repliesPaginatedCollection =
            regroupEntities<ReplyDetailsType>({
              currentEntitiesPaginatedCollection:
                repliesPaginatedCollectionNewState.repliesPaginatedCollection,
              currentPerPage: repliesPaginatedCollectionNewState.repliesPerPage,
              newPerPage: repliesPaginatedCollectionNewState.repliesPerPage,
              newTotalNumberOfAllEntities:
                repliesPaginatedCollectionNewState.totalNumberOfAllReplies,
            });
        } else {
          repliesPaginatedCollectionNewState.repliesActivePage = 0;
          repliesPaginatedCollectionNewState.repliesPaginatedCollection =
            regroupEntities<ReplyDetailsType>({
              currentEntitiesPaginatedCollection:
                repliesPaginatedCollectionNewState.repliesPaginatedCollection,
              currentPerPage: repliesPaginatedCollectionNewState.repliesPerPage,
              newPerPage: repliesPaginatedCollectionNewState.repliesPerPage,
              newTotalNumberOfAllEntities:
                repliesPaginatedCollectionNewState.totalNumberOfAllReplies,
            });
        }
      }

      return { ...repliesPaginatedCollectionNewState };

    case "SET_ACTIVE_REPLY":
      // modifies: repliesPaginatedCollection, totalNumberOfAllReplies

      if (action.payload) {
        repliesPaginatedCollectionNewState.activeReply = {
          replyId: action.payload.replyId,
          type: "Editing",
        };
      } else {
        repliesPaginatedCollectionNewState.activeReply = null;
      }

      return { ...repliesPaginatedCollectionNewState };

    case "SET_REPLIES_STATUS":
      repliesPaginatedCollectionNewState.status =
        action.payload.newRepliesStatus;
      return { ...repliesPaginatedCollectionNewState };

    case "UPDATE_REPLY":
      reply = repliesPaginatedCollectionNewState.repliesPaginatedCollection[
        action.payload.replyPage
      ].find((rep) => rep.id === action.payload.reply.id);

      if (reply) {
        reply = action.payload.reply;
      }

      return { ...repliesPaginatedCollectionNewState };

    case "SET_ACTIVE_REPLIES_PAGE":
      if (
        action.payload.newActiveRepliesPage <
        repliesPaginatedCollectionNewState.repliesPaginatedCollection.length
      ) {
        repliesPaginatedCollectionNewState.repliesActivePage =
          action.payload.newActiveRepliesPage;
      }

      return { ...repliesPaginatedCollectionNewState };

    case "SET_TEXT_ALIGNMENT":
      repliesPaginatedCollectionNewState.textAlignment =
        action.payload.textAlignment;
      return { ...repliesPaginatedCollectionNewState };

    case "SET_REPLIES_PER_PAGE":
      let prevRepliesPerPage = action.payload.prevRepliesPerPage;
      repliesPaginatedCollectionNewState.repliesPerPage =
        action.payload.newRepliesPerPage;

      repliesPaginatedCollectionNewState.repliesPaginatedCollection =
        regroupEntities<ReplyDetailsType>({
          currentEntitiesPaginatedCollection:
            repliesPaginatedCollectionNewState.repliesPaginatedCollection,
          currentPerPage: prevRepliesPerPage,
          newPerPage: repliesPaginatedCollectionNewState.repliesPerPage,
          newTotalNumberOfAllEntities:
            repliesPaginatedCollectionNewState.totalNumberOfAllReplies,
        });

      if (
        repliesPaginatedCollectionNewState.repliesPaginatedCollection.length -
          1 <
        repliesPaginatedCollectionNewState.repliesActivePage
      ) {
        repliesPaginatedCollectionNewState.repliesActivePage = 0;
      }

      return { ...repliesPaginatedCollectionNewState };

    default:
      return { ...state };
  }
}
