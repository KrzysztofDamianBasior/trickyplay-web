/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import {
  type ChangePasswordDialogManagerType,
  type ChangeUsernameDialogManagerType,
  type DeleteAccountConfirmationDialogManagerType,
  type DeleteEntitiesConfirmationDialogManagerType,
  type DeleteEntitiesOnConfirmResultType,
  type DialogsContextType,
} from "./DialogsContext";

import {
  type CommentDetailsType,
  type ReplyDetailsType,
} from "../../models/internalAppRepresentation/resources";

const deleteEntitiesConfirmationDialogInitialState = {
  commentsToDelete: [],
  repliesToDelete: [],
  onConfirm: async (): DeleteEntitiesOnConfirmResultType => {
    return {
      deleteCommentsResults: [],
      deleteRepliesResults: [],
    };
  },
  isDeleteEntitiesConfirmationDialogOpened: false,
};

const changePasswordDialogInitialState = {
  isChangePasswordDialogOpened: false,
};

const changeUsernameDialogInitialState = {
  isChangeUsernameDialogOpened: false,
};

const deleteAccountConfirmationDialogInitialState = {
  isDeleteAccountConfirmationDialogOpened: false,
};

const useDialogs = (): DialogsContextType => {
  const [
    deleteEntitiesConfirmationDialogState,
    setDeleteEntitiesConfirmationDialogState,
  ] = useState<{
    isDeleteEntitiesConfirmationDialogOpened: boolean;
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
    onConfirm: () => DeleteEntitiesOnConfirmResultType;
  }>(deleteEntitiesConfirmationDialogInitialState);

  const [changePasswordDialogState, setChangePasswordDialogState] = useState<{
    isChangePasswordDialogOpened: boolean;
  }>(changePasswordDialogInitialState);

  const [changeUsernameDialogState, setChangeUsernameDialogState] = useState<{
    isChangeUsernameDialogOpened: boolean;
  }>(changeUsernameDialogInitialState);

  const [
    deleteAccountConfirmationDialogState,
    setDeleteAccountConfirmationDialogState,
  ] = useState<{
    isDeleteAccountConfirmationDialogOpened: boolean;
  }>(deleteAccountConfirmationDialogInitialState);

  ///////////////////////////////////////////////////////

  const openDeleteEntitiesConfirmationDialog = ({
    commentsToDelete,
    repliesToDelete,
    onConfirm,
  }: {
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
    onConfirm: () => DeleteEntitiesOnConfirmResultType;
  }) => {
    setDeleteEntitiesConfirmationDialogState((prev) => {
      return {
        commentsToDelete,
        repliesToDelete,
        onConfirm,
        isDeleteEntitiesConfirmationDialogOpened: true,
      };
    });
  };

  const closeDeleteEntitiesConfirmationDialog = () => {
    setDeleteEntitiesConfirmationDialogState((prev) => {
      return {
        ...prev,
        isDeleteEntitiesConfirmationDialogOpened: false,
      };
    });
  };

  ///////////////////////////////////////////////////////

  const openChangeUsernameDialog = () => {
    setChangeUsernameDialogState((prev) => {
      return {
        isChangeUsernameDialogOpened: true,
      };
    });
  };

  const closeChangeUsernameDialog = () => {
    setChangeUsernameDialogState((prev) => {
      return {
        ...prev,
        isChangeUsernameDialogOpened: false,
      };
    });
  };

  ///////////////////////////////////////////////////////

  const openChangePasswordDialog = () => {
    setChangePasswordDialogState((prev) => {
      return {
        isChangePasswordDialogOpened: true,
      };
    });
  };

  const closeChangePasswordDialog = () => {
    setChangePasswordDialogState((prev) => {
      return {
        ...prev,
        isChangePasswordDialogOpened: false,
      };
    });
  };

  ///////////////////////////////////////////////////////

  const openDeleteAccountConfirmationDialog = () => {
    setDeleteAccountConfirmationDialogState((prev) => {
      return {
        isDeleteAccountConfirmationDialogOpened: true,
      };
    });
  };

  const closeDeleteAccountConfirmationDialog = () => {
    setDeleteAccountConfirmationDialogState((prev) => {
      return {
        ...deleteAccountConfirmationDialogState,
        isDeleteAccountConfirmationDialogOpened: false,
      };
    });
  };

  ///////////////////////////////////////////////////////

  const deleteEntitiesConfirmationDialogManager: DeleteEntitiesConfirmationDialogManagerType =
    {
      ...deleteEntitiesConfirmationDialogState,
      closeDialog: closeDeleteEntitiesConfirmationDialog,
      openDialog: openDeleteEntitiesConfirmationDialog,
    };

  const deleteAccountConfirmationDialogManager: DeleteAccountConfirmationDialogManagerType =
    {
      ...deleteAccountConfirmationDialogState,
      closeDialog: closeDeleteAccountConfirmationDialog,
      openDialog: openDeleteAccountConfirmationDialog,
    };

  const changePasswordDialogManager: ChangePasswordDialogManagerType = {
    ...changePasswordDialogState,
    closeDialog: closeChangePasswordDialog,
    openDialog: openChangePasswordDialog,
  };

  const changeUsernameDialogManager: ChangeUsernameDialogManagerType = {
    ...changeUsernameDialogState,
    closeDialog: closeChangeUsernameDialog,
    openDialog: openChangeUsernameDialog,
  };

  return {
    deleteEntitiesConfirmationDialogManager,
    deleteAccountConfirmationDialogManager,
    changePasswordDialogManager,
    changeUsernameDialogManager,
  };
};

export default useDialogs;
