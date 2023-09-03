import { useContext, useState } from "react";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";

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

  return (
    <Dialog
      open={isChangeUsernameDialogOpened}
      onClose={() => closeDialog()}
      scroll={"paper"}
      aria-labelledby="change-username-dialog-title"
      aria-describedby="change-username-dialog-description"
    >
      {usernameChangeDialogStatus === "OPERATION_SUCCEEDED" && (
        <UsernameUpdatedSuccessfully />
      )}
      {usernameChangeDialogStatus === "OPERATION_FAILED" && (
        <UsernameUpdateFailed />
      )}
      <Divider />
      {usernameChangeDialogStatus === "FORM_PROCESSING_PHASE" && (
        <ChangeUsernameForm
          setDialogStatus={(newStatus) => {
            setUsernameChangeDialogStatus(newStatus);
          }}
        />
      )}
    </Dialog>
  );
}
