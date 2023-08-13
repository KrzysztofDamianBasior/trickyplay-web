import { ReplyDetailsType } from "../../hooks/useRepliesAPIFacade";
import { regroupEntities } from "../../utils";

export const repliesPaginatedCollectionInitialState: RepliesPaginatedCollectionStateType =
  {
    textAlignment: "left",
    repliesCurrentPage: 0,
    repliesPaginatedCollection: [[], [], [], [], []],
    areRepliesLoading: false,
    repliesPerPage: 10,
    totalNumberOfAllReplies: 0,
    activeReply: null,
  };

export type RepliesPaginatedCollectionStateType = {
  textAlignment: textAlignentType;
  repliesPaginatedCollection: ReplyDetailsType[][];
  areRepliesLoading: boolean;
  repliesCurrentPage: number;
  repliesPerPage: number;
  totalNumberOfAllReplies: number;
  activeReply: {
    type: "Editing";
    replyId: string;
  } | null;
};

export type textAlignentType = "center" | "left" | "right" | "justify";

export type RepliesPaginatedCollectionActionType =
  | AddReplyActionType
  | AddRepliesActionType
  | DeleteReplyActionType
  | UpdateReplyActionType
  | SetTextAlignmentActionType
  | SetActiveReplyActionType
  | SetRepliesLoadingActionType
  | SetCurrentRepliesPageActionType
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
  payload: { textAlignment: textAlignentType };
};

export type SetActiveReplyActionType = {
  type: "SET_ACTIVE_REPLY";
  payload: { replyId: string; type: "Editing" };
};
export type SetRepliesLoadingActionType = {
  type: "SET_REPLIES_LOADING";
  payload: { areRepliesLoading: boolean };
};

export type SetCurrentRepliesPageActionType = {
  type: "SET_CURRENT_REPLIES_PAGE";
  payload: { currentRepliesPage: number };
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
  const currentIndexOfLastPaginatedCollectionPage =
    currentPaginatedCollectionLength - 1;

  switch (action.type) {
    case "ADD_REPLY":
      // modifies: repliesPaginatedCollection, totalNumberOfAllReplies
      if (
        currentIndexOfLastPaginatedCollectionPage >= 0 &&
        repliesPaginatedCollectionNewState.repliesPaginatedCollection[
          currentIndexOfLastPaginatedCollectionPage
        ].length < repliesPaginatedCollectionNewState.repliesPerPage
      ) {
        repliesPaginatedCollectionNewState.repliesPaginatedCollection[
          currentIndexOfLastPaginatedCollectionPage
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
      }

      return { ...repliesPaginatedCollectionNewState };

    case "SET_ACTIVE_REPLY":
      // modifies: repliesPaginatedCollection, totalNumberOfAllReplies

      repliesPaginatedCollectionNewState.activeReply = {
        replyId: action.payload.replyId,
        type: "Editing",
      };
      return { ...repliesPaginatedCollectionNewState };

    case "SET_REPLIES_LOADING":
      // modifies: areRepliesLoading

      repliesPaginatedCollectionNewState.areRepliesLoading =
        action.payload.areRepliesLoading;
      return { ...repliesPaginatedCollectionNewState };

    case "UPDATE_REPLY":
      reply = repliesPaginatedCollectionNewState.repliesPaginatedCollection[
        action.payload.replyPage
      ].find((rep) => rep.id === action.payload.reply.id);

      if (reply) {
        reply = action.payload.reply;
      }

      return { ...repliesPaginatedCollectionNewState };

    case "SET_CURRENT_REPLIES_PAGE":
      repliesPaginatedCollectionNewState.repliesCurrentPage =
        action.payload.currentRepliesPage;

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

      return { ...repliesPaginatedCollectionNewState };

    default:
      return { ...state };
  }
}
