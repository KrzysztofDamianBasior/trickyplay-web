import { type CommentDetailsType } from "../../models/internalAppRepresentation/resources";
import { calculateNumberOfPages, regroupEntities } from "../../utils";

export const commentsPaginatedCollectionInitialState: CommentsPaginatedCollectionStateType =
  {
    textAlignment: "left",
    commentsPaginatedCollection: [[], [], [], [], []],
    status: "LOADING",
    totalNumberOfAllComments: 50,
    activeComment: null,
    commentsActivePage: 0,
    commentsPerPage: 10,
  };

export type CommentsPaginatedCollectionStateType = {
  textAlignment: TextAlignmentType;
  commentsPaginatedCollection: CommentDetailsType[][]; // [numOfPages][commentsPerPage]
  status: CommentsPaginatedCollectionStatusType;
  totalNumberOfAllComments: number;
  activeComment: ActiveCommentDetailsType;
  commentsActivePage: number;
  commentsPerPage: number;
};

export type CommentsPaginatedCollectionStatusType =
  | "LOADING"
  | "READY"
  | "ERROR";

export type ActiveCommentDetailsType = {
  type: ActiveCommentActionType;
  id: string;
} | null;

export type ActiveCommentActionType = "Editing" | "Replying";

export type TextAlignmentType = "center" | "left" | "right" | "justify";

export type CommentsPaginatedCollectionActionType =
  | AddCommentActionType
  | AddCommentsActionType
  | DeleteCommentActionType
  | UpdateCommentActionType
  | SetTextAlignmentActionType
  | SetActiveCommentActionType
  | SetCommentsStatusActionType
  | SetActiveCommentsPageActionType
  | SetCommentsRowsPerPageActionType;

export type AddCommentActionType = {
  type: "ADD_COMMENT";
  payload: {
    comment: CommentDetailsType;
  };
};

export type AddCommentsActionType = {
  type: "ADD_COMMENTS";
  payload: {
    comments: CommentDetailsType[];
    commentsPage: number;
    totalNumberOfAllComments: number;
  };
};

export type DeleteCommentActionType = {
  type: "DELETE_COMMENT";
  payload: { commentId: string; commentPage: number };
};

export type UpdateCommentActionType = {
  type: "UPDATE_COMMENT";
  payload: { comment: CommentDetailsType; page: number };
};

export type SetTextAlignmentActionType = {
  type: "SET_TEXT_ALIGNMENT";
  payload: { textAlignment: TextAlignmentType };
};

export type SetActiveCommentActionType = {
  type: "SET_ACTIVE_COMMENT";
  payload: { commentId: string; type: "Editing" | "Replying" } | null;
};
export type SetCommentsStatusActionType = {
  type: "SET_COMMENTS_STATUS";
  payload: { newStatus: CommentsPaginatedCollectionStatusType };
};

export type SetActiveCommentsPageActionType = {
  type: "SET_ACTIVE_COMMENTS_PAGE";
  payload: { newActiveCommentsPage: number };
};

export type SetCommentsRowsPerPageActionType = {
  type: "SET_COMMENTS_PER_PAGE";
  payload: { prevCommentsPerPage: number; newCommentsPerPage: number };
};

