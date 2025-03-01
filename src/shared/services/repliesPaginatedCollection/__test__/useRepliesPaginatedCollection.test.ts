import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import { calculateNumberOfPages } from "../../../utils";
import useRepliesPaginatedCollection from "../useRepliesPaginatedCollection";
import {
  type ActiveReplyDetailsType,
  repliesPaginatedCollectionInitialState,
} from "../repliesPaginatedCollectionReducer";

import notificationContextAndSigningAccountContextWrapperCreator from "../../__tests__/beds/notificationContextAndSigningAccountContextWrapperCreator";
import {
  repliesCollectionStub,
  userRepliesCollectionStub,
} from "../../../../__tests__/msw/stubs/replies";
import { password, userName } from "../../../../__tests__/msw/stubs/users";
import { userSnakeCommentsCollectionStub } from "../../../../__tests__/msw/stubs/comments";

describe("useRepliesPaginatedCollection hook behavior for happy paths (optimistic network behavior)", () => {
  it("should correctly set the initial state of the repliesPaginatedCollection", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const repliesLength = repliesCollectionStub.filter(
      (repl) =>
        repl.parentComment.id.toString() ===
        userSnakeCommentsCollectionStub[0].id.toString()
    ).length;

    expect(
      result.current.repliesPaginatedCollectionState.totalNumberOfAllReplies
    ).toEqual(repliesLength);
    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      repliesPaginatedCollectionInitialState.activeReply
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesActivePage);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: repliesPaginatedCollectionInitialState.repliesPerPage,
        totalNumberOfEntities: repliesLength,
      })
    );
    expect(
      result.current.repliesPaginatedCollectionState
        .repliesPaginatedCollection[0].length
    ).toEqual(
      repliesPaginatedCollectionInitialState.repliesPerPage < repliesLength
        ? repliesPaginatedCollectionInitialState.repliesPerPage
        : repliesLength
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesPerPage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesPerPage);
    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual(repliesPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set repliesPaginatedCollectionState when handleReplyAdd is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const repliesLength = repliesCollectionStub.filter(
      (repl) =>
        repl.parentComment.id.toString() ===
        userSnakeCommentsCollectionStub[0].id.toString()
    ).length;
    await act(async () => {
      result.current.handleReplyAdd({
        content: "new reply content",
        parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
      });
    });

    expect(
      result.current.repliesPaginatedCollectionState.totalNumberOfAllReplies
    ).toEqual(repliesLength + 1);
    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      repliesPaginatedCollectionInitialState.activeReply
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesActivePage);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: repliesPaginatedCollectionInitialState.repliesPerPage,
        totalNumberOfEntities: repliesLength + 1,
      })
    );
    expect(
      result.current.repliesPaginatedCollectionState
        .repliesPaginatedCollection[0].length
    ).toEqual(
      repliesPaginatedCollectionInitialState.repliesPerPage < repliesLength + 1
        ? repliesPaginatedCollectionInitialState.repliesPerPage
        : repliesLength + 1
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesPerPage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesPerPage);
    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual(repliesPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set repliesPaginatedCollectionState when handleReplyDelete is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const repliesLength = repliesCollectionStub.filter(
      (repl) =>
        repl.parentComment.id.toString() ===
        userSnakeCommentsCollectionStub[0].id.toString()
    ).length;

    await act(async () => {
      result.current.handleReplyDelete({
        reply: {
          id: userRepliesCollectionStub[0].id.toString(),
          body: userRepliesCollectionStub[0].body,
          parentCommentId:
            userRepliesCollectionStub[0].parentComment.id.toString(),
          author: {
            ...userRepliesCollectionStub[0].author,
            id: userRepliesCollectionStub[0].author.id.toString(),
          },
          createdAt: userRepliesCollectionStub[0].createdAt,
          updatedAt: userRepliesCollectionStub[0].updatedAt,
        },
        replyPage: 0,
      });
    });

    await waitFor(() => {
      expect(
        result.current.repliesPaginatedCollectionState.totalNumberOfAllReplies
      ).toEqual(repliesLength - 1);
    });
    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      repliesPaginatedCollectionInitialState.activeReply
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesActivePage);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: repliesPaginatedCollectionInitialState.repliesPerPage,
        totalNumberOfEntities: repliesLength - 1,
      })
    );
    expect(
      result.current.repliesPaginatedCollectionState
        .repliesPaginatedCollection[0].length
    ).toEqual(
      repliesPaginatedCollectionInitialState.repliesPerPage < repliesLength - 1
        ? repliesPaginatedCollectionInitialState.repliesPerPage
        : repliesLength - 1
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesPerPage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesPerPage);
    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual(repliesPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set repliesPaginatedCollectionState when handleReplyUpdate is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const repliesLength = repliesCollectionStub.filter(
      (repl) =>
        repl.parentComment.id.toString() ===
        userSnakeCommentsCollectionStub[0].id.toString()
    ).length;

    await act(async () => {
      result.current.handleReplyUpdate({
        page: 0,
        reply: {
          id: userRepliesCollectionStub[0].id.toString(),
          body: userRepliesCollectionStub[0].body,
          parentCommentId:
            userRepliesCollectionStub[0].parentComment.id.toString(),
          author: {
            ...userRepliesCollectionStub[0].author,
            id: userRepliesCollectionStub[0].author.id.toString(),
          },
          createdAt: userRepliesCollectionStub[0].createdAt,
          updatedAt: userRepliesCollectionStub[0].updatedAt,
        },
        newContent: "new reply body",
      });
    });

    await waitFor(() => {
      expect(
        result.current.repliesPaginatedCollectionState.repliesPaginatedCollection[0].find(
          (repl) =>
            repl.id.toString() === userRepliesCollectionStub[0].id.toString()
        )?.body
      ).toEqual("new reply body");
    });
    expect(
      result.current.repliesPaginatedCollectionState.totalNumberOfAllReplies
    ).toEqual(repliesLength);
    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      repliesPaginatedCollectionInitialState.activeReply
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesActivePage);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: repliesPaginatedCollectionInitialState.repliesPerPage,
        totalNumberOfEntities: repliesLength,
      })
    );
    expect(
      result.current.repliesPaginatedCollectionState
        .repliesPaginatedCollection[0].length
    ).toEqual(
      repliesPaginatedCollectionInitialState.repliesPerPage < repliesLength
        ? repliesPaginatedCollectionInitialState.repliesPerPage
        : repliesLength
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesPerPage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesPerPage);
    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual(repliesPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set repliesPaginatedCollectionState when handleRepliesPageChange is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );
    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleRepliesPageChange({
        nextPage: 0,
      });
    });

    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(0);
  });

  it("should correctly set repliesPaginatedCollectionState when handleRepliesRowsPerPageChange is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleRepliesRowsPerPageChange({
        newRepliesPerPage: 1,
      });
    });

    const repliesLength = repliesCollectionStub.filter(
      (repl) =>
        repl.parentComment.id.toString() ===
        userSnakeCommentsCollectionStub[0].id.toString()
    ).length;
    expect(
      result.current.repliesPaginatedCollectionState.totalNumberOfAllReplies
    ).toEqual(repliesLength);
    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      repliesPaginatedCollectionInitialState.activeReply
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesActivePage);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: 1,
        totalNumberOfEntities: repliesLength,
      })
    );
    expect(
      result.current.repliesPaginatedCollectionState
        .repliesPaginatedCollection[0].length
    ).toEqual(1 < repliesLength ? 1 : repliesLength);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPerPage
    ).toEqual(1);
    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual(repliesPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set repliesPaginatedCollectionState when handleSetActiveReply is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const activeReply: ActiveReplyDetailsType = {
      replyId: "1",
      type: "Editing",
    };

    await act(async () => {
      result.current.handleSetActiveReply(activeReply);
    });

    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      activeReply
    );
  });

  it("should correctly set repliessPaginatedCollectionState when handleTextAlignmentChange is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleTextAlignmentChange({
        newAlignment: "center",
      });
    });

    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual("center");
  });

  it("should correctly set repliesPaginatedCollectionState when refreshActivePage is called", async () => {
    const { result } = renderHook(
      () =>
        useRepliesPaginatedCollection({
          collectionType: "COMMENT_REPLIES",
          parentCommentId: userSnakeCommentsCollectionStub[0].id.toString(),
        }),
      {
        wrapper: notificationContextAndSigningAccountContextWrapperCreator({
          isAuthenticated: true,
          userCredentials: {
            username: userName,
            password: password,
          },
        }),
      }
    );

    expect(result.current.repliesPaginatedCollectionState).toEqual(
      repliesPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.refreshActivePage();
    });

    await waitFor(() => {
      expect(result.current.repliesPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const repliesLength = repliesCollectionStub.filter(
      (repl) =>
        repl.parentComment.id.toString() ===
        userSnakeCommentsCollectionStub[0].id.toString()
    ).length;

    expect(
      result.current.repliesPaginatedCollectionState.totalNumberOfAllReplies
    ).toEqual(repliesLength);
    expect(result.current.repliesPaginatedCollectionState.activeReply).toEqual(
      repliesPaginatedCollectionInitialState.activeReply
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesActivePage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesActivePage);
    expect(
      result.current.repliesPaginatedCollectionState.repliesPaginatedCollection
        .length
    ).toEqual(
      calculateNumberOfPages({
        perPage: repliesPaginatedCollectionInitialState.repliesPerPage,
        totalNumberOfEntities: repliesLength,
      })
    );
    expect(
      result.current.repliesPaginatedCollectionState
        .repliesPaginatedCollection[0].length
    ).toEqual(
      repliesPaginatedCollectionInitialState.repliesPerPage < repliesLength
        ? repliesPaginatedCollectionInitialState.repliesPerPage
        : repliesLength
    );
    expect(
      result.current.repliesPaginatedCollectionState.repliesPerPage
    ).toEqual(repliesPaginatedCollectionInitialState.repliesPerPage);
    expect(
      result.current.repliesPaginatedCollectionState.textAlignment
    ).toEqual(repliesPaginatedCollectionInitialState.textAlignment);
  });
});
