import { useEffect } from "react";

import {
  type DeleteEntitiesOnConfirmResultType,
  DialogsContext,
} from "../../dialogs/DialogsContext";
import useDialogs from "../../dialogs/useDialogs";

import {
  type CommentDetailsType,
  type ReplyDetailsType,
} from "../../../models/internalAppRepresentation/resources";

export type DialogsStateManager = {
  changePasswordDialogManager: {
    isChangePasswordDialogOpened: boolean;
  };
  changeUsernameDialogManager: {
    isChangeUsernameDialogOpened: boolean;
  };
  deleteAccountConfirmationDialogManager: {
    isDeleteAccountConfirmationDialogOpened: boolean;
  };
  deleteEntitiesConfirmationDialogManager: {
    isDeleteEntitiesConfirmationDialogOpened: boolean;
    onConfirm: () => DeleteEntitiesOnConfirmResultType;
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
  };
};

const DialogsContextWrapper = ({
  dialogsStateManager,
  children,
}: {
  dialogsStateManager: DialogsStateManager;
  children: React.ReactNode;
}) => {
  const {
    changePasswordDialogManager,
    changeUsernameDialogManager,
    deleteAccountConfirmationDialogManager,
    deleteEntitiesConfirmationDialogManager,
  } = useDialogs();

  useEffect(() => {
    if (
      dialogsStateManager.changePasswordDialogManager
        .isChangePasswordDialogOpened
    ) {
      changePasswordDialogManager.openDialog();
    } else {
      changePasswordDialogManager.closeDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dialogsStateManager.changePasswordDialogManager
      .isChangePasswordDialogOpened,
  ]);

  useEffect(() => {
    if (
      dialogsStateManager.changeUsernameDialogManager
        .isChangeUsernameDialogOpened
    ) {
      changeUsernameDialogManager.openDialog();
    } else {
      changeUsernameDialogManager.closeDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dialogsStateManager.changeUsernameDialogManager
      .isChangeUsernameDialogOpened,
  ]);

  useEffect(() => {
    if (
      dialogsStateManager.deleteAccountConfirmationDialogManager
        .isDeleteAccountConfirmationDialogOpened
    ) {
      deleteAccountConfirmationDialogManager.openDialog();
    } else {
      deleteAccountConfirmationDialogManager.closeDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dialogsStateManager.deleteAccountConfirmationDialogManager
      .isDeleteAccountConfirmationDialogOpened,
  ]);

  useEffect(() => {
    if (
      dialogsStateManager.deleteEntitiesConfirmationDialogManager
        .isDeleteEntitiesConfirmationDialogOpened
    ) {
      deleteEntitiesConfirmationDialogManager.openDialog({
        commentsToDelete:
          dialogsStateManager.deleteEntitiesConfirmationDialogManager
            .commentsToDelete,
        repliesToDelete:
          dialogsStateManager.deleteEntitiesConfirmationDialogManager
            .repliesToDelete,
        onConfirm:
          dialogsStateManager.deleteEntitiesConfirmationDialogManager.onConfirm,
      });
    } else {
      deleteEntitiesConfirmationDialogManager.closeDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dialogsStateManager.deleteEntitiesConfirmationDialogManager
      .isDeleteEntitiesConfirmationDialogOpened,
  ]);

  return (
    <DialogsContext.Provider
      value={{
        changePasswordDialogManager,
        changeUsernameDialogManager,
        deleteAccountConfirmationDialogManager,
        deleteEntitiesConfirmationDialogManager,
      }}
    >
      {children}
    </DialogsContext.Provider>
  );
};

export default DialogsContextWrapper;
