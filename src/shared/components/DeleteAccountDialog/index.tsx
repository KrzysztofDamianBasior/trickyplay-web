import { useContext, useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";

import { DialogsContext } from "../../services/dialogs/DialogsContext";

import AccountDeletedSuccessfully from "./components/AccountDeletedSuccessfully";
import AccountDeleteFailed from "./components/AccountDeleteFailed";
import DeleteAccountConfirmatin from "./components/DeleteAccountConfirmation";
import { type DeleteAccountResultType } from "../../services/account/AccountContext";

export type DeleteAccountDialogStatusType =
  | "FORM_PROCESSING_PHASE"
  | "OPERATION_SUCCEEDED"
  | "OPERATION_FAILED";

export default function DeleteAccountDialog() {
  const { deleteAccountConfirmationDialogManager } = useContext(DialogsContext);
  const [deleteAccountDialogStatus, setDeleteAccountDialogStatus] =
    useState<DeleteAccountDialogStatusType>("FORM_PROCESSING_PHASE");
  const [deleteAccountResult, setDeleteAccountResult] =
    useState<Awaited<DeleteAccountResultType> | null>(null);

  const { closeDialog, isDeleteAccountConfirmationDialogOpened } =
    deleteAccountConfirmationDialogManager;

  const onCloseDialog = () => {
    closeDialog();
  };

  useEffect(() => {
    if (
      deleteAccountConfirmationDialogManager.isDeleteAccountConfirmationDialogOpened
    )
      setDeleteAccountDialogStatus("FORM_PROCESSING_PHASE");
  }, [
    deleteAccountConfirmationDialogManager.isDeleteAccountConfirmationDialogOpened,
  ]);

  return (
    <Dialog
      open={isDeleteAccountConfirmationDialogOpened}
      onClose={() => closeDialog()}
      scroll={"paper"}
      aria-labelledby="delete-account-dialog-title"
      aria-describedby="delete-account-dialog-description"
    >
      {deleteAccountDialogStatus === "OPERATION_SUCCEEDED" && (
        <AccountDeletedSuccessfully onCloseDialog={onCloseDialog} />
      )}
      {deleteAccountDialogStatus === "OPERATION_FAILED" && (
        <AccountDeleteFailed
          deleteAccountResult={deleteAccountResult}
          onCloseDialog={onCloseDialog}
        />
      )}
      {deleteAccountDialogStatus === "FORM_PROCESSING_PHASE" && (
        <DeleteAccountConfirmatin
          setDeleteAccountDialogStatus={setDeleteAccountDialogStatus}
          setDeleteAccountResult={setDeleteAccountResult}
          onCloseDialog={onCloseDialog}
        />
      )}
    </Dialog>
  );
}
