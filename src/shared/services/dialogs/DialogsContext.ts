import { createContext } from "react";
import { ReplyDetailsType } from "../api/useRepliesAPIFacade";
import { CommentDetailsType } from "../api/useCommentsAPIFacade";

export type DialogsContextType = {
  deleteEntitiesConfirmationDialogManager: DeleteEntitiesDialogManagerType;
};

export type DeleteEntitiesDialogManagerType = {
  isDeleteEntitiesConfirmationDialogOpened: boolean;
  commentsToDelete: CommentDetailsType[];
  repliesToDelete: ReplyDetailsType[];
  onCancel: () => void;
  onConfirm: () => void;
  openDialog: ({
    commentsToDelete,
    repliesToDelete,
  }: {
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
  }) => void;
  closeDialog: () => void;
  setOnCancel: (callback: () => void) => void;
  setOnClose: (callback: () => void) => void;
};

export const dialogsInitialManager: DialogsContextType = {
  deleteEntitiesConfirmationDialogManager: {
    commentsToDelete: [],
    repliesToDelete: [],
    isDeleteEntitiesConfirmationDialogOpened: false,
    onCancel: () => {},
    onConfirm: () => {},
    openDialog: () => {},
    closeDialog: () => {},
    setOnCancel: () => {},
    setOnClose: () => {},
  },
};

export const DialogsContext = createContext<DialogsContextType>(
  dialogsInitialManager
);
