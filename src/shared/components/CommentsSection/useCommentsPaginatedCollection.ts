import { useContext, useEffect, useReducer, useRef } from "react";

import useCommentsAPIFacade, {
  CommentDetailsType,
} from "../../hooks/useCommentsAPIFacade";
import {
  commentsPaginatedCollectionReducer,
  commentsPaginatedCollectionInitialState,
} from "./commentsPaginatedCollectionReducer";
import { AuthContext } from "../../context/AuthContext";
import { calculateNumberOfPages } from "../../utils";

type Props = { gameName: string };

const useCommentsPaginatedCollection = ({ gameName }: Props) => {
  const { authState } = useContext(AuthContext);

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
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: true },
      });

      const getCommentsResultType = await getComments({
        gameName,
        page: commentsPaginatedCollectionState.commentsCurrentPage,
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
      } else {
        ///////////////// notify user of an error
      }

      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: false },
      });
    };

    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameName]);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        const currentCommentsPage =
          commentsPaginatedCollectionState.commentsCurrentPage;

        const commentsPaginatedCollectionLength =
          commentsPaginatedCollectionState.commentsPaginatedCollection.length;

        const commentsPerPage =
          commentsPaginatedCollectionState.commentsPerPage;

        if (
          currentCommentsPage < commentsPaginatedCollectionLength - 1 &&
          commentsPaginatedCollectionState.commentsPaginatedCollection[
            currentCommentsPage
          ].length < commentsPerPage
        ) {
          commentsPaginatedCollectionDispatch({
            type: "SET_COMMENTS_LOADING",
            payload: { areCommentsLoading: true },
          });

          const getCommentsResult = await getComments({
            gameName,
            page: currentCommentsPage,
            perPage: commentsPerPage,
          });
          if (
            getCommentsResult.comments !== null &&
            getCommentsResult.totalNumberOfComments !== null
          ) {
            if (
              currentCommentsPage <
              calculateNumberOfPages({
                perPage: currentCommentsPage,
                totalNumberOfEntities: getCommentsResult.totalNumberOfComments,
              })
            ) {
              commentsPaginatedCollectionDispatch({
                type: "ADD_COMMENTS",
                payload: {
                  comments: getCommentsResult.comments,
                  commentsPage: currentCommentsPage,
                  totalNumberOfAllComments:
                    getCommentsResult.totalNumberOfComments,
                },
              });
            } else {
              commentsPaginatedCollectionDispatch({
                type: "SET_CURRENT_COMMENTS_PAGE",
                payload: { currentCommentsPage: 0 },
              });
            }
          } else {
            ///////////////// notify user of an error
          }
          commentsPaginatedCollectionDispatch({
            type: "SET_COMMENTS_LOADING",
            payload: { areCommentsLoading: false },
          });
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
    commentsPaginatedCollectionState.commentsCurrentPage,
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
        type: "SET_CURRENT_COMMENTS_PAGE",
        payload: { currentCommentsPage: nextPage },
      });
    } else {
      ///////////////// notify user of an error
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
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCommentAdd = async ({ content }: { content: string }) => {
    if (authState.user) {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: true },
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
      } else {
        ///////////////// notify user of an error
      }

      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: false },
      });
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
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: true },
      });

      const deleteCommentResult = await deleteComment({ id: comment.id });

      if (deleteCommentResult.status === 200) {
        commentsPaginatedCollectionDispatch({
          type: "DELETE_COMMENT",
          payload: { commentId: comment.id, commentPage },
        });
      } else {
        ///////////////// notify user of an error
      }
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: false },
      });
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
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: true },
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
      } else {
        ///////////////// notify user of an error
      }
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_LOADING",
        payload: { areCommentsLoading: false },
      });
    }
  };

  const handleSetActiveComment = ({
    commentId,
    type,
  }: {
    commentId: string;
    type: "Editing" | "Replying";
  }) => {
    commentsPaginatedCollectionDispatch({
      type: "SET_ACTIVE_COMMENT",
      payload: { commentId, type },
    });
  };

  return {
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
