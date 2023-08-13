import { CommentDetailsType } from "../../hooks/useCommentsAPIFacade";
import { regroupEntities } from "../../utils";

export const commentsPaginatedCollectionInitialState: CommentsPaginatedCollectionStateType =
  {
    textAlignment: "left",
    commentsCurrentPage: 0,
    commentsPaginatedCollection: [[], [], [], [], []],
    areCommentsLoading: false,
    commentsPerPage: 10,
    totalNumberOfAllComments: 50,
    activeComment: null,
  };

export type CommentsPaginatedCollectionStateType = {
  textAlignment: textAlignentType;
  commentsPaginatedCollection: CommentDetailsType[][];
  areCommentsLoading: boolean;
  commentsCurrentPage: number;
  commentsPerPage: number;
  totalNumberOfAllComments: number;
  activeComment: {
    type: "Editing" | "Replying";
    id: string;
  } | null;
};

export type textAlignentType = "center" | "left" | "right" | "justify";

export type CommentsPaginatedCollectionActionType =
  | AddCommentActionType
  | AddCommentsActionType
  | DeleteCommentActionType
  | UpdateCommentActionType
  | SetTextAlignmentActionType
  | SetActiveCommentActionType
  | SetCommentsLoadingActionType
  | SetCurrentCommentsPageActionType
  | SetCommentsRowsPerPageActionType;

export type AddCommentActionType = {
  type: "ADD_COMMENT";
  payload: { comment: CommentDetailsType };
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
  payload: { textAlignment: textAlignentType };
};

export type SetActiveCommentActionType = {
  type: "SET_ACTIVE_COMMENT";
  payload: { commentId: string; type: "Editing" | "Replying" };
};
export type SetCommentsLoadingActionType = {
  type: "SET_COMMENTS_LOADING";
  payload: { areCommentsLoading: boolean };
};

export type SetCurrentCommentsPageActionType = {
  type: "SET_CURRENT_COMMENTS_PAGE";
  payload: { currentCommentsPage: number };
};

export type SetCommentsRowsPerPageActionType = {
  type: "SET_COMMENTS_PER_PAGE";
  payload: { commentsPerPage: number };
};

export function commentsPaginatedCollectionReducer(
  state: CommentsPaginatedCollectionStateType,
  action: CommentsPaginatedCollectionActionType
): CommentsPaginatedCollectionStateType {
  let commentsSectionNewState: CommentsPaginatedCollectionStateType =
    JSON.parse(JSON.stringify(state));
  let comment: CommentDetailsType | undefined | null = null;

  switch (action.type) {
    case "ADD_COMMENT":
      // modifies: commentsPaginatedCollection, totalNumberOfAllComments

      const newComment: CommentDetailsType = action.payload.comment;

      const indexOfLastCommentsPage =
        commentsSectionNewState.commentsPaginatedCollection.length - 1;

      if (
        indexOfLastCommentsPage >= 0 &&
        commentsSectionNewState.commentsPaginatedCollection[
          indexOfLastCommentsPage
        ].length < commentsSectionNewState.commentsPerPage
      ) {
        commentsSectionNewState.commentsPaginatedCollection[
          indexOfLastCommentsPage
        ].push(newComment);
      } else {
        commentsSectionNewState.commentsPaginatedCollection.push([newComment]);
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

      commentsSectionNewState.commentsPaginatedCollection[
        action.payload.commentsPage
      ] = action.payload.comments;

      const oldTotalNumberOfComments = state.totalNumberOfAllComments;
      commentsSectionNewState.totalNumberOfAllComments =
        action.payload.totalNumberOfAllComments;

      if (
        oldTotalNumberOfComments !==
        commentsSectionNewState.totalNumberOfAllComments
      ) {
        // const newNumberOfPages = Math.ceil(
        //   commentsSectionNewState.totalNumberOfAllComments /
        //     commentsSectionNewState.commentsPerPage
        // );
        // if (commentsSectionNewState.commentsCurrentPage < newNumberOfPages)
        // if state.commentsCurrentPage < state.commentsPaginatedCollection.length -1 => state.commentsCurrentPage=0

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

      return { ...commentsSectionNewState };

    case "SET_ACTIVE_COMMENT":
      // modifies: commentsPaginatedCollection, totalNumberOfAllComments

      commentsSectionNewState.activeComment = {
        id: action.payload.commentId,
        type: action.payload.type,
      };
      return { ...commentsSectionNewState };

    case "SET_COMMENTS_LOADING":
      // modifies: areCommentsLoading

      commentsSectionNewState.areCommentsLoading =
        action.payload.areCommentsLoading;
      return { ...commentsSectionNewState };

    case "UPDATE_COMMENT":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.page
      ].find((comm) => comm.id === action.payload.comment.id);

      if (comment) {
        comment = { ...action.payload.comment };
      }

      return { ...commentsSectionNewState };

    case "SET_CURRENT_COMMENTS_PAGE":
      commentsSectionNewState.commentsCurrentPage =
        action.payload.currentCommentsPage;

      return { ...commentsSectionNewState };

    case "SET_TEXT_ALIGNMENT":
      commentsSectionNewState.textAlignment = action.payload.textAlignment;
      return { ...commentsSectionNewState };

    case "SET_COMMENTS_PER_PAGE":
      commentsSectionNewState.commentsPerPage = action.payload.commentsPerPage;

      commentsSectionNewState.commentsPaginatedCollection =
        regroupEntities<CommentDetailsType>({
          currentEntitiesPaginatedCollection:
            commentsSectionNewState.commentsPaginatedCollection,
          currentPerPage: state.commentsPerPage,
          newPerPage: action.payload.commentsPerPage,
          newTotalNumberOfAllEntities:
            commentsSectionNewState.totalNumberOfAllComments,
        });

      return { ...commentsSectionNewState };

    default:
      return { ...state };
  }
}
