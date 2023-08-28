import { useContext, useEffect, useReducer, useRef } from "react";

import useCommentsAPIFacade, {
  CommentDetailsType,
} from "../api/useCommentsAPIFacade";
import {
  commentsPaginatedCollectionReducer,
  commentsPaginatedCollectionInitialState,
  CommentsPaginatedCollectionStateType,
} from "./commentsPaginatedCollectionReducer";
import { AccountContext } from "../account/AccountContext";
import { calculateNumberOfPages } from "../../utils";
import { NotificationContext } from "../snackbars/NotificationsContext";

type Props = { gameName: string };

const useCommentsPaginatedCollection = ({
  gameName,
}: Props): UseCommentsPaginatedCollectionResultType => {
  const { authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);

  const isMounted = useRef(false);

  const [
    commentsPaginatedCollectionState,
    commentsPaginatedCollectionDispatch,
  ] = useReducer(
    commentsPaginatedCollectionReducer,
    commentsPaginatedCollectionInitialState
  );

  const { createComment, deleteComment, getComments, updateComment } =
    useCommentsAPIFacade();

  useEffect(() => {
    const fetchComments = async () => {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });

      const getCommentsResultType = await getComments({
        gameName,
        page: commentsPaginatedCollectionState.commentsActivePage,
        perPage: commentsPaginatedCollectionState.commentsPerPage,
      });

      if (
        getCommentsResultType.totalNumberOfComments &&
        getCommentsResultType.comments
      ) {
        commentsPaginatedCollectionDispatch({
          type: "ADD_COMMENTS",
          payload: {
            comments: getCommentsResultType.comments,
            commentsPage: 0,
            totalNumberOfAllComments:
              getCommentsResultType.totalNumberOfComments,
          },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "successfully fetch comments",
          body: "comments section successfully populated",
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: "failed to fetch comments",
          body: "failed to populate comments section",
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
      }
    };

    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameName]);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        const activeCommentsPage =
          commentsPaginatedCollectionState.commentsActivePage;

        const commentsPaginatedCollectionLength =
          commentsPaginatedCollectionState.commentsPaginatedCollection.length;

        const commentsPerPage =
          commentsPaginatedCollectionState.commentsPerPage;

        if (
          activeCommentsPage < commentsPaginatedCollectionLength - 1 &&
          commentsPaginatedCollectionState.commentsPaginatedCollection[
            activeCommentsPage
          ].length < commentsPerPage
        ) {
          commentsPaginatedCollectionDispatch({
            type: "SET_COMMENTS_STATUS",
            payload: { newStatus: "LOADING" },
          });

          const getCommentsResult = await getComments({
            gameName,
            page: activeCommentsPage,
            perPage: commentsPerPage,
          });
          if (
            getCommentsResult.comments !== null &&
            getCommentsResult.totalNumberOfComments !== null
          ) {
            if (
              activeCommentsPage <
              calculateNumberOfPages({
                perPage: activeCommentsPage,
                totalNumberOfEntities: getCommentsResult.totalNumberOfComments,
              })
            ) {
              commentsPaginatedCollectionDispatch({
                type: "ADD_COMMENTS",
                payload: {
                  comments: getCommentsResult.comments,
                  commentsPage: activeCommentsPage,
                  totalNumberOfAllComments:
                    getCommentsResult.totalNumberOfComments,
                },
              });
              openSnackbar({
                severity: "success",
                title: "successfully fetch comments",
                body: "comments sections successfully populated",
              });
            } else {
              commentsPaginatedCollectionDispatch({
                type: "SET_ACTIVE_COMMENTS_PAGE",
                payload: { newActiveCommentsPage: 0 },
              });
              openSnackbar({
                severity: "info",
                title:
                  "the active comments page exceeds the total number of comments",
                body: "page 0 is set",
              });
            }
            commentsPaginatedCollectionDispatch({
              type: "SET_COMMENTS_STATUS",
              payload: { newStatus: "READY" },
            });
          } else {
            ///////////////// notify user of an error
            openSnackbar({
              severity: "error",
              title: "failed to fetch comments",
              body: "failed to populate comments section",
            });
            commentsPaginatedCollectionDispatch({
              type: "SET_COMMENTS_STATUS",
              payload: { newStatus: "ERROR" },
            });
          }
        }
      })();
    } else {
      isMounted.current = true;
    }
    //   return () => {
    //     // this now gets called when the component unmounts
    //   };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    commentsPaginatedCollectionState.commentsActivePage,
    commentsPaginatedCollectionState.commentsPerPage,
  ]);

  const handleTextAlignmentChange = ({
    newAlignment,
  }: {
    newAlignment: "left" | "center" | "right" | "justify";
  }) => {
    commentsPaginatedCollectionDispatch({
      type: "SET_TEXT_ALIGNMENT",
      payload: { textAlignment: newAlignment },
    });
  };

  const handleCommentsPageChange = async ({
    nextPage,
  }: {
    nextPage: number;
  }) => {
    if (
      nextPage <
      commentsPaginatedCollectionState.commentsPaginatedCollection.length
    ) {
      commentsPaginatedCollectionDispatch({
        type: "SET_ACTIVE_COMMENTS_PAGE",
        payload: { newActiveCommentsPage: nextPage },
      });
      openSnackbar({
        severity: "success",
        title: "the active comments page has changed",
        body: `successfully changed active comment page to page: ${nextPage}`,
      });
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `failed to change the active comments page to page: ${nextPage}`,
        body: "new comments page exceeds the total number of comments",
      });
    }
  };

  const handleCommentsRowsPerPageChange = async ({
    commentsPerPage,
  }: {
    commentsPerPage: number;
  }) => {
    commentsPaginatedCollectionDispatch({
      type: "SET_COMMENTS_PER_PAGE",
      payload: {
        commentsPerPage,
      },
    });
    openSnackbar({
      severity: "success",
      title: "the number of comments per page has changed",
      body: `the number of comments per page has changed to ${commentsPerPage} comments per page`,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCommentAdd = async ({ content }: { content: string }) => {
    if (authState.user) {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });
      const createCommentResult = await createComment({
        gameName,
        body: content,
      });

      if (createCommentResult.comment !== null) {
        commentsPaginatedCollectionDispatch({
          type: "ADD_COMMENT",
          payload: { comment: createCommentResult.comment },
        });
        openSnackbar({
          severity: "success",
          title: "new comment added",
          body: `added comment with id: ${createCommentResult.comment.id}`,
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: `failed to add new comment`,
          body: "comment could not be added",
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
      }
    }
  };

  const handleCommentDelete = async ({
    comment,
    commentPage,
  }: {
    comment: CommentDetailsType;
    commentPage: number;
  }) => {
    if (authState.user && comment.author.id === authState.user.id) {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });

      const deleteCommentResult = await deleteComment({ id: comment.id });

      if (deleteCommentResult.status === 200) {
        commentsPaginatedCollectionDispatch({
          type: "DELETE_COMMENT",
          payload: { commentId: comment.id, commentPage },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "comment deleted",
          body: `successfully deleted comment with id: ${comment.id}`,
        });
      } else {
        ///////////////// notify user of an error
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `comment not deleted`,
          body: `could not delete comment with id: ${comment.id}`,
        });
      }
    }
  };

  const handleCommentUpdate = async ({
    comment,
    newContent,
    page,
  }: {
    comment: CommentDetailsType;
    newContent: string;
    page: number;
  }) => {
    if (authState.user && comment.author.id === authState.user.id) {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });

      const updateCommentResult = await updateComment({
        id: comment.id,
        body: newContent,
      });

      if (updateCommentResult.comment && updateCommentResult.status === 200) {
        commentsPaginatedCollectionDispatch({
          type: "UPDATE_COMMENT",
          payload: { comment: updateCommentResult.comment, page },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "comment updated",
          body: `successfully updated comment with id: ${comment.id}`,
        });
      } else {
        ///////////////// notify user of an error
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `comment not updated`,
          body: `could not update comment with id: ${comment.id}`,
        });
      }
    }
  };

  const handleSetActiveComment = (
    args: {
      commentId: string;
      type: "Editing" | "Replying";
    } | null
  ) => {
    if (args) {
      const { commentId, type } = args;
      commentsPaginatedCollectionDispatch({
        type: "SET_ACTIVE_COMMENT",
        payload: { commentId, type },
      });
    } else {
      commentsPaginatedCollectionDispatch({
        type: "SET_ACTIVE_COMMENT",
        payload: null,
      });
    }
  };

  return {
    commentsPaginatedCollectionState,
    handleCommentAdd,
    handleCommentDelete,
    handleCommentUpdate,
    handleCommentsPageChange,
    handleCommentsRowsPerPageChange,
    handleSetActiveComment,
    handleTextAlignmentChange,
  };
};

