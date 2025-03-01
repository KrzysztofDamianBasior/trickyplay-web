import { act, renderHook } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import useNotifications, {
  type NotificationDetailsType,
} from "../useNotifications";

describe("useNotifications hook behavior", () => {
  // beforeEach(() => {
  //   vi.useFakeTimers();
  // });
  // afterEach(() => {
  //   vi.useRealTimers();
  // });
  //   vi.advanceTimersByTime(5000);
  //   vi.runAllTimers();

  it("should correctly set the initial state of the notification context", async () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.messageInfo).toBeFalsy();
    expect(result.current.isSnackbarOpened).toBeFalsy();
  });

  it("should correctly set the messageInfo state to the appropriate notification details", async () => {
    const { result } = renderHook(() => useNotifications());
    const notificationDetails: Omit<NotificationDetailsType, "key"> = {
      body: "notification body",
      severity: "info",
      title: "notification title",
    };

    await act(async () => {
      result.current.openSnackbar(notificationDetails);
    });

    expect(result.current.isSnackbarOpened).toBeTruthy();
    expect(result.current.messageInfo?.body).toBe(notificationDetails.body);
    expect(result.current.messageInfo?.severity).toBe(
      notificationDetails.severity
    );
    expect(result.current.messageInfo?.title).toBe(notificationDetails.title);
  });

  it("should respond correctly to opening and closing snackbar", async () => {
    const { result } = renderHook(() => useNotifications());
    const notificationDetails: Omit<NotificationDetailsType, "key"> = {
      body: "notification body",
      severity: "info",
      title: "notification title",
    };

    await act(async () => {
      result.current.openSnackbar(notificationDetails);
    });
    expect(result.current.isSnackbarOpened).toBeTruthy();

    await act(async () => {
      result.current.closeSnackbar();
    });
    expect(result.current.isSnackbarOpened).toBeFalsy();
  });

  it("should correctly display subsequent notifications", async () => {
    const { result } = renderHook(() => useNotifications());
    const firstNotificationDetails: Omit<NotificationDetailsType, "key"> = {
      body: "first notification body",
      severity: "info",
      title: "first notification title",
    };
    const secondNotificationDetails: Omit<NotificationDetailsType, "key"> = {
      body: "second notification body",
      severity: "success",
      title: "second notification title",
    };

    await act(async () => {
      result.current.openSnackbar(firstNotificationDetails);
    });
    expect(result.current.isSnackbarOpened).toBeTruthy();
    expect(result.current.messageInfo?.body).toBe(
      firstNotificationDetails.body
    );
    expect(result.current.messageInfo?.severity).toBe(
      firstNotificationDetails.severity
    );
    expect(result.current.messageInfo?.title).toBe(
      firstNotificationDetails.title
    );

    await act(async () => {
      result.current.openSnackbar(secondNotificationDetails);
    });

    await act(async () => {
      result.current.handleSnackbarExited();
      result.current.closeSnackbar();
    });

    expect(result.current.messageInfo?.body).toEqual(
      secondNotificationDetails.body
    );
    expect(result.current.messageInfo?.severity).toBe(
      secondNotificationDetails.severity
    );
    expect(result.current.messageInfo?.title).toBe(
      secondNotificationDetails.title
    );

    await act(async () => {
      result.current.closeSnackbar();
    });
    expect(result.current.isSnackbarOpened).toBeFalsy();
  });
});