export function commentsPaginatedCollectionReducer(
  state: CommentsPaginatedCollectionStateType,
  action: CommentsPaginatedCollectionActionType
): CommentsPaginatedCollectionStateType {
  let commentsSectionNewState: CommentsPaginatedCollectionStateType =
    JSON.parse(JSON.stringify(state));

  const currentPaginatedCollectionLength =
    state.commentsPaginatedCollection.length;
  const indexOfLastPaginatedCollectionPage =
    currentPaginatedCollectionLength - 1;

  switch (action.type) {
    case "ADD_COMMENT":
      // modifies: commentsPaginatedCollection, totalNumberOfAllComments

      if (
        indexOfLastPaginatedCollectionPage >= 0 &&
        commentsSectionNewState.commentsPaginatedCollection[
          indexOfLastPaginatedCollectionPage
        ].length < commentsSectionNewState.commentsPerPage
      ) {
        commentsSectionNewState.commentsPaginatedCollection[
          indexOfLastPaginatedCollectionPage
        ].push(action.payload.comment);
      } else {
        commentsSectionNewState.commentsPaginatedCollection.push([
          action.payload.comment,
        ]);
      }

      commentsSectionNewState.totalNumberOfAllComments += 1;
      return { ...commentsSectionNewState };

    case "DELETE_COMMENT":
      // modifies: commentsPaginatedCollection, totalNumberOfAllComments

      const indexToDelete = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.commentPage
      ].findIndex((el) => el.id === action.payload.commentId);

      if (indexToDelete >= 0) {
        commentsSectionNewState.commentsPaginatedCollection[
          action.payload.commentPage
        ].splice(indexToDelete, 1);
        commentsSectionNewState.totalNumberOfAllComments -= 1;
      }

      return { ...commentsSectionNewState };

    case "ADD_COMMENTS":
      // modifies: commentsPaginatedCollection, totalNumberOfAllComments, commentsCurrentPage

      if (
        action.payload.commentsPage <
        commentsSectionNewState.commentsPaginatedCollection.length
      ) {
        commentsSectionNewState.commentsPaginatedCollection[
          action.payload.commentsPage
        ] = action.payload.comments;

        commentsSectionNewState.totalNumberOfAllComments =
          action.payload.totalNumberOfAllComments;

        if (
          state.commentsActivePage <
          calculateNumberOfPages({
            perPage: state.commentsActivePage,
            totalNumberOfEntities: action.payload.totalNumberOfAllComments,
          })
        ) {
          commentsSectionNewState.commentsPaginatedCollection =
            regroupEntities<CommentDetailsType>({
              currentEntitiesPaginatedCollection:
                commentsSectionNewState.commentsPaginatedCollection,
              currentPerPage: commentsSectionNewState.commentsPerPage,
              newPerPage: commentsSectionNewState.commentsPerPage,
              newTotalNumberOfAllEntities:
                commentsSectionNewState.totalNumberOfAllComments,
            });
        } else {
          commentsSectionNewState.commentsActivePage = 0;
          commentsSectionNewState.commentsPaginatedCollection =
            regroupEntities<CommentDetailsType>({
              currentEntitiesPaginatedCollection:
                commentsSectionNewState.commentsPaginatedCollection,
              currentPerPage: commentsSectionNewState.commentsPerPage,
              newPerPage: commentsSectionNewState.commentsPerPage,
              newTotalNumberOfAllEntities:
                commentsSectionNewState.totalNumberOfAllComments,
            });
        }
      }

      return { ...commentsSectionNewState };

    case "SET_ACTIVE_COMMENT":
      // modifies: commentsPaginatedCollection, totalNumberOfAllComments

      if (action.payload) {
        commentsSectionNewState.activeComment = {
          id: action.payload.commentId,
          type: action.payload.type,
        };
      } else {
        commentsSectionNewState.activeComment = null;
      }

      return { ...commentsSectionNewState };

    case "SET_COMMENTS_STATUS":
      // modifies: areCommentsLoading

      commentsSectionNewState.status = action.payload.newStatus;
      return { ...commentsSectionNewState };

    case "UPDATE_COMMENT":
      if (
        action.payload.page <
        commentsSectionNewState.commentsPaginatedCollection.length
      ) {
        const indexOfCommentToUpdate =
          commentsSectionNewState.commentsPaginatedCollection[
            action.payload.page
          ].findIndex((comm) => comm.id === action.payload.comment.id);

        if (indexOfCommentToUpdate !== -1) {
          commentsSectionNewState.commentsPaginatedCollection[
            action.payload.page
          ][indexOfCommentToUpdate] = action.payload.comment;
        }
      }

      return { ...commentsSectionNewState };

    case "SET_ACTIVE_COMMENTS_PAGE":
      if (
        action.payload.newActiveCommentsPage <
        commentsSectionNewState.commentsPaginatedCollection.length
      ) {
        commentsSectionNewState.commentsActivePage =
          action.payload.newActiveCommentsPage;
      }

      return { ...commentsSectionNewState };

    case "SET_TEXT_ALIGNMENT":
      commentsSectionNewState.textAlignment = action.payload.textAlignment;

      return { ...commentsSectionNewState };

    case "SET_COMMENTS_PER_PAGE":
      // let prevCommentsPerPage = state.commentsPerPage;
      commentsSectionNewState.commentsPaginatedCollection =
        regroupEntities<CommentDetailsType>({
          currentEntitiesPaginatedCollection:
            commentsSectionNewState.commentsPaginatedCollection,
          // currentPerPage: prevCommentsPerPage,
          currentPerPage: state.commentsPerPage,
          newPerPage: action.payload.newCommentsPerPage,
          newTotalNumberOfAllEntities: state.totalNumberOfAllComments,
        });

      commentsSectionNewState.commentsPerPage =
        action.payload.newCommentsPerPage;

      if (
        commentsSectionNewState.commentsPaginatedCollection.length - 1 <
        commentsSectionNewState.commentsActivePage
      ) {
        commentsSectionNewState.commentsActivePage = 0;
      }

      return { ...commentsSectionNewState };

    default:
      return { ...state };
  }
}
