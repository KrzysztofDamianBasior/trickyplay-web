import { useState } from "react";

import {
  ChangePasswordDialogManagerType,
  ChangeUsernameDialogManagerType,
  DeleteAccountConfirmationDialogManagerType,
  DeleteEntitiesDialogManagerType,
  DeleteEntitiesOnConfirmResultType,
  DialogsContextType,
} from "./DialogsContext";

import { CommentDetailsType } from "../api/useCommentsAPIFacade";
import { ReplyDetailsType } from "../api/useRepliesAPIFacade";

const deleteEntitiesConfirmationDialogInitialState = {
  commentsToDelete: [],
  repliesToDelete: [],
  isDeleteEntitiesConfirmationDialogOpened: false,
  onConfirm: async () => {
    return { deleteCommentsResults: [], deleteRepliesResults: [] };
  },
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
    setDeleteEntitiesConfirmationDialogState(
      {
        ...deleteEntitiesConfirmationDialogState,
        isDeleteEntitiesConfirmationDialogOpened: false,
      }
      // deleteEntitiesConfirmationDialogInitialState
    );
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
    setChangeUsernameDialogState({
      ...changeUsernameDialogState,
      isChangeUsernameDialogOpened: false,
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
    setChangePasswordDialogState({
      ...changePasswordDialogState,
      isChangePasswordDialogOpened: false,
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
    setDeleteAccountConfirmationDialogState({
      ...deleteAccountConfirmationDialogState,
      isDeleteAccountConfirmationDialogOpened: false,
    });
  };

  ///////////////////////////////////////////////////////

  const deleteEntitiesConfirmationDialogManager: DeleteEntitiesDialogManagerType =
    {
      ...deleteEntitiesConfirmationDialogState,
      closeDialog: closeDeleteEntitiesConfirmationDialog,
      openDialog: openDeleteEntitiesConfirmationDialog,
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
  const deleteAccountConfirmationDialogManager: DeleteAccountConfirmationDialogManagerType =
    {
      ...deleteAccountConfirmationDialogState,
      closeDialog: closeDeleteAccountConfirmationDialog,
      openDialog: openDeleteAccountConfirmationDialog,
    };

  return {
    deleteEntitiesConfirmationDialogManager,
    changePasswordDialogManager,
    changeUsernameDialogManager,
    deleteAccountConfirmationDialogManager,
  };
};

export default useDialogs;
