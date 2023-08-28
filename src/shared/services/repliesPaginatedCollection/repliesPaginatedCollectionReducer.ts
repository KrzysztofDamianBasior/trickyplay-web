import { ReplyDetailsType } from "../api/useRepliesAPIFacade";
import { regroupEntities } from "../../utils";

export const repliesPaginatedCollectionInitialState: RepliesPaginatedCollectionStateType =
  {
    textAlignment: "left",
    repliesActivePage: 0,
    repliesPaginatedCollection: [[], [], [], [], []],
    status: "LOADING",
    repliesPerPage: 10,
    totalNumberOfAllReplies: 50,
    activeReply: null,
  };

export type RepliesPaginatedCollectionStateType = {
  textAlignment: TextAlignentType;
  repliesPaginatedCollection: ReplyDetailsType[][];
  status: RepliesPaginatedCollectionStatusType;
  repliesActivePage: number;
  repliesPerPage: number;
  totalNumberOfAllReplies: number;
  activeReply: ActiveReplyDetailsType;
};

export type ActiveReplyDetailsType = {
  type: "Editing";
  replyId: string;
} | null;

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
  payload: { reply: ReplyDetailsType };
};

export type AddRepliesActionType = {
  type: "ADD_REPLIES";
  payload: {
    replies: ReplyDetailsType[];
    repliesPage: number;
    totalNumberOfAllReplies: number;
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
  payload: { repliesPerPage: number };
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
        // const newNumberOfPages = Math.ceil(
        //   commentsSectionNewState.totalNumberOfAllComments /
        //     commentsSectionNewState.commentsPerPage
        // );
        // if (commentsSectionNewState.commentsCurrentPage < newNumberOfPages)
        // if state.commentsCurrentPage < state.commentsPaginatedCollection.length -1 => state.commentsCurrentPage=0

        repliesPaginatedCollectionNewState.repliesPaginatedCollection =
          regroupEntities<ReplyDetailsType>({
            currentEntitiesPaginatedCollection:
              repliesPaginatedCollectionNewState.repliesPaginatedCollection,
            currentPerPage: repliesPaginatedCollectionNewState.repliesPerPage,
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
      // modifies: areRepliesLoading

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
      repliesPaginatedCollectionNewState.repliesPerPage =
        action.payload.repliesPerPage;

      repliesPaginatedCollectionNewState.repliesPaginatedCollection =
        regroupEntities<ReplyDetailsType>({
          currentEntitiesPaginatedCollection:
            repliesPaginatedCollectionNewState.repliesPaginatedCollection,
          currentPerPage: state.repliesPerPage,
          newPerPage: action.payload.repliesPerPage,
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