export default useCommentsPaginatedCollection;

export type UseCommentsPaginatedCollectionResultType = {
  commentsPaginatedCollectionState: CommentsPaginatedCollectionStateType;
  handleCommentAdd: handleCommentAddType;
  handleCommentDelete: handleCommentDeleteType;
  handleCommentUpdate: handleCommentUpdateType;
  handleCommentsPageChange: handleCommentsPageChangeType;
  handleCommentsRowsPerPageChange: handleCommentsRowsPerPageChangeType;
  handleSetActiveComment: handleSetActiveCommentType;
  handleTextAlignmentChange: handleTextAlignmentChangeType;
};

export type handleCommentAddType = ({
  content,
}: {
  content: string;
}) => Promise<void>;

export type handleCommentDeleteType = ({
  comment,
  commentPage,
}: {
  comment: CommentDetailsType;
  commentPage: number;
}) => Promise<void>;

export type handleCommentUpdateType = ({
  comment,
  newContent,
  page,
}: {
  comment: CommentDetailsType;
  newContent: string;
  page: number;
}) => Promise<void>;

export type handleCommentsPageChangeType = ({
  nextPage,
}: {
  nextPage: number;
}) => Promise<void>;

export type handleCommentsRowsPerPageChangeType = ({
  commentsPerPage,
}: {
  commentsPerPage: number;
}) => Promise<void>;

export type handleSetActiveCommentType = (
  args: {
    commentId: string;
    type: "Editing" | "Replying";
  } | null
) => void;

export type handleTextAlignmentChangeType = ({
  newAlignment,
}: {
  newAlignment: "left" | "center" | "right" | "justify";
}) => void;
