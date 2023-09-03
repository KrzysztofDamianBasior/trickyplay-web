import { useContext, useState } from "react";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";

import { DialogsContext } from "../../services/dialogs/DialogsContext";

import PasswordUpdatedSuccessfully from "./components/PasswordUpdatedSuccessfully";
import PasswordUpdateFailed from "./components/PasswordUpdateFailed";
import ChangePasswordForm from "./components/ChangePasswordForm";

export type ChangePasswordDialogStatusType =
  | "FORM_PROCESSING_PHASE"
  | "OPERATION_SUCCEEDED"
  | "OPERATION_FAILED";

export default function ChangePasswordDialog() {
  const { changePasswordDialogManager } = useContext(DialogsContext);
  const [passwordChangeDialogStatus, setPasswordChangeDialogStatus] =
    useState<ChangePasswordDialogStatusType>("FORM_PROCESSING_PHASE");

  const { closeDialog, isChangePasswordDialogOpened } =
    changePasswordDialogManager;

  return (
    <Dialog
      open={isChangePasswordDialogOpened}
      onClose={() => closeDialog()}
      scroll={"paper"}
      aria-labelledby="change-password-dialog-title"
      aria-describedby="change-password-dialog-description"
    >
      {passwordChangeDialogStatus === "OPERATION_SUCCEEDED" && (
        <PasswordUpdatedSuccessfully />
      )}
      {passwordChangeDialogStatus === "OPERATION_FAILED" && (
        <PasswordUpdateFailed />
      )}
      <Divider />
      {passwordChangeDialogStatus === "FORM_PROCESSING_PHASE" && (
        <ChangePasswordForm
          setDialogStatus={(newStatus) => {
            setPasswordChangeDialogStatus(newStatus);
          }}
        />
      )}
    </Dialog>
  );
}
