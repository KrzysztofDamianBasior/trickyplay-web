import { useContext, useState } from "react";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";

import { DialogsContext } from "../../services/dialogs/DialogsContext";

import AccountDeletedSuccessfully from "./components/AccountDeletedSuccessfully";
import AccountDeleteFailed from "./components/AccountDeleteFailed";
import DeleteAccountConfirmatin from "./components/DeleteAccountConfirmation";
import { DeleteAccountResultType } from "../../services/account/AccountContext";

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

  return (
    <Dialog
      open={isDeleteAccountConfirmationDialogOpened}
      onClose={() => closeDialog()}
      scroll={"paper"}
      aria-labelledby="delete-account-dialog-title"
      aria-describedby="delete-account-dialog-description"
    >
      {deleteAccountDialogStatus === "OPERATION_SUCCEEDED" && (
        <AccountDeletedSuccessfully />
      )}
      {deleteAccountDialogStatus === "OPERATION_FAILED" && (
        <AccountDeleteFailed deleteAccountResult={deleteAccountResult} />
      )}
      <Divider />
      {deleteAccountDialogStatus === "FORM_PROCESSING_PHASE" && (
        <DeleteAccountConfirmatin
          setDeleteAccountDialogStatus={setDeleteAccountDialogStatus}
          setDeleteAccountResult={setDeleteAccountResult}
        />
      )}
    </Dialog>
  );
}
