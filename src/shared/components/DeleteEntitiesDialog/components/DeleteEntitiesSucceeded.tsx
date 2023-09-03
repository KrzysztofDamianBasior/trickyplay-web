import React, { useContext } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import DoneIcon from "@mui/icons-material/Done";

import {
  DeleteEntitiesOnConfirmResultType,
  DialogsContext,
} from "../../../services/dialogs/DialogsContext";

const DeleteEntitiesSucceeded = ({
  deleteEntitiesResults,
}: {
  deleteEntitiesResults: Awaited<DeleteEntitiesOnConfirmResultType> | null;
}) => {
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);
  const { closeDialog } = deleteEntitiesConfirmationDialogManager;

  return (
    <>
      <DialogTitle id="scroll-dialog-title">Operation succeed</DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText>
          The delete action was successful. Have a great time browsing.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          variant="contained"
          color="success"
          size="medium"
          type="button"
          endIcon={<DoneIcon />}
          sx={{ m: 1 }}
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteEntitiesSucceeded;
