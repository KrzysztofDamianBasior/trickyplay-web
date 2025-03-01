import { act, renderHook } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import useDialogs from "../useDialogs";

describe("useDialogs hook behavior", () => {
  it("should correctly set the initial state of the dialogs context", async () => {
    const { result } = renderHook(() => useDialogs());

    expect(
      result.current.changePasswordDialogManager.isChangePasswordDialogOpened
    ).toBeFalsy();

    expect(
      result.current.changeUsernameDialogManager.isChangeUsernameDialogOpened
    ).toBeFalsy();

    expect(
      result.current.deleteAccountConfirmationDialogManager
        .isDeleteAccountConfirmationDialogOpened
    ).toBeFalsy();

    expect(
      result.current.deleteEntitiesConfirmationDialogManager
        .isDeleteEntitiesConfirmationDialogOpened
    ).toBeFalsy();

    expect(
      result.current.deleteEntitiesConfirmationDialogManager.repliesToDelete
    ).toHaveLength(0);

    expect(
      result.current.deleteEntitiesConfirmationDialogManager.commentsToDelete
    ).toHaveLength(0);
  });

  it("should set isDeleteAccountConfirmationDialogOpened appropriately when openDialog and closeDialog are called", async () => {
    const { result } = renderHook(() => useDialogs());

    await act(async () => {
      result.current.deleteAccountConfirmationDialogManager.openDialog();
    });
    expect(
      result.current.deleteAccountConfirmationDialogManager
        .isDeleteAccountConfirmationDialogOpened
    ).toBeTruthy();

    await act(async () => {
      result.current.deleteAccountConfirmationDialogManager.closeDialog();
    });
    expect(
      result.current.deleteAccountConfirmationDialogManager
        .isDeleteAccountConfirmationDialogOpened
    ).toBeFalsy();
  });

  it("should set isChangePasswordDialogOpened appropriately when openDialog and closeDialog are called", async () => {
    const { result } = renderHook(() => useDialogs());

    await act(async () => {
      result.current.changePasswordDialogManager.openDialog();
    });
    expect(
      result.current.changePasswordDialogManager.isChangePasswordDialogOpened
    ).toBeTruthy();

    await act(async () => {
      result.current.changePasswordDialogManager.closeDialog();
    });
    expect(
      result.current.changePasswordDialogManager.isChangePasswordDialogOpened
    ).toBeFalsy();
  });

  it("should set isChangeUsernameDialogOpened appropriately when openDialog and closeDialog are called", async () => {
    const { result } = renderHook(() => useDialogs());

    await act(async () => {
      result.current.changeUsernameDialogManager.openDialog();
    });
    expect(
      result.current.changeUsernameDialogManager.isChangeUsernameDialogOpened
    ).toBeTruthy();

    await act(async () => {
      result.current.changeUsernameDialogManager.closeDialog();
    });
    expect(
      result.current.changeUsernameDialogManager.isChangeUsernameDialogOpened
    ).toBeFalsy();
  });

  it("should set isDeleteEntitiesConfirmationDialogOpened appropriately when openDialog and closeDialog are called", async () => {
    const { result } = renderHook(() => useDialogs());

    await act(async () => {
      result.current.deleteEntitiesConfirmationDialogManager.openDialog({
        commentsToDelete: [],
        repliesToDelete: [],
        onConfirm: () => {
          return Promise.resolve({
            deleteCommentsResults: [],
            deleteRepliesResults: [],
          });
        },
      });
    });
    expect(
      result.current.deleteEntitiesConfirmationDialogManager
        .isDeleteEntitiesConfirmationDialogOpened
    ).toBeTruthy();

    await act(async () => {
      result.current.deleteEntitiesConfirmationDialogManager.closeDialog();
    });
    expect(
      result.current.deleteEntitiesConfirmationDialogManager
        .isDeleteEntitiesConfirmationDialogOpened
    ).toBeFalsy();
  });
});
