import { useState } from "react";
import {
  DeleteEntitiesDialogManagerType,
  DialogsContextType,
} from "./DialogsContext";
import { CommentDetailsType } from "../api/useCommentsAPIFacade";
import { ReplyDetailsType } from "../api/useRepliesAPIFacade";

const deleteEntitiesConfirmationDialogInitialState = {
  commentsToDelete: [],
  repliesToDelete: [],
  isDeleteEntitiesConfirmationDialogOpened: false,
  onCancel: () => {},
  onConfirm: () => {},
};

const useDialogs = (): DialogsContextType => {
  const [
    deleteEntitiesConfirmationDialogState,
    setDeleteEntitiesConfirmationDialogState,
  ] = useState<{
    isDeleteEntitiesConfirmationDialogOpened: boolean;
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
    onCancel: () => void;
    onConfirm: () => void;
  }>(deleteEntitiesConfirmationDialogInitialState);

  const onDeleteEntitiesConfirmationDialogCancel = (callback: () => void) => {
    setDeleteEntitiesConfirmationDialogState((prev) => {
      return { ...prev, onCancel: callback };
    });
  };
  const onDeleteEntitiesConfirmationDialogConfirm = (callback: () => void) => {
    setDeleteEntitiesConfirmationDialogState((prev) => {
      return { ...prev, onConfirm: callback };
    });
  };
  const openDeleteEntitiesConfirmationDialog = ({
    commentsToDelete,
    repliesToDelete,
  }: {
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
  }) => {
    setDeleteEntitiesConfirmationDialogState((prev) => {
      return { ...prev, commentsToDelete, repliesToDelete };
    });
  };
  const closeDeleteEntitiesConfirmationDialog = () => {
    setDeleteEntitiesConfirmationDialogState(
      deleteEntitiesConfirmationDialogInitialState
    );
  };

  const deleteEntitiesConfirmationDialogManager: DeleteEntitiesDialogManagerType =
    {
      ...deleteEntitiesConfirmationDialogState,
      closeDialog: closeDeleteEntitiesConfirmationDialog,
      openDialog: openDeleteEntitiesConfirmationDialog,
      setOnCancel: onDeleteEntitiesConfirmationDialogCancel,
      setOnClose: onDeleteEntitiesConfirmationDialogConfirm,
    };

  return {
    deleteEntitiesConfirmationDialogManager,
  };
};

export default useDialogs;
