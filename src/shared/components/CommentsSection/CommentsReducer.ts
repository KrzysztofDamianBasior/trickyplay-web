import { comments } from "../../hooks/useCommentsAPIFacade";
import { ReplyDetailsType } from "../../hooks/useRepliesAPIFacade";
import { regroupEntities } from "../../utils";
import {
  CommentWithRepliesDetailsType,
  CommentsSectionActionType,
  CommentsSectionStateType,
  RepliesCollectionDetailsType,
} from "./CommentsContext";

const initialRepliesDetails: RepliesCollectionDetailsType = {
  areRepliesLoading: false,
  repliesCurrentPage: 0,
  repliesPaginatedCollection: [],
  totalNumberOfAllReplies: 0,
  repliesPerPage: 10,
};

export function CommentsSectionReducer(
  state: CommentsSectionStateType,
  action: CommentsSectionActionType
): CommentsSectionStateType {
  let commentsSectionNewState: CommentsSectionStateType = JSON.parse(
    JSON.stringify(state)
  );
  let commentIndex: null | number | undefined = null;
  let replyIndex: null | number | undefined = null;
  let comment: CommentWithRepliesDetailsType | undefined | null = null;
  let reply: ReplyDetailsType | undefined | null = null;

  switch (action.type) {
    case "ADD_COMMENT":
      const newComment: CommentWithRepliesDetailsType = {
        ...action.payload.comment,
        repliesDetails: null,
      };

      const indexOfLastCommentsPage =
        commentsSectionNewState.commentsPaginatedCollection.length - 1;

      if (
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
      const indexToDelete = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.commentPage
      ].findIndex((el) => el.id === action.payload.commentId);

      if (indexToDelete > 0) {
        commentsSectionNewState.commentsPaginatedCollection[
          action.payload.commentPage
        ].splice(indexToDelete, 1);
        commentsSectionNewState.totalNumberOfAllComments -= 1;
      }

      return { ...commentsSectionNewState };

    case "ADD_COMMENTS":
      commentsSectionNewState.commentsPaginatedCollection[
        action.payload.commentsPage
      ] = action.payload.comments.map((comment) => {
        return { ...comment, repliesDetails: null };
      });

      commentsSectionNewState.totalNumberOfAllComments =
        action.payload.totalNumberOfAllComments;

      commentsSectionNewState.commentsPaginatedCollection = regroupEntities({
        currentEntitiesCollection:
          commentsSectionNewState.commentsPaginatedCollection,
        currentPerPage: commentsSectionNewState.commentsPerPage,
        newPerPage: commentsSectionNewState.commentsPerPage,
        newTotalNumberOfAllEntities:
          commentsSectionNewState.totalNumberOfAllComments,
      }) as CommentWithRepliesDetailsType[][];

      return { ...commentsSectionNewState };

    case "SET_ACTIVE_COMMENT":
      commentsSectionNewState.activeCommentId = action.payload.commentId;
      return { ...commentsSectionNewState };

    case "SET_COMMENTS_LOADING":
      commentsSectionNewState.areCommentsLoading =
        action.payload.areCommentsLoading;
      return { ...commentsSectionNewState };

    case "SET_REPLIES_LOADING":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((comm) => comm.id === action.payload.parentCommentId);

      if (comment) {
        if (comment.repliesDetails) {
          comment.repliesDetails.areRepliesLoading =
            action.payload.areRepliesLoading;
        } else {
          comment.repliesDetails = {
            ...initialRepliesDetails,
            areRepliesLoading: action.payload.areRepliesLoading,
          };
        }
      }

      return { ...commentsSectionNewState };

    case "UPDATE_COMMENT":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.page
      ].find((comm) => comm.id === action.payload.comment.id);

      if (comment) {
        comment = {
          ...action.payload.comment,
          repliesDetails: comment.repliesDetails,
        };
      }

      return { ...commentsSectionNewState };

    case "SET_CURRENT_COMMENTS_PAGE":
      commentsSectionNewState.commentsCurrentPage =
        action.payload.currentCommentsPage;
      return { ...commentsSectionNewState };

    case "SET_TEXT_ALIGNMENT":
      commentsSectionNewState.textAlignment = action.payload.textAlignment;
      return { ...commentsSectionNewState };

    case "SET_COMMENTS_ROWS_PER_PAGE":
      commentsSectionNewState.commentsPerPage = action.payload.commentsPerPage;

      commentsSectionNewState.commentsPaginatedCollection = regroupEntities({
        currentEntitiesCollection:
          commentsSectionNewState.commentsPaginatedCollection,
        currentPerPage: state.commentsPerPage,
        newPerPage: action.payload.commentsPerPage,
        newTotalNumberOfAllEntities:
          commentsSectionNewState.totalNumberOfAllComments,
      }) as CommentWithRepliesDetailsType[][];

      return { ...commentsSectionNewState };

    case "SET_REPLIES_ROWS_PER_PAGE":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((comm) => comm.id === action.payload.parentCommentId);

      if (comment) {
        if (comment.repliesDetails) {
          const totalNumberOfAllReplies =
            comment.repliesDetails.totalNumberOfAllReplies;

          comment.repliesDetails.repliesPaginatedCollection = regroupEntities({
            currentEntitiesCollection:
              comment.repliesDetails.repliesPaginatedCollection,
            currentPerPage: comment.repliesDetails.repliesPerPage,
            newPerPage: action.payload.repliesPerPage,
            newTotalNumberOfAllEntities: totalNumberOfAllReplies,
          }) as ReplyDetailsType[][];

          comment.repliesDetails.repliesPerPage = action.payload.repliesPerPage;
        } else {
          comment.repliesDetails = {
            ...initialRepliesDetails,
            repliesPerPage: action.payload.repliesPerPage,
          };
        }
      }

      return { ...commentsSectionNewState };

    case "ADD_REPLY":
      const parentComment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((comm) => comm.id === action.payload.reply.parentId);

      if (parentComment) {
        const newReply: ReplyDetailsType = action.payload.reply;
        if (parentComment.repliesDetails) {
          const indexOfLastReplyPage =
            parentComment.repliesDetails.repliesPaginatedCollection.length - 1;

          if (
            parentComment.repliesDetails.repliesPaginatedCollection[
              indexOfLastReplyPage
            ].length < parentComment.repliesDetails.repliesPerPage
          ) {
            parentComment.repliesDetails.repliesPaginatedCollection[
              indexOfLastReplyPage
            ].push(newReply);
          } else {
            parentComment.repliesDetails.repliesPaginatedCollection.push([
              newReply,
            ]);
          }
        } else {
          parentComment.repliesDetails = {
            areRepliesLoading: false,
            totalNumberOfAllReplies: 1,
            repliesCurrentPage: 0,
            repliesPaginatedCollection: [[newReply]],
            repliesPerPage: 10,
          };
        }
        commentsSectionNewState.totalNumberOfAllComments += 1;
      }
      return { ...commentsSectionNewState };

    case "ADD_REPLIES":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((comm) => comm.id === action.payload.parentCommentId);

      if (comment) {
        if (comment.repliesDetails) {
          comment.repliesDetails.repliesPaginatedCollection[
            action.payload.repliesPage
          ] = action.payload.replies;

          comment.repliesDetails.repliesPaginatedCollection = regroupEntities({
            currentEntitiesCollection:
              comment.repliesDetails.repliesPaginatedCollection,
            currentPerPage: comment.repliesDetails.repliesPerPage,
            newPerPage: comment.repliesDetails.repliesPerPage,
            newTotalNumberOfAllEntities: action.payload.totalNumberOfAllReplies,
          }) as ReplyDetailsType[][];
        } else {
          comment.repliesDetails = {
            areRepliesLoading: false,
            repliesCurrentPage: 0,
            repliesPerPage: action.payload.replies.length,
            totalNumberOfAllReplies: action.payload.replies.length,
            repliesPaginatedCollection: [action.payload.replies],
          };
        }
      }
      return { ...commentsSectionNewState };

    case "DELETE_REPLY":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((el) => el.id === action.payload.parentCommentId);

      if (comment && comment.repliesDetails) {
        const replyToDeleteIndex =
          comment.repliesDetails.repliesPaginatedCollection[
            action.payload.replyPage
          ].findIndex((el) => el.id === action.payload.replyId);

        if (replyToDeleteIndex >= 0) {
          comment.repliesDetails.repliesPaginatedCollection[
            action.payload.replyPage
          ].splice(replyToDeleteIndex, 1);
        }
      }
      return { ...commentsSectionNewState };

    case "UPDATE_REPLY":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((el) => el.id === action.payload.reply.parentId);

      if (comment && comment.repliesDetails) {
        const replyToUpdateIndex =
          comment.repliesDetails.repliesPaginatedCollection[
            action.payload.replyPage
          ].findIndex((el) => el.id === action.payload.reply.id);

        if (replyToUpdateIndex >= 0) {
          comment.repliesDetails.repliesPaginatedCollection[
            action.payload.replyPage
          ][replyToUpdateIndex] = action.payload.reply;
        }
      }
      return { ...commentsSectionNewState };

    case "SET_ACTIVE_REPLY":
      commentsSectionNewState.activeReply = {
        parentCommentId: action.payload.parentCommentId,
        replyId: action.payload.replyId,
        type: "Editing",
      };
      return { ...commentsSectionNewState };

    case "SET_CURRENT_REPLIES_PAGE":
      comment = commentsSectionNewState.commentsPaginatedCollection[
        action.payload.parentCommentPage
      ].find((el) => el.id === action.payload.parentCommentId);

      if (comment && comment.repliesDetails) {
        if (comment.repliesDetails) {
          comment.repliesDetails.repliesCurrentPage =
            action.payload.currentRepliesPage;
        }
      }
      return { ...commentsSectionNewState };

    default:
      return { ...state };
  }
}
