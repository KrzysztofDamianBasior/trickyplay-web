import { createContext } from "react";
import { type CommentDetailsType } from "../../hooks/useCommentsAPIFacade";
import { type ReplyDetailsType } from "../../hooks/useRepliesAPIFacade";

export type CommentsSectionContextType = {
  commentsSectionState: CommentsSectionStateType;
  handleTextAlignmentChange: ({
    event,
    newAlignment,
  }: {
    event: React.MouseEvent<HTMLElement>;
    newAlignment: "left" | "center" | "right" | "justify";
  }) => void;
};

export type CommentsSectionStateType = {
  textAlignment: textAlignentType;
  activeCommentId: string | null;
  commentsPaginatedCollection: CommentWithRepliesDetailsType[][];
  areCommentsLoading: boolean;
  commentsCurrentPage: number;
  commentsPerPage: number;
  totalNumberOfAllComments: number;
  activeComment: {
    type: "Editing" | "Replying";
    id: string;
  } | null;
  activeReply: {
    type: "Editing";
    replyId: string;
    parentCommentId: string;
  } | null;
};

export type CommentWithRepliesDetailsType = CommentDetailsType & {
  repliesDetails: RepliesCollectionDetailsType | null;
};

export type RepliesCollectionDetailsType = {
  repliesPaginatedCollection: ReplyDetailsType[][];
  areRepliesLoading: boolean;
  repliesCurrentPage: number;
  repliesPerPage: number;
  totalNumberOfAllReplies: number;
};

export type CommentsSectionActionType =
  | AddCommentActionType
  | AddCommentsActionType
  | AddReplyActionType
  | AddRepliesActionType
  | DeleteCommentActionType
  | DeleteReplyActionType
  | UpdateCommentActionType
  | UpdateReplyActionType
  | SetTextAlignmentActionType
  | SetActiveCommentActionType
  | SetActiveReplyActionType
  | SetCommentsLoadingActionType
  | SetRepliesLoadingActionType
  | SetCurrentCommentsPageActionType
  | SetCurrentRepliesPageActionType
  | SetCommentsRowsPerPageActionType
  | SetRepliesRowsPerPageActionType;

export type textAlignentType = "center" | "left" | "right" | "justify";

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

export type AddReplyActionType = {
  type: "ADD_REPLY";
  payload: { reply: ReplyDetailsType; parentCommentPage: number };
};

export type AddRepliesActionType = {
  type: "ADD_REPLIES";
  payload: {
    parentCommentPage: number;
    parentCommentId: string;
    repliesPage: number;
    replies: ReplyDetailsType[];
    totalNumberOfAllReplies: number;
  };
};

export type DeleteCommentActionType = {
  type: "DELETE_COMMENT";
  payload: { commentId: string; commentPage: number };
};

export type DeleteReplyActionType = {
  type: "DELETE_REPLY";
  payload: {
    parentCommentId: string;
    replyId: string;
    replyPage: number;
    parentCommentPage: number;
  };
};

export type UpdateCommentActionType = {
  type: "UPDATE_COMMENT";
  payload: { comment: CommentDetailsType; page: number };
};
export type UpdateReplyActionType = {
  type: "UPDATE_REPLY";
  payload: {
    reply: ReplyDetailsType;
    replyPage: number;
    parentCommentPage: number;
  };
};

export type SetTextAlignmentActionType = {
  type: "SET_TEXT_ALIGNMENT";
  payload: { textAlignment: textAlignentType };
};

export type SetActiveCommentActionType = {
  type: "SET_ACTIVE_COMMENT";
  payload: { commentId: string };
};

export type SetActiveReplyActionType = {
  type: "SET_ACTIVE_REPLY";
  payload: {
    replyId: string;
    parentCommentId: string;
  };
};

export type SetCommentsLoadingActionType = {
  type: "SET_COMMENTS_LOADING";
  payload: { areCommentsLoading: boolean };
};

export type SetRepliesLoadingActionType = {
  type: "SET_REPLIES_LOADING";
  payload: {
    areRepliesLoading: boolean;
    parentCommentId: string;
    parentCommentPage: number;
  };
};

export type SetCurrentCommentsPageActionType = {
  type: "SET_CURRENT_COMMENTS_PAGE";
  payload: { currentCommentsPage: number };
};

export type SetCurrentRepliesPageActionType = {
  type: "SET_CURRENT_REPLIES_PAGE";
  payload: {
    currentRepliesPage: number;
    parentCommentPage: number;
    parentCommentId: string;
  };
};

export type SetCommentsRowsPerPageActionType = {
  type: "SET_COMMENTS_ROWS_PER_PAGE";
  payload: { commentsPerPage: number };
};

export type SetRepliesRowsPerPageActionType = {
  type: "SET_REPLIES_ROWS_PER_PAGE";
  payload: {
    parentCommentId: string;
    parentCommentPage: number;
    repliesPerPage: number;
  };
};

export const commentsSectionInitialState: CommentsSectionStateType = {
  activeCommentId: null,
  textAlignment: "left",
  commentsCurrentPage: 0,
  commentsPaginatedCollection: [[], [], [], [], []],
  areCommentsLoading: false,
  commentsPerPage: 10,
  totalNumberOfAllComments: 50,
  activeComment: null,
  activeReply: null,
};

export const CommentsSectionContext = createContext<CommentsSectionContextType>(
  {
    commentsSectionState: commentsSectionInitialState,
    handleTextAlignmentChange: () => {},
  }
);
