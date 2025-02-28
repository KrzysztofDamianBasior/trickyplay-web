import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, describe, test } from "vitest";

import useCommentsAPIFacade, {
  type CreateCommentProps,
} from "../useCommentsAPIFacade";

import notificationContextAndSigningAccountContextWrapperCreator from "../../__tests__/beds/notificationContextAndSigningAccountContextWrapperCreator";
import { password, userName } from "../../../../__tests__/msw/stubs/users";

describe("useCommentsAPIFacade hook behavior for happy paths (optimistic network behavior)", () => {
  test("createComment returns correct value", async () => {
    const { result } = renderHook(() => useCommentsAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    const newComment: CreateCommentProps = {
      body: "comment body",
      gameName: "Snake",
    };

    await act(async () => {
      const createCommentResult = await result.current.createComment(
        newComment
      );
      expect(createCommentResult.comment?.body).toEqual(newComment.body);
      expect(createCommentResult.comment?.gameName).toEqual(
        newComment.gameName
      );
    });
  });

  test("deleteComment returns correct value", async () => {
    const { result } = renderHook(() => useCommentsAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await act(async () => {
      const deleteCommentResult = await result.current.deleteComment({
        id: "1",
      });
      expect(deleteCommentResult.message).toEqual("Success");
      expect(deleteCommentResult.status).toEqual(200);
    });
  });

  test("getComment returns correct value", async () => {
    const { result } = renderHook(() => useCommentsAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await act(async () => {
      const getCommentResult = await result.current.getComment({
        id: "1",
      });
      expect(getCommentResult.message).toEqual("Success");
      expect(getCommentResult.status).toEqual(200);
      expect(getCommentResult.comment?.id).toEqual(1);
    });
  });

  test("getCommentsByAuthor returns correct value", async () => {
    const { result } = renderHook(() => useCommentsAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await act(async () => {
      const getCommentsByAuthorResult =
        await result.current.getCommentsByAuthor({
          authorId: "1",
          orderDirection: "Asc",
          pageNumber: 0,
          pageSize: 10,
          sortBy: "id",
        });
      expect(getCommentsByAuthorResult.message).toEqual("Success");
      expect(getCommentsByAuthorResult.status).toEqual(200);
      expect(getCommentsByAuthorResult.comments?.length).toBeGreaterThan(0);
    });
  });

  test("getCommentsByGameName returns correct value", async () => {
    const { result } = renderHook(() => useCommentsAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await act(async () => {
      const getCommentsByGameNameResult =
        await result.current.getCommentsByGameName({
          gameName: "Snake",
          orderDirection: "Asc",
          pageNumber: 0,
          pageSize: 10,
          sortBy: "id",
        });
      expect(getCommentsByGameNameResult.message).toEqual("Success");
      expect(getCommentsByGameNameResult.status).toEqual(200);
      expect(getCommentsByGameNameResult.comments?.length).toBeGreaterThan(0);
    });
  });

  test("updateComment returns correct value", async () => {
    const { result } = renderHook(() => useCommentsAPIFacade(), {
      wrapper: notificationContextAndSigningAccountContextWrapperCreator({
        isAuthenticated: true,
        userCredentials: {
          username: userName,
          password: password,
        },
      }),
    });

    await waitFor(() => {
      expect(result.current.authState.status).toEqual("LOGGED_IN");
    });

    await act(async () => {
      const updateCommentResult = await result.current.updateComment({
        id: "1",
        newCommentBody: "new comment body",
      });
      expect(updateCommentResult.message).toEqual("Success");
      expect(updateCommentResult.status).toEqual(200);
      expect(updateCommentResult.comment?.body).toEqual("new comment body");
      expect(updateCommentResult.comment?.id).toEqual(1);
    });
  });
});
