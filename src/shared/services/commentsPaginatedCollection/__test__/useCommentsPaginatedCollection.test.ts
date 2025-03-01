import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import useCommentsPaginatedCollection from "../useCommentsPaginatedCollection";
import {
  type ActiveCommentDetailsType,
  commentsPaginatedCollectionInitialState,
} from "../commentsPaginatedCollectionReducer";
import { calculateNumberOfPages } from "../../../utils";

import notificationContextAndSigningAccountContextWrapperCreator from "../../__tests__/beds/notificationContextAndSigningAccountContextWrapperCreator";
import {
  commentsCollectionStub,
  userSnakeCommentsCollectionStub,
} from "../../../../__tests__/msw/stubs/comments";
import { password, userName } from "../../../../__tests__/msw/stubs/users";

describe("useCommentsPaginatedCollection hook behavior for happy paths (optimistic network behavior)", () => {
  it("should correctly set the initial state of the commentsPaginatedCollection", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const numberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;

    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(numberOfSnakeComments);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsActivePage);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: numberOfSnakeComments,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      commentsPaginatedCollectionInitialState.commentsPerPage <
        numberOfSnakeComments
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : numberOfSnakeComments
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsPerPage);
    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual(commentsPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set commentsPaginatedCollectionState when handleCommentAdd is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const prevNumberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;

    await act(async () => {
      result.current.handleCommentAdd({
        gameName: "Snake",
        content: "comment content",
      });
    });

    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(prevNumberOfSnakeComments + 1);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsActivePage);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: prevNumberOfSnakeComments + 1,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      commentsPaginatedCollectionInitialState.commentsPerPage <
        prevNumberOfSnakeComments + 1
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : prevNumberOfSnakeComments + 1
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsPerPage);
  });

  it("should correctly set commentsPaginatedCollectionState when handleCommentDelete is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const prevNumberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;

    await act(async () => {
      result.current.handleCommentDelete({
        comment: {
          ...userSnakeCommentsCollectionStub[0],
          author: {
            ...userSnakeCommentsCollectionStub[0].author,
            id: userSnakeCommentsCollectionStub[0].author.id.toString(),
          },
          id: userSnakeCommentsCollectionStub[0].id.toString(),
          gameName: "Snake",
        },
        commentPage: 0,
      });
    });

    await waitFor(() => {
      expect(
        result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
      ).toEqual(prevNumberOfSnakeComments - 1);
    });
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsActivePage);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: prevNumberOfSnakeComments - 1,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      commentsPaginatedCollectionInitialState.commentsPerPage <
        prevNumberOfSnakeComments - 1
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : prevNumberOfSnakeComments - 1
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsPerPage);
  });

  it("should correctly set commentsPaginatedCollectionState when handleCommentUpdate is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const numberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;

    await act(async () => {
      result.current.handleCommentUpdate({
        page: 0,
        comment: {
          ...userSnakeCommentsCollectionStub[0],
          author: {
            ...userSnakeCommentsCollectionStub[0].author,
            id: userSnakeCommentsCollectionStub[0].author.id.toString(),
          },
          id: userSnakeCommentsCollectionStub[0].id.toString(),
          gameName: "Snake",
        },
        newContent: "new comment body",
      });
    });

    await waitFor(() => {
      expect(
        result.current.commentsPaginatedCollectionState.commentsPaginatedCollection[0].find(
          (comm) => comm.id.toString() === "1"
        )?.body
      ).toEqual("new comment body");
    });

    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(numberOfSnakeComments);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsActivePage);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: numberOfSnakeComments,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      commentsPaginatedCollectionInitialState.commentsPerPage <
        numberOfSnakeComments
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : numberOfSnakeComments
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsPerPage);
    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual(commentsPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set commentsPaginatedCollectionState when handleCommentsPageChange is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleCommentsPageChange({
        nextPage: 5,
      });
    });

    const numberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;
    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(numberOfSnakeComments);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(0);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: numberOfSnakeComments,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      commentsPaginatedCollectionInitialState.commentsPerPage <
        numberOfSnakeComments
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : numberOfSnakeComments
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsPerPage);
    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual(commentsPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set commentsPaginatedCollectionState when handleCommentsRowsPerPageChange is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleCommentsRowsPerPageChange({
        newCommentsPerPage: 1,
      });
    });

    const numberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;

    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(numberOfSnakeComments);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(0);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: 1,
        totalNumberOfEntities: numberOfSnakeComments,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(1);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      result.current.commentsPaginatedCollectionState.commentsPerPage <
        numberOfSnakeComments
        ? result.current.commentsPaginatedCollectionState.commentsPerPage
        : numberOfSnakeComments
    );
    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual(commentsPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set commentsPaginatedCollectionState when handleSetActiveComment is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const activeComment: ActiveCommentDetailsType = {
      id: "1",
      type: "Editing",
    };

    await act(async () => {
      result.current.handleSetActiveComment({
        commentId: activeComment.id,
        type: activeComment.type,
      });
    });

    const numberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;
    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(numberOfSnakeComments);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsActivePage);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: numberOfSnakeComments,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      result.current.commentsPaginatedCollectionState.commentsPerPage <
        numberOfSnakeComments
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : numberOfSnakeComments
    );
    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual(commentsPaginatedCollectionInitialState.textAlignment);
  });

  it("should correctly set commentsPaginatedCollectionState when handleTextAlignmentChange is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.handleTextAlignmentChange({
        newAlignment: "center",
      });
    });

    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual("center");
  });

  it("should correctly set commentsPaginatedCollectionState when refreshActivePage is called", async () => {
    const { result } = renderHook(
      () =>
        useCommentsPaginatedCollection({
          collectionType: "GAME_COMMENTS",
          gameName: "Snake",
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

    expect(result.current.commentsPaginatedCollectionState).toEqual(
      commentsPaginatedCollectionInitialState
    );

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    await act(async () => {
      result.current.refreshActivePage();
    });

    await waitFor(() => {
      expect(result.current.commentsPaginatedCollectionState.status).toEqual(
        "READY"
      );
    });

    const numberOfSnakeComments = commentsCollectionStub.filter(
      (comm) => comm.gameName === "Snake"
    ).length;
    expect(
      result.current.commentsPaginatedCollectionState.totalNumberOfAllComments
    ).toEqual(numberOfSnakeComments);
    expect(
      result.current.commentsPaginatedCollectionState.activeComment
    ).toEqual(commentsPaginatedCollectionInitialState.activeComment);
    expect(
      result.current.commentsPaginatedCollectionState.commentsActivePage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsActivePage);
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection.length
    ).toEqual(
      calculateNumberOfPages({
        perPage: commentsPaginatedCollectionInitialState.commentsPerPage,
        totalNumberOfEntities: numberOfSnakeComments,
      })
    );
    expect(
      result.current.commentsPaginatedCollectionState
        .commentsPaginatedCollection[0].length
    ).toEqual(
      commentsPaginatedCollectionInitialState.commentsPerPage <
        numberOfSnakeComments
        ? commentsPaginatedCollectionInitialState.commentsPerPage
        : numberOfSnakeComments
    );
    expect(
      result.current.commentsPaginatedCollectionState.commentsPerPage
    ).toEqual(commentsPaginatedCollectionInitialState.commentsPerPage);
    expect(
      result.current.commentsPaginatedCollectionState.textAlignment
    ).toEqual(commentsPaginatedCollectionInitialState.textAlignment);
  });
});
