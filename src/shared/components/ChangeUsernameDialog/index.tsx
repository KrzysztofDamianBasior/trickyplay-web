import { useContext, useEffect, useState } from "react";

import Dialog from "@mui/material/Dialog";

import { DialogsContext } from "../../services/dialogs/DialogsContext";

import UsernameUpdatedSuccessfully from "./components/UsernameUpdatedSuccessfully";
import UsernameUpdateFailed from "./components/UsernameUpdateFailed";
import ChangeUsernameForm from "./components/ChangeUsernameForm";

export type ChangeUsernameDialogStatusType =
  | "FORM_PROCESSING_PHASE"
  | "OPERATION_SUCCEEDED"
  | "OPERATION_FAILED";

export default function ChangeUsernameDialog() {
  const { changeUsernameDialogManager } = useContext(DialogsContext);
  const [usernameChangeDialogStatus, setUsernameChangeDialogStatus] =
    useState<ChangeUsernameDialogStatusType>("FORM_PROCESSING_PHASE");

  const { closeDialog, isChangeUsernameDialogOpened } =
    changeUsernameDialogManager;

  const onCloseDialog = () => {
    closeDialog();
  };

  useEffect(() => {
    if (changeUsernameDialogManager.isChangeUsernameDialogOpened)
      setUsernameChangeDialogStatus("FORM_PROCESSING_PHASE");
  }, [changeUsernameDialogManager.isChangeUsernameDialogOpened]);

  return (
    <Dialog
      open={isChangeUsernameDialogOpened}
      onClose={() => closeDialog()}
      scroll="paper"
      aria-labelledby="change-username-dialog-title"
      aria-describedby="change-username-dialog-description"
    >
      {usernameChangeDialogStatus === "OPERATION_SUCCEEDED" && (
        <UsernameUpdatedSuccessfully onCloseDialog={onCloseDialog} />
      )}
      {usernameChangeDialogStatus === "OPERATION_FAILED" && (
        <UsernameUpdateFailed onCloseDialog={onCloseDialog} />
      )}
      {usernameChangeDialogStatus === "FORM_PROCESSING_PHASE" && (
        <ChangeUsernameForm
          setDialogStatus={(newStatus) => {
            setUsernameChangeDialogStatus(newStatus);
          }}
          onCloseDialog={onCloseDialog}
        />
      )}
    </Dialog>
  );
}
