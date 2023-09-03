import { createContext } from "react";

import {
  DeleteReplyResultType,
  ReplyDetailsType,
} from "../api/useRepliesAPIFacade";
import {
  CommentDetailsType,
  DeleteCommentResultType,
} from "../api/useCommentsAPIFacade";

export type DialogsContextType = {
  deleteEntitiesConfirmationDialogManager: DeleteEntitiesDialogManagerType;
  deleteAccountConfirmationDialogManager: DeleteAccountConfirmationDialogManagerType;
  changeUsernameDialogManager: ChangeUsernameDialogManagerType;
  changePasswordDialogManager: ChangePasswordDialogManagerType;
};

export type DeleteEntitiesOnConfirmResultType = Promise<{
  deleteCommentsResults: Awaited<DeleteCommentResultType>[];
  deleteRepliesResults: Awaited<DeleteReplyResultType>[];
}>;

export type DeleteEntitiesDialogManagerType = {
  isDeleteEntitiesConfirmationDialogOpened: boolean;
  commentsToDelete: CommentDetailsType[];
  repliesToDelete: ReplyDetailsType[];
  onConfirm: () => DeleteEntitiesOnConfirmResultType;
  openDialog: ({
    commentsToDelete,
    repliesToDelete,
    onConfirm,
  }: {
    commentsToDelete: CommentDetailsType[];
    repliesToDelete: ReplyDetailsType[];
    onConfirm: () => DeleteEntitiesOnConfirmResultType;
  }) => void;
  closeDialog: () => void;
};

export type ChangeUsernameDialogManagerType = {
  isChangeUsernameDialogOpened: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export type ChangePasswordDialogManagerType = {
  isChangePasswordDialogOpened: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export type DeleteAccountConfirmationDialogManagerType = {
  isDeleteAccountConfirmationDialogOpened: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export const dialogsInitialManager: DialogsContextType = {
  deleteEntitiesConfirmationDialogManager: {
    commentsToDelete: [],
    repliesToDelete: [],
    isDeleteEntitiesConfirmationDialogOpened: false,
    onConfirm: async () => {
      return { deleteCommentsResults: [], deleteRepliesResults: [] };
    },
    openDialog: async () => {},
    closeDialog: async () => {},
  },
  changePasswordDialogManager: {
    isChangePasswordDialogOpened: false,
    openDialog: async () => {},
    closeDialog: async () => {},
  },
  changeUsernameDialogManager: {
    isChangeUsernameDialogOpened: false,
    openDialog: async () => {},
    closeDialog: async () => {},
  },
  deleteAccountConfirmationDialogManager: {
    isDeleteAccountConfirmationDialogOpened: false,
    openDialog: async () => {},
    closeDialog: async () => {},
  },
};

export const DialogsContext = createContext<DialogsContextType>(
  dialogsInitialManager
);
