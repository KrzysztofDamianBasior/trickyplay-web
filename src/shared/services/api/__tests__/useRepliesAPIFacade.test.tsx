import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, describe, test } from "vitest";

import useRepliesAPIFacade, { CreateReplyProps } from "../useRepliesAPIFacade";
import { ReplyDetailsType } from "../../../models/internalAppRepresentation/resources";

import notificationContextAndSigningAccountContextWrapperCreator from "../../__tests__/beds/notificationContextAndSigningAccountContextWrapperCreator";
import { password, userName } from "../../../../__tests__/msw/stubs/users";

describe("useRepliesAPIFacade hook behavior for happy paths (optimistic network behavior)", () => {
  test("createReply returns correct value", async () => {
    const { result } = renderHook(() => useRepliesAPIFacade(), {
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

    const newReply: CreateReplyProps = {
      body: "reply body",
      parentCommentId: "1",
    };

    await act(async () => {
      const createReplyResult = await result.current.createReply(newReply);
      expect(createReplyResult.reply?.body).toEqual(newReply.body);
      expect(createReplyResult.reply?.parentCommentId.toString()).toEqual(
        newReply.parentCommentId
      );
    });
  });

  test("deleteReply returns correct value", async () => {
    const { result } = renderHook(() => useRepliesAPIFacade(), {
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

    const reply: ReplyDetailsType = {
      id: "1",
      author: {
        name: "user",
        role: "USER",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
        id: "1",
      },
      body: "reply body",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      parentCommentId: "1",
    };

    await act(async () => {
      const deleteReplyResult = await result.current.deleteReply(reply);
      expect(deleteReplyResult.message).toEqual("Success");
      expect(deleteReplyResult.status).toEqual(200);
    });
  });

  test("getReply returns correct value", async () => {
    const { result } = renderHook(() => useRepliesAPIFacade(), {
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
      const getCommentResult = await result.current.getReply({
        id: "1",
      });
      expect(getCommentResult.message).toEqual("Success");
      expect(getCommentResult.status).toEqual(200);
      expect(getCommentResult.reply?.id).toEqual(1);
    });
  });

  test("getRepliesByAuthor returns correct value", async () => {
    const { result } = renderHook(() => useRepliesAPIFacade(), {
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
      const getRepliesByAuthorResult = await result.current.getRepliesByAuthor({
        authorId: "1",
        orderDirection: "Asc",
        pageNumber: 0,
        pageSize: 10,
        sortBy: "id",
      });

      expect(getRepliesByAuthorResult.message).toEqual("Success");
      expect(getRepliesByAuthorResult.status).toEqual(200);
      expect(getRepliesByAuthorResult.replies?.length).toBeGreaterThan(0);
    });
  });

  test("getRepliesByParentComment returns correct value", async () => {
    const { result } = renderHook(() => useRepliesAPIFacade(), {
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
      const getRepliesByParentCommentResult =
        await result.current.getRepliesByParentComment({
          parentCommentId: "1",
          orderDirection: "Asc",
          pageNumber: 0,
          pageSize: 10,
          sortBy: "id",
        });
      expect(getRepliesByParentCommentResult.message).toEqual("Success");
      expect(getRepliesByParentCommentResult.status).toEqual(200);
      expect(getRepliesByParentCommentResult.replies?.length).toBeGreaterThan(
        0
      );
    });
  });

  test("updateReply returns correct value", async () => {
    const { result } = renderHook(() => useRepliesAPIFacade(), {
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

    const replyToUpdate: ReplyDetailsType = {
      id: "1",
      author: {
        name: "user",
        role: "USER",
        createdAt: "2023-10-15T20:30:38",
        updatedAt: "2023-10-15T20:30:38",
        id: "1",
      },
      body: "reply body",
      createdAt: "2023-10-15T20:30:38",
      updatedAt: "2023-10-15T20:30:38",
      parentCommentId: "1",
    };

    await act(async () => {
      const updateCommentResult = await result.current.updateReply({
        currentReplyDetails: replyToUpdate,
        newReplyBody: "new reply body",
      });
      expect(updateCommentResult.message).toEqual("Success");
      expect(updateCommentResult.status).toEqual(200);
      expect(updateCommentResult.reply?.body).toEqual("new reply body");
      expect(updateCommentResult.reply?.id).toEqual(1);
    });
  });
});
