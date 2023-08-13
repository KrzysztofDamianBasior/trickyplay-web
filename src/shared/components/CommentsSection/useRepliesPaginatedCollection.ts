import { useContext, useEffect, useReducer, useRef } from "react";

import useRepliesAPIFacade, {
  ReplyDetailsType,
} from "../../hooks/useRepliesAPIFacade";
import {
  repliesPaginatedCollectionReducer,
  repliesPaginatedCollectionInitialState,
} from "./repliesPaginatedCollectionReducer";
import { AuthContext } from "../../context/AuthContext";
import { calculateNumberOfPages } from "../../utils";

type Props = { gameName: string; parentCommentId: string };

const useRepliesPaginatedCollection = ({
  gameName,
  parentCommentId,
}: Props) => {
  const { authState } = useContext(AuthContext);

  const isMounted = useRef(false);

  const [repliesPaginatedCollectionState, repliesPaginatedCollectionDispatch] =
    useReducer(
      repliesPaginatedCollectionReducer,
      repliesPaginatedCollectionInitialState
    );

  const { createReply, deleteReply, getReplies, updateReply } =
    useRepliesAPIFacade();

  useEffect(() => {
    const fetchReplies = async () => {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: true },
      });

      const getRepliesResultType = await getReplies({
        gameName,
        page: repliesPaginatedCollectionInitialState.repliesCurrentPage,
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
      } else {
        ///////////////// notify user of an error
      }

      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: false },
      });
    };

    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameName, parentCommentId]);

  useEffect(() => {
    if (isMounted.current) {
      (async () => {
        const currentRepliesPage =
          repliesPaginatedCollectionState.repliesCurrentPage;

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
            type: "SET_REPLIES_LOADING",
            payload: { areRepliesLoading: true },
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
            } else {
              repliesPaginatedCollectionDispatch({
                type: "SET_CURRENT_REPLIES_PAGE",
                payload: { currentRepliesPage: 0 },
              });
            }
          } else {
            ///////////////// notify user of an error
          }
          repliesPaginatedCollectionDispatch({
            type: "SET_REPLIES_LOADING",
            payload: { areRepliesLoading: false },
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
    repliesPaginatedCollectionState.repliesCurrentPage,
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
        type: "SET_CURRENT_REPLIES_PAGE",
        payload: { currentRepliesPage: nextPage },
      });
    } else {
      ///////////////// notify user of an error
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
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleReplyAdd = async ({ content }: { content: string }) => {
    if (authState.user) {
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: true },
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
      } else {
        ///////////////// notify user of an error
      }

      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: false },
      });
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
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: true },
      });

      const deleteReplyResult = await deleteReply({ id: reply.id });

      if (deleteReplyResult.status === 200) {
        repliesPaginatedCollectionDispatch({
          type: "DELETE_REPLY",
          payload: { replyId: reply.id, replyPage },
        });
      } else {
        ///////////////// notify user of an error
      }
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: false },
      });
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
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: true },
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
      } else {
        ///////////////// notify user of an error
      }
      repliesPaginatedCollectionDispatch({
        type: "SET_REPLIES_LOADING",
        payload: { areRepliesLoading: false },
      });
    }
  };

  const handleSetActiveReply = ({
    replyId,
    type,
  }: {
    replyId: string;
    type: "Editing";
  }) => {
    repliesPaginatedCollectionDispatch({
      type: "SET_ACTIVE_REPLY",
      payload: { replyId, type },
    });
  };

  return {
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
