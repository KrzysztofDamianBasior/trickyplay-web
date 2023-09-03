import { useContext, useState } from "react";

import Dialog from "@mui/material/Dialog";

import {
  DeleteEntitiesOnConfirmResultType,
  DialogsContext,
} from "../../services/dialogs/DialogsContext";
import DeleteEntitiesConfirmation from "./components/DeleteEntitiesConfirmation";
import DeleteEntitiesFailed from "./components/DeleteEntitiesFailed";
import DeleteEntitiesSucceeded from "./components/DeleteEntitiesSucceeded";

export type DeleteEntitiesDialogStatusType =
  | "CONFIRMATION_PHASE"
  | "OPERATION_SUCCEEDED"
  | "OPERATION_FAILED";

export default function DeleteEntitiesDialog() {
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);

  const [deleteEntitiesDialogStatus, setDeleteEntitiesDialogStatus] =
    useState<DeleteEntitiesDialogStatusType>("CONFIRMATION_PHASE");

  const [deleteEntitiesResults, setDeleteEntitiesResults] =
    useState<Awaited<DeleteEntitiesOnConfirmResultType> | null>(null);

  const { isDeleteEntitiesConfirmationDialogOpened, closeDialog } =
    deleteEntitiesConfirmationDialogManager;

  return (
    <Dialog
      open={isDeleteEntitiesConfirmationDialogOpened}
      onClose={() => closeDialog()}
      scroll={"paper"}
      aria-labelledby="delete-entities-dialog-title"
      aria-describedby="delete-entities-dialog-description"
    >
      {deleteEntitiesDialogStatus === "CONFIRMATION_PHASE" && (
        <DeleteEntitiesConfirmation
          setDeleteEntitiesDialogStatus={setDeleteEntitiesDialogStatus}
          setDeleteEntitiesResults={setDeleteEntitiesResults}
        />
      )}
      {deleteEntitiesDialogStatus === "OPERATION_FAILED" && (
        <DeleteEntitiesFailed deleteEntitiesResults={deleteEntitiesResults} />
      )}
      {deleteEntitiesDialogStatus === "OPERATION_SUCCEEDED" && (
        <DeleteEntitiesSucceeded
          deleteEntitiesResults={deleteEntitiesResults}
        />
      )}
    </Dialog>
  );
}
