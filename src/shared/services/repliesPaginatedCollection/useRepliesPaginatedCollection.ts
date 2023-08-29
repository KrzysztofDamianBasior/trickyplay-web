import { useContext, useEffect, useReducer, useRef } from "react";

import useRepliesAPIFacade, {
  ReplyDetailsType,
} from "../api/useRepliesAPIFacade";
import {
  repliesPaginatedCollectionReducer,
  repliesPaginatedCollectionInitialState,
  RepliesPaginatedCollectionStateType,
} from "./repliesPaginatedCollectionReducer";
import { AccountContext } from "../account/AccountContext";
import { calculateNumberOfPages } from "../../utils";
import { NotificationContext } from "../snackbars/NotificationsContext";

type Props = {
  gameName: string;
  parentCommentId: string;
  userId: string | null;
};

const useRepliesPaginatedCollection = ({
  gameName,
  parentCommentId,
  userId = null,
}: Props): UseRepliesPaginatedCollectionResultType => {
  const { authState } = useContext(AccountContext);
  const { openSnackbar } = useContext(NotificationContext);

  const isMounted = useRef(false);

  const [repliesPaginatedCollectionState, repliesPaginatedCollectionDispatch] =
    useReducer(
      repliesPaginatedCollectionReducer,
      repliesPaginatedCollectionInitialState
    );

  const { createReply, deleteReply, getReplies, updateReply } =
    useRepliesAPIFacade({ userId });

  useEffect(() => {
    const fetchReplies = async () => {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const getRepliesResultType = await getReplies({
        gameName,
        page: repliesPaginatedCollectionInitialState.repliesActivePage,
        parentId: parentCommentId,
        perPage: repliesPaginatedCollectionInitialState.repliesPerPage,
      });

      if (
        getRepliesResultType.totalNumberOfReplies &&
        getRepliesResultType.replies
      ) {
        repliesPaginatedCollectionDispatch({
          type: "ADD_REPLIES",
          payload: {
            replies: getRepliesResultType.replies,
            repliesPage: 0,
            totalNumberOfAllReplies: getRepliesResultType.totalNumberOfReplies,
          },
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "READY" },
        });
        openSnackbar({
          severity: "success",
          title: "successfully fetch replies",
          body: "replies section successfully populated",
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: "failed to fetch replies",
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
  }, [gameName, parentCommentId]);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        const currentRepliesPage =
          repliesPaginatedCollectionState.repliesActivePage;

        const repliesPaginatedCollectionLength =
          repliesPaginatedCollectionState.repliesPaginatedCollection.length;

        const repliesPerPage = repliesPaginatedCollectionState.repliesPerPage;

        if (
          currentRepliesPage < repliesPaginatedCollectionLength - 1 &&
          repliesPaginatedCollectionState.repliesPaginatedCollection[
            currentRepliesPage
          ].length < repliesPerPage
        ) {
          repliesPaginatedCollectionDispatch({
            type: "SET_REPLIES_STATUS",
            payload: { newRepliesStatus: "LOADING" },
          });

          const getRepliesResult = await getReplies({
            parentId: parentCommentId,
            gameName,
            page: currentRepliesPage,
            perPage: repliesPerPage,
          });
          if (
            getRepliesResult.replies !== null &&
            getRepliesResult.totalNumberOfReplies !== null
          ) {
            if (
              currentRepliesPage <
              calculateNumberOfPages({
                perPage: currentRepliesPage,
                totalNumberOfEntities: getRepliesResult.totalNumberOfReplies,
              })
            ) {
              repliesPaginatedCollectionDispatch({
                type: "ADD_REPLIES",
                payload: {
                  replies: getRepliesResult.replies,
                  repliesPage: currentRepliesPage,
                  totalNumberOfAllReplies:
                    getRepliesResult.totalNumberOfReplies,
                },
              });
              openSnackbar({
                severity: "success",
                title: "successfully fetch replies",
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
              title: "failed to fetch replies",
              body: "failed to populate replies section",
            });
            repliesPaginatedCollectionDispatch({
              type: "SET_REPLIES_STATUS",
              payload: { newRepliesStatus: "ERROR" },
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
    repliesPaginatedCollectionState.repliesActivePage,
    repliesPaginatedCollectionState.repliesPerPage,
  ]);

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
      repliesPaginatedCollectionDispatch({
        type: "SET_ACTIVE_REPLIES_PAGE",
        payload: { newActiveRepliesPage: nextPage },
      });
      openSnackbar({
        severity: "success",
        title: "the active replies page has changed",
        body: `successfully changed active replies page to page: ${nextPage}`,
      });
    } else {
      ///////////////// notify user of an error
      openSnackbar({
        severity: "error",
        title: `failed to change the active replies page to page: ${nextPage}`,
        body: "newreplies page exceeds the total number of replies",
      });
    }
  };

  const handleRepliesRowsPerPageChange = async ({
    repliesPerPage,
  }: {
    repliesPerPage: number;
  }) => {
    repliesPaginatedCollectionDispatch({
      type: "SET_REPLIES_PER_PAGE",
      payload: {
        repliesPerPage,
      },
    });
    openSnackbar({
      severity: "success",
      title: "the number of replies per page has changed",
      body: `the number of replies per page has changed to ${repliesPerPage} replies per page`,
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleReplyAdd = async ({ content }: { content: string }) => {
    if (authState.user) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const createReplyResult = await createReply({
        body: content,
        parentId: parentCommentId,
      });

      if (createReplyResult.reply !== null) {
        repliesPaginatedCollectionDispatch({
          type: "ADD_REPLY",
          payload: { reply: createReplyResult.reply },
        });
        openSnackbar({
          severity: "success",
          title: "new reply added",
          body: `added reply with id: ${createReplyResult.reply.id}`,
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "READY" },
        });
      } else {
        ///////////////// notify user of an error
        openSnackbar({
          severity: "error",
          title: `failed to add new reply`,
          body: "reply could not be added",
        });
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
      }
    }
  };

  const handleReplyDelete = async ({
    reply,
    replyPage,
  }: {
    reply: ReplyDetailsType;
    replyPage: number;
  }) => {
    if (authState.user && reply.author.id === authState.user.id) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_STATUS",
        payload: { newRepliesStatus: "LOADING" },
      });

      const deleteReplyResult = await deleteReply({ id: reply.id });

      if (deleteReplyResult.status === 200) {
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
          title: "reply deleted",
          body: `successfully deleted reply with id: ${reply.id}`,
        });
      } else {
        ///////////////// notify user of an error
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `reply not deleted`,
          body: `could not delete reply with id: ${reply.id}`,
        });
      }
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
        id: reply.id,
        body: newContent,
      });

      if (updateReplyResult.reply && updateReplyResult.status === 200) {
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
          title: "comment updated",
          body: `successfully updated comment with id: ${reply.id}`,
        });
      } else {
        ///////////////// notify user of an error
        repliesPaginatedCollectionDispatch({
          type: "SET_REPLIES_STATUS",
          payload: { newRepliesStatus: "ERROR" },
        });
        openSnackbar({
          severity: "error",
          title: `comment not updated`,
          body: `could not update comment with id: ${reply.id}`,
        });
      }
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
  };
};

export default useRepliesPaginatedCollection;

export type UseRepliesPaginatedCollectionResultType = {
  repliesPaginatedCollectionState: RepliesPaginatedCollectionStateType;
  handleReplyAdd: handleReplyAddType;
  handleReplyDelete: handleReplyDeleteType;
  handleReplyUpdate: handleReplyUpdateType;
  handleRepliesPageChange: handleRepliesPageChangeType;
  handleRepliesRowsPerPageChange: handleRepliesRowsPerPageChangeType;
  handleSetActiveReply: handleSetActiveReplyType;
  handleTextAlignmentChange: handleTextAlignmentChangeType;
};

export type handleReplyAddType = ({
  content,
}: {
  content: string;
}) => Promise<void>;

export type handleReplyDeleteType = ({
  reply,
  replyPage,
}: {
  reply: ReplyDetailsType;
  replyPage: number;
}) => Promise<void>;

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
  repliesPerPage,
}: {
  repliesPerPage: number;
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
