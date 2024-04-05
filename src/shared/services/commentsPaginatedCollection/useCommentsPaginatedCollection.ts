import { useContext, useEffect, useReducer, useRef } from "react";

import useCommentsAPIFacade, {
  type DeleteCommentResultType,
  type GetCommentsResultType,
} from "../api/useCommentsAPIFacade";
import {
  commentsPaginatedCollectionReducer,
  commentsPaginatedCollectionInitialState,
  type CommentsPaginatedCollectionStateType,
} from "./commentsPaginatedCollectionReducer";
import { AccountContext, type AuthStateType } from "../account/AccountContext";
import { calculateNumberOfPages } from "../../utils";
import { NotificationContext } from "../snackbars/NotificationsContext";
import {
  type CommentDetailsType,
  type GameNameType,
} from "../../models/internalAppRepresentation/resources";

export type UseCommentsPaginatedCollectionResultType = {
  commentsPaginatedCollectionState: CommentsPaginatedCollectionStateType;
  handleCommentAdd: handleCommentAddType;
  handleCommentDelete: handleCommentDeleteType;
  handleCommentUpdate: handleCommentUpdateType;
  handleCommentsPageChange: handleCommentsPageChangeType;
  handleCommentsRowsPerPageChange: handleCommentsRowsPerPageChangeType;
  handleSetActiveComment: handleSetActiveCommentType;
  handleTextAlignmentChange: handleTextAlignmentChangeType;
  refreshActivePage: () => void;
  authState: AuthStateType;
};

export type handleCommentAddType = ({
  content,
  gameName,
}: {
  content: string;
  gameName: GameNameType;
}) => Promise<void>;

