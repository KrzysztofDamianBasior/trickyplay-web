import { CommentDetailsType } from "../api/useCommentsAPIFacade";
import { regroupEntities } from "../../utils";

export const commentsPaginatedCollectionInitialState: CommentsPaginatedCollectionStateType =
  {
    textAlignment: "left",
    commentsPaginatedCollection: [[], [], [], [], []],
    status: "LOADING",
    totalNumberOfAllComments: 50,
    activeComment: null,
    // commentsPerPage: 10,
    // commentsActivePage: 0,
  };

export type CommentsPaginatedCollectionStateType = {
  textAlignment: TextAlignentType;
  commentsPaginatedCollection: CommentDetailsType[][]; // [numOfPages][commentsPerPage]
  status: CommentsPaginatedCollectionStatusType;
  totalNumberOfAllComments: number;
  activeComment: ActiveCommentDetailsType;
  // commentsActivePage: number;
  // commentsPerPage: number;
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

export type TextAlignentType = "center" | "left" | "right" | "justify";

export type CommentsPaginatedCollectionActionType =
  | AddCommentActionType
  | AddCommentsActionType
  | DeleteCommentActionType
  | UpdateCommentActionType
  | SetTextAlignmentActionType
  | SetActiveCommentActionType
  | SetCommentsLoadingActionType
  // | SetActiveCommentsPageActionType
  | SetCommentsRowsPerPageActionType;

export type AddCommentActionType = {
  type: "ADD_COMMENT";
  payload: { comment: CommentDetailsType; commentsPerPage: number };
};

export type AddCommentsActionType = {
  type: "ADD_COMMENTS";
  payload: {
    comments: CommentDetailsType[];
    commentsPage: number;
    totalNumberOfAllComments: number;
    commentsPerPage: number;
    commentsActivePage: number;
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
  payload: { textAlignment: TextAlignentType };
};

export type SetActiveCommentActionType = {
  type: "SET_ACTIVE_COMMENT";
  payload: { commentId: string; type: "Editing" | "Replying" } | null;
};
export type SetCommentsLoadingActionType = {
  type: "SET_COMMENTS_STATUS";
  payload: { newStatus: CommentsPaginatedCollectionStatusType };
};

// export type SetActiveCommentsPageActionType = {
//   type: "SET_ACTIVE_COMMENTS_PAGE";
//   payload: { newActiveCommentsPage: number };
// };

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
        ].length < action.payload.commentsPerPage
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
            currentPerPage: action.payload.commentsPerPage,
            newPerPage: action.payload.commentsPerPage,
            newTotalNumberOfAllEntities:
              commentsSectionNewState.totalNumberOfAllComments,
          });
        // if (
        //   commentsSectionNewState.commentsPaginatedCollection.length - 1 <
        //   commentsActivePage
        // ) {
        //   commentsActivePage = 0;
        // }
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
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.page
      ].find((comm) => comm.id === action.payload.comment.id);

      if (comment) {
        comment = { ...action.payload.comment };
      }

      return { ...commentsSectionNewState };

    // case "SET_ACTIVE_COMMENTS_PAGE":
    //   if (
    //     action.payload.newActiveCommentsPage <
    //     commentsSectionNewState.commentsPaginatedCollection.length
    //   ) {
    //     commentsSectionNewState.commentsActivePage =
    //       action.payload.newActiveCommentsPage;
    //   }

    //   return { ...commentsSectionNewState };

    case "SET_TEXT_ALIGNMENT":
      commentsSectionNewState.textAlignment = action.payload.textAlignment;

      return { ...commentsSectionNewState };

    case "SET_COMMENTS_PER_PAGE":
      let prevCommentsPerPage = action.payload.prevCommentsPerPage;
      let newCommentsPerPage = action.payload.newCommentsPerPage;
      // commentsPerPage = action.payload.commentsPerPage;

      commentsSectionNewState.commentsPaginatedCollection =
        regroupEntities<CommentDetailsType>({
          currentEntitiesPaginatedCollection:
            commentsSectionNewState.commentsPaginatedCollection,
          currentPerPage: prevCommentsPerPage,
          newPerPage: newCommentsPerPage,
          newTotalNumberOfAllEntities:
            commentsSectionNewState.totalNumberOfAllComments,
        });
      // if (
      //   commentsSectionNewState.commentsPaginatedCollection.length - 1 <
      //   commentsSectionNewState.commentsActivePage
      // ) {
      //   commentsSectionNewState.commentsActivePage = 0;
      // }

      return { ...commentsSectionNewState };

    default:
      return { ...state };
  }
}
