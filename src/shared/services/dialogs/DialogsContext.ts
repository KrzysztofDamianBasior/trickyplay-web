import { createContext } from "react";

import {
  CommentDetailsType,
  ReplyDetailsType,
} from "../../models/internalAppRepresentation/resources";
import { DeleteReplyResultType } from "../api/useRepliesAPIFacade";
import { DeleteCommentResultType } from "../api/useCommentsAPIFacade";

export type DialogsContextType = {
  deleteEntitiesConfirmationDialogManager: DeleteEntitiesConfirmationDialogManagerType;
  deleteAccountConfirmationDialogManager: DeleteAccountConfirmationDialogManagerType;
  changeUsernameDialogManager: ChangeUsernameDialogManagerType;
  changePasswordDialogManager: ChangePasswordDialogManagerType;
};

export type DeleteEntitiesOnConfirmResultType = Promise<{
  deleteCommentsResults: Awaited<DeleteCommentResultType>[];
  deleteRepliesResults: Awaited<DeleteReplyResultType>[];
}>;

export type DeleteEntitiesConfirmationDialogManagerType = {
  commentsToDelete: CommentDetailsType[];
  repliesToDelete: ReplyDetailsType[];
  onConfirm: () => DeleteEntitiesOnConfirmResultType;
  isDeleteEntitiesConfirmationDialogOpened: boolean;
  openDialog: (openDialogProps: {
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
    onConfirm: async () => {
      return { deleteCommentsResults: [], deleteRepliesResults: [] };
    },
    isDeleteEntitiesConfirmationDialogOpened: false,
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
