import { useContext, useEffect, useReducer, useRef } from "react";

import useRepliesAPIFacade, {
  type DeleteReplyResultType,
  type GetRepliesResultType,
} from "../api/useRepliesAPIFacade";
import {
  repliesPaginatedCollectionReducer,
  repliesPaginatedCollectionInitialState,
  type RepliesPaginatedCollectionStateType,
} from "./repliesPaginatedCollectionReducer";
import { AccountContext, type AuthStateType } from "../account/AccountContext";
import { calculateNumberOfPages } from "../../utils";
import { NotificationContext } from "../snackbars/NotificationsContext";
import { type ReplyDetailsType } from "../../models/internalAppRepresentation/resources";

export type UseRepliesPaginatedCollectionResultType = {
  repliesPaginatedCollectionState: RepliesPaginatedCollectionStateType;
  handleReplyAdd: handleReplyAddType;
  handleReplyDelete: handleReplyDeleteType;
  handleReplyUpdate: handleReplyUpdateType;
  handleRepliesPageChange: handleRepliesPageChangeType;
  handleRepliesRowsPerPageChange: handleRepliesRowsPerPageChangeType;
  handleSetActiveReply: handleSetActiveReplyType;
  handleTextAlignmentChange: handleTextAlignmentChangeType;
  refreshActivePage: () => void;
  authState: AuthStateType;
};

export type handleReplyAddType = ({
  content,
  parentCommentId,
}: {
  content: string;
  parentCommentId: string;
}) => Promise<void>;

export type handleReplyDeleteType = ({
  reply,
  replyPage,
}: {
  reply: ReplyDetailsType;
  replyPage: number;
}) => Promise<DeleteReplyResultType>;

export type handleReplyUpdateType = ({
  reply,
  newContent,
  page,
}: {
  reply: ReplyDetailsType;
  newContent: string;
  page: number;
}) => Promise<void>;

export type handleRepliesPageChangeType = ({
  nextPage,
}: {
  nextPage: number;
}) => Promise<void>;

export type handleRepliesRowsPerPageChangeType = ({
  newRepliesPerPage,
}: {
  newRepliesPerPage: number;
}) => Promise<void>;

export type handleSetActiveReplyType = (
  args: {
    replyId: string;
    type: "Editing";
  } | null
) => void;

export type handleTextAlignmentChangeType = ({
  newAlignment,
}: {
  newAlignment: "left" | "center" | "right" | "justify";
}) => void;

type Props =
  | {
      collectionType: "USER_REPLIES";
      authorId: string;
    }
  | {
      collectionType: "COMMENT_REPLIES";
      parentCommentId: string;
    };