export type handleCommentDeleteType = ({
  comment,
  commentPage,
}: {
  comment: CommentDetailsType;
  commentPage: number;
}) => Promise<DeleteCommentResultType>;

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
  newCommentsPerPage,
}: {
  newCommentsPerPage: number;
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

// Discriminated Union- use property to discriminate between union members. If you use a type guard style check (==, ===, !=, !==) or switch on the discriminant property TypeScript will realize that the object must be of the type that has that specific literal and do a type narrowing for you, here we have a member collectionType that exists on both union members and is of a particular literal type
type Props =
  | {
      collectionType: "USER_COMMENTS";
      authorId: string;
    }
  | {
      collectionType: "GAME_COMMENTS";
      gameName: string;
    };

const useCommentsPaginatedCollection = (
  props: Props
): UseCommentsPaginatedCollectionResultType => {
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

  const {
    createComment,
    deleteComment,
    getCommentsByAuthor,
    getCommentsByGameName,
    updateComment,
  } = useCommentsAPIFacade();

  useEffect(() => {
    const fetchComments = async () => {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });

      const getCommentsResult = await getComments();

      if (
        getCommentsResult.status >= 200 &&
        getCommentsResult.status < 300 &&
        getCommentsResult.comments !== null
      ) {
        commentsPaginatedCollectionDispatch({
          type: "ADD_COMMENTS",
          payload: {
            comments: getCommentsResult.comments,
            commentsPage: commentsPaginatedCollectionState.commentsActivePage,
            totalNumberOfAllComments: getCommentsResult.totalElements,
          },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
      } else {
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
      }
    };

    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.collectionType]);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        const commentsPaginatedCollectionLength =
          commentsPaginatedCollectionState.commentsPaginatedCollection.length;
        if (
          commentsPaginatedCollectionState.commentsActivePage ===
            commentsPaginatedCollectionLength - 1 ||
          (commentsPaginatedCollectionState.commentsActivePage <
            commentsPaginatedCollectionLength - 1 &&
            commentsPaginatedCollectionState.commentsPaginatedCollection[
              commentsPaginatedCollectionState.commentsActivePage
            ].length < commentsPaginatedCollectionState.commentsPerPage)
        ) {
          commentsPaginatedCollectionDispatch({
            type: "SET_COMMENTS_STATUS",
            payload: { newStatus: "LOADING" },
          });
          const getCommentsResult = await getComments();
          if (
            getCommentsResult.status >= 200 &&
            getCommentsResult.status < 300 &&
            getCommentsResult.comments !== null
          ) {
            if (
              commentsPaginatedCollectionState.commentsActivePage <
              calculateNumberOfPages({
                perPage: commentsPaginatedCollectionState.commentsPerPage,
                totalNumberOfEntities: getCommentsResult.totalElements,
              })
            ) {
              commentsPaginatedCollectionDispatch({
                type: "ADD_COMMENTS",
                payload: {
                  comments: getCommentsResult.comments,
                  commentsPage:
                    commentsPaginatedCollectionState.commentsActivePage,
                  totalNumberOfAllComments: getCommentsResult.totalElements,
                },
              });
            } else {
              commentsPaginatedCollectionDispatch({
                type: "SET_ACTIVE_COMMENTS_PAGE",
                payload: { newActiveCommentsPage: 0 },
              });
              openSnackbar({
                severity: "info",
                title:
                  "The active comments page exceeds the total number of comments",
                body: "Page 1 is set",
              });
            }
            commentsPaginatedCollectionDispatch({
              type: "SET_COMMENTS_STATUS",
              payload: { newStatus: "READY" },
            });
          } else {
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
    // properties that are primitives
    commentsPaginatedCollectionState.commentsActivePage,
    commentsPaginatedCollectionState.commentsPerPage,
  ]);

  const getComments = async (): GetCommentsResultType => {
    if (props.collectionType === "GAME_COMMENTS") {
      const getCommentsResultType = await getCommentsByGameName({
        gameName: props.gameName,
        pageNumber: commentsPaginatedCollectionState.commentsActivePage,
        pageSize: commentsPaginatedCollectionState.commentsPerPage,
        orderDirection: "Asc",
        sortBy: "id",
      });
      return getCommentsResultType;
    } else {
      const getCommentsResultType = await getCommentsByAuthor({
        authorId: props.authorId,
        pageNumber: commentsPaginatedCollectionState.commentsActivePage,
        pageSize: commentsPaginatedCollectionState.commentsPerPage,
        orderDirection: "Asc",
        sortBy: "id",
      });
      return getCommentsResultType;
    }
  };

  const refreshActivePage = async () => {
    commentsPaginatedCollectionDispatch({
      type: "SET_COMMENTS_STATUS",
      payload: { newStatus: "LOADING" },
    });
    const getCommentsResult = await getComments();
    if (
      getCommentsResult.status >= 200 &&
      getCommentsResult.status < 300 &&
      getCommentsResult.comments !== null
    ) {
      if (
        commentsPaginatedCollectionState.commentsActivePage <
        calculateNumberOfPages({
          perPage: commentsPaginatedCollectionState.commentsPerPage,
          totalNumberOfEntities: getCommentsResult.totalElements,
        })
      ) {
        commentsPaginatedCollectionDispatch({
          type: "ADD_COMMENTS",
          payload: {
            comments: getCommentsResult.comments,
            commentsPage: commentsPaginatedCollectionState.commentsActivePage,
            totalNumberOfAllComments: getCommentsResult.totalElements,
          },
        });
      } else {
        commentsPaginatedCollectionDispatch({
          type: "SET_ACTIVE_COMMENTS_PAGE",
          payload: { newActiveCommentsPage: 0 },
        });
        openSnackbar({
          severity: "info",
          title:
            "The active comments page exceeds the total number of comments",
          body: "Page 1 is set",
        });
      }
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "READY" },
      });
    } else {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "ERROR" },
      });
    }
  };

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
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `Failed to change the active comments page to page: ${
          nextPage + 1
        }`,
        body: "Requested comments page exceeds the total number of comments",
      });
    }
  };

  const handleCommentsRowsPerPageChange = async ({
    newCommentsPerPage,
  }: {
    newCommentsPerPage: number;
  }) => {
    const prevCommentsPerPage =
      commentsPaginatedCollectionState.commentsPerPage;
    commentsPaginatedCollectionDispatch({
      type: "SET_COMMENTS_PER_PAGE",
      payload: {
        newCommentsPerPage,
        prevCommentsPerPage,
      },
    });
  };

  const handleCommentAdd = async ({
    content,
    gameName,
  }: {
    content: string;
    gameName: GameNameType;
  }) => {
    if (authState.user) {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });
      const createCommentResult = await createComment({
        gameName,
        body: content,
      });
      if (
        createCommentResult.status >= 200 &&
        createCommentResult.status < 300 &&
        createCommentResult.comment !== null
      ) {
        commentsPaginatedCollectionDispatch({
          type: "ADD_COMMENT",
          payload: {
            comment: createCommentResult.comment,
          },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
      } else {
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
      }
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `Lack of sufficient permissions`,
        body: `Failed to add new comment to the collection`,
      });
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "ERROR" },
      });
    }
  };

  const handleCommentDelete = async ({
    comment,
    commentPage,
  }: {
    comment: CommentDetailsType;
    commentPage: number;
  }): Promise<DeleteCommentResultType> => {
    if (authState.user && comment.author.id === authState.user.id) {
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "LOADING" },
      });
      const deleteCommentResult = await deleteComment({ id: comment.id });
      if (
        deleteCommentResult.status >= 200 &&
        deleteCommentResult.status < 300
      ) {
        commentsPaginatedCollectionDispatch({
          type: "DELETE_COMMENT",
          payload: { commentId: comment.id, commentPage },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
        return deleteCommentResult;
      } else {
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
        return deleteCommentResult;
      }
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `Comment could not be removed from the collection`,
        body: `Could not remove comment with id: ${comment.id}, lack of sufficient permissions`,
      });
      return {
        status: 403,
        message: "Lack of sufficient permissions",
      };
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
        newCommentBody: newContent,
      });
      if (
        updateCommentResult.status >= 200 &&
        updateCommentResult.status < 300 &&
        updateCommentResult.comment !== null
      ) {
        commentsPaginatedCollectionDispatch({
          type: "UPDATE_COMMENT",
          payload: { comment: updateCommentResult.comment, page },
        });
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "READY" },
        });
      } else {
        commentsPaginatedCollectionDispatch({
          type: "SET_COMMENTS_STATUS",
          payload: { newStatus: "ERROR" },
        });
      }
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `Comment collection has not been modified`,
        body: `Could not update comment with id: ${comment.id}, lack of sufficient permissions`,
      });
      commentsPaginatedCollectionDispatch({
        type: "SET_COMMENTS_STATUS",
        payload: { newStatus: "ERROR" },
      });
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
    refreshActivePage,
    authState,
  };
};

export default useCommentsPaginatedCollection;