const useRepliesPaginatedCollection = (
  props: Props
): UseRepliesPaginatedCollectionResultType => {
  const { authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);

  const isMounted = useRef(false);

  const [repliesPaginatedCollectionState, repliesPaginatedCollectionDispatch] =
    useReducer(
      repliesPaginatedCollectionReducer,
      repliesPaginatedCollectionInitialState
    );

  const {
    createReply,
    deleteReply,
    getRepliesByAuthor,
    getRepliesByParentComment,
    updateReply,
  } = useRepliesAPIFacade();

  useEffect(() => {
    const fetchReplies = async () => {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const getRepliesResult = await getReplies(props);

      if (
        getRepliesResult.status >= 200 &&
        getRepliesResult.status < 300 &&
        getRepliesResult.replies !== null
      ) {
        repliesPaginatedCollectionDispatch({
          type: "ADD_REPLIES",
          payload: {
            replies: getRepliesResult.replies,
            repliesPage: repliesPaginatedCollectionState.repliesActivePage,
            totalNumberOfAllReplies: getRepliesResult.totalElements,
          },
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "successfully performed operations",
          body: "replies section successfully populated",
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: "failed to perform operations",
          body: "failed to populate replies section",
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
      }
    };

    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.collectionType]);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        const repliesPaginatedCollectionLength =
          repliesPaginatedCollectionState.repliesPaginatedCollection.length;
        if (
          repliesPaginatedCollectionState.repliesActivePage <
            repliesPaginatedCollectionLength - 1 &&
          repliesPaginatedCollectionState.repliesPaginatedCollection[
            repliesPaginatedCollectionState.repliesActivePage
          ].length < repliesPaginatedCollectionState.repliesPerPage
        ) {
          repliesPaginatedCollectionDispatch({
            type: "SET_REPLIES_STATUS",
            payload: { newRepliesStatus: "LOADING" },
          });

          const getRepliesResult = await getReplies(props);
          if (
            getRepliesResult.status >= 200 &&
            getRepliesResult.status < 300 &&
            getRepliesResult.replies !== null
          ) {
            if (
              repliesPaginatedCollectionState.repliesActivePage <
              calculateNumberOfPages({
                perPage: repliesPaginatedCollectionState.repliesPerPage,
                totalNumberOfEntities: getRepliesResult.totalElements,
              })
            ) {
              repliesPaginatedCollectionDispatch({
                type: "ADD_REPLIES",
                payload: {
                  replies: getRepliesResult.replies,
                  repliesPage:
                    repliesPaginatedCollectionState.repliesActivePage,
                  totalNumberOfAllReplies: getRepliesResult.totalElements,
                },
              });
              openSnackbar({
                severity: "success",
                title: "successfully performed operations",
                body: "replies section successfully populated",
              });
            } else {
              repliesPaginatedCollectionDispatch({
                type: "SET_ACTIVE_REPLIES_PAGE",
                payload: { newActiveRepliesPage: 0 },
              });
              openSnackbar({
                severity: "info",
                title:
                  "the active replies page exceeds the total number of replies",
                body: "page 0 is set",
              });
            }
            repliesPaginatedCollectionDispatch({
              type: "SET_REPLIES_STATUS",
              payload: { newRepliesStatus: "READY" },
            });
          } else {
            ///////////////// notify user of an error
            openSnackbar({
              severity: "error",
              title: "failed to perform operations",
              body: "failed to populate replies section",
            });
            repliesPaginatedCollectionDispatch({
              type: "SET_REPLIES_STATUS",
              payload: { newRepliesStatus: "ERROR" },
            });
          }
        }
      })();
      // }
    } else {
      isMounted.current = true;
    }
    //   return () => {
    //     // this now gets called when the component unmounts
    //   };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // properties that are primitives
    repliesPaginatedCollectionState.repliesActivePage,
    repliesPaginatedCollectionState.repliesPerPage,
  ]);

  const getReplies = async (props: Props): GetRepliesResultType => {
    if (props.collectionType === "COMMENT_REPLIES") {
      const getRepliesResultType = await getRepliesByParentComment({
        parentCommentId: props.parentCommentId,
        pageNumber: repliesPaginatedCollectionState.repliesActivePage,
        pageSize: repliesPaginatedCollectionState.repliesPerPage,
        orderDirection: "Asc",
        sortBy: "id",
      });
      return getRepliesResultType;
    } else {
      const getRepliesResultType = await getRepliesByAuthor({
        authorId: props.authorId,
        pageNumber: repliesPaginatedCollectionState.repliesActivePage,
        pageSize: repliesPaginatedCollectionState.repliesPerPage,
        orderDirection: "Asc",
        sortBy: "id",
      });
      return getRepliesResultType;
    }
  };

  const refreshActivePage = async () => {
    repliesPaginatedCollectionDispatch({
      type: "SET_REPLIES_STATUS",
      payload: { newRepliesStatus: "LOADING" },
    });

    const getRepliesResult = await getReplies(props);
    if (
      getRepliesResult.status >= 200 &&
      getRepliesResult.status < 300 &&
      getRepliesResult.replies !== null
    ) {
      if (
        repliesPaginatedCollectionState.repliesActivePage <
        calculateNumberOfPages({
          perPage: repliesPaginatedCollectionState.repliesPerPage,
          totalNumberOfEntities: getRepliesResult.totalElements,
        })
      ) {
        repliesPaginatedCollectionDispatch({
          type: "ADD_REPLIES",
          payload: {
            replies: getRepliesResult.replies,
            repliesPage: repliesPaginatedCollectionState.repliesActivePage,
            totalNumberOfAllReplies: getRepliesResult.totalElements,
          },
        });
        openSnackbar({
          severity: "success",
          title: "Successfully performed operations",
          body: "Replies sections successfully populated",
        });
      } else {
        repliesPaginatedCollectionDispatch({
          type: "SET_ACTIVE_REPLIES_PAGE",
          payload: { newActiveRepliesPage: 0 },
        });
        openSnackbar({
          severity: "info",
          title: "The active replies page exceeds the total number of replies",
          body: "Page 0 is set",
        });
      }
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "READY" },
      });
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: "Failed to perform operations",
        body: "Failed to populate replies section",
      });
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "ERROR" },
      });
    }
  };

  const handleTextAlignmentChange = ({
    newAlignment,
  }: {
    newAlignment: "left" | "center" | "right" | "justify";
  }) => {
    repliesPaginatedCollectionDispatch({
      type: "SET_TEXT_ALIGNMENT",
      payload: { textAlignment: newAlignment },
    });
  };

  const handleRepliesPageChange = async ({
    nextPage,
  }: {
    nextPage: number;
  }) => {
    if (
      nextPage <
      repliesPaginatedCollectionState.repliesPaginatedCollection.length
    ) {
      // setRepliesActivePage(nextPage);
      repliesPaginatedCollectionDispatch({
        type: "SET_ACTIVE_REPLIES_PAGE",
        payload: { newActiveRepliesPage: nextPage },
      });
      openSnackbar({
        severity: "success",
        title: "The active replies page has changed",
        body: `Successfully changed active replies page to page: ${nextPage}`,
      });
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `Failed to change the active replies page to page: ${nextPage}`,
        body: "New replies page exceeds the total number of replies",
      });
    }
  };

  const handleRepliesRowsPerPageChange = async ({
    newRepliesPerPage,
  }: {
    newRepliesPerPage: number;
  }) => {
    const prevRepliesPerPage = repliesPaginatedCollectionState.repliesPerPage;

    if (
      repliesPaginatedCollectionState.repliesActivePage <
      calculateNumberOfPages({
        perPage: newRepliesPerPage,
        totalNumberOfEntities:
          repliesPaginatedCollectionState.totalNumberOfAllReplies,
      })
    ) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_PER_PAGE",
        payload: {
          newRepliesPerPage,
          prevRepliesPerPage,
        },
      });
      openSnackbar({
        severity: "success",
        title: "The number of replies per page has changed",
        body: `The number of replies per page has changed to ${newRepliesPerPage} replies per page`,
      });
    } else {
      repliesPaginatedCollectionDispatch({
        type: "SET_ACTIVE_REPLIES_PAGE",
        payload: { newActiveRepliesPage: 0 },
      });
      openSnackbar({
        severity: "info",
        title: "The active replies page exceeds the total number of replies",
        body: "Page 0 is set",
      });
    }
  };

  const handleReplyAdd = async ({
    content,
    parentCommentId,
  }: {
    content: string;
    parentCommentId: string;
  }) => {
    if (authState.user) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const createReplyResult = await createReply({
        body: content,
        parentCommentId,
      });

      if (
        createReplyResult.status >= 200 &&
        createReplyResult.status < 300 &&
        createReplyResult.reply !== null
      ) {
        repliesPaginatedCollectionDispatch({
          type: "ADD_REPLY",
          payload: {
            reply: createReplyResult.reply,
          },
        });
        openSnackbar({
          severity: "success",
          title: "New reply added to the collection",
          body: `Added reply with id: ${createReplyResult.reply.id}`,
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "READY" },
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: `Failed to add new reply`,
          body: "Reply could not be added to the collection",
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
      }
    } else {
      openSnackbar({
        severity: "error",
        title: `Failed to add a new reply to the collection`,
        body: `Lack of sufficient permissions`,
      });
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "ERROR" },
      });
    }
  };

  const handleReplyDelete = async ({
    reply,
    replyPage,
  }: {
    reply: ReplyDetailsType;
    replyPage: number;
  }): Promise<DeleteReplyResultType> => {
    if (authState.user && reply.author.id === authState.user.id) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const deleteReplyResult = await deleteReply(reply);

      if (deleteReplyResult.status >= 200 && deleteReplyResult.status < 300) {
        repliesPaginatedCollectionDispatch({
          type: "DELETE_REPLY",
          payload: { replyId: reply.id, replyPage },
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "Reply removed from the collection",
          body: `Successfully removed reply with id: ${reply.id}`,
        });
        return deleteReplyResult;
      } else {
        ///////////////// notify user of an error
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `Reply could not be removed from the collection`,
          body: `Could not remove reply with id: ${reply.id}`,
        });
        return deleteReplyResult;
      }
    } else {
      openSnackbar({
        severity: "error",
        title: `Reply not removed from the collection`,
        body: `Could not remove reply with id: ${reply.id}, lack of sufficient permissions`,
      });
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "ERROR" },
      });
      return { message: "Lack of sufficient permissions", status: 403 };
    }
  };

  const handleReplyUpdate = async ({
    reply,
    newContent,
    page,
  }: {
    reply: ReplyDetailsType;
    newContent: string;
    page: number;
  }) => {
    if (authState.user && reply.author.id === authState.user.id) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const updateReplyResult = await updateReply({
        currentReplyDetails: reply,
        newReplyBody: newContent,
      });

      if (
        updateReplyResult.status >= 200 &&
        updateReplyResult.status < 300 &&
        updateReplyResult.reply !== null
      ) {
        repliesPaginatedCollectionDispatch({
          type: "UPDATE_REPLY",
          payload: { reply: updateReplyResult.reply, replyPage: page },
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "Reply updated",
          body: `Successfully updated reply with id: ${reply.id}`,
        });
      } else {
        ///////////////// notify user of an error
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `Replies collection has not been modified`,
          body: `Could not update reply with id: ${reply.id}`,
        });
      }
    } else {
      openSnackbar({
        severity: "error",
        title: `Replies collection has not been modified`,
        body: `Could not update reply with id: ${reply.id}, lack of sufficient permissions`,
      });
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "ERROR" },
      });
    }
  };

  const handleSetActiveReply = (
    args: {
      replyId: string;
      type: "Editing";
    } | null
  ) => {
    if (args) {
      const { replyId, type } = args;
      repliesPaginatedCollectionDispatch({
        type: "SET_ACTIVE_REPLY",
        payload: { replyId, type },
      });
    } else {
      repliesPaginatedCollectionDispatch({
        type: "SET_ACTIVE_REPLY",
        payload: null,
      });
    }
  };

  return {
    repliesPaginatedCollectionState,
    handleReplyAdd,
    handleReplyDelete,
    handleReplyUpdate,
    handleRepliesPageChange,
    handleRepliesRowsPerPageChange,
    handleSetActiveReply,
    handleTextAlignmentChange,
    refreshActivePage,
    authState,
  };
};

export default useRepliesPaginatedCollection;
