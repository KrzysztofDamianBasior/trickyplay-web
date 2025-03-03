import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import ErrorIcon from "@mui/icons-material/Error";

import { DeleteEntitiesOnConfirmResultType } from "../../../services/dialogs/DialogsContext";

const DeleteEntitiesFailed = ({
  deleteEntitiesResults,
  onCloseDialog,
}: {
  deleteEntitiesResults: Awaited<DeleteEntitiesOnConfirmResultType> | null;
  onCloseDialog: () => void;
}) => {
  let message: string = "";
  if (deleteEntitiesResults) {
    if (deleteEntitiesResults.deleteCommentsResults.length > 0) {
      const numberOfSuccessfullyDeletedComments: number =
        deleteEntitiesResults.deleteCommentsResults.filter(
          (comm) => comm.message === "Success"
        ).length;
      const numberOfFailedDeletes: number =
        deleteEntitiesResults.deleteCommentsResults.length -
        numberOfSuccessfullyDeletedComments;
      message += `
      number of successfully deleted comments: ${numberOfSuccessfullyDeletedComments}, 
      number of failed comment deletes: ${numberOfFailedDeletes}
      `;
    }
    if (deleteEntitiesResults.deleteRepliesResults.length > 0) {
      const numberOfSuccessfullyDeletedReplies: number =
        deleteEntitiesResults.deleteRepliesResults.filter(
          (repl) => repl.message === "Success"
        ).length;
      const numberOfFailedDeletes: number =
        deleteEntitiesResults.deleteRepliesResults.length -
        numberOfSuccessfullyDeletedReplies;
      message += `
      number of successfully deleted replies: ${numberOfSuccessfullyDeletedReplies}, 
      number of failed replies deletes: ${numberOfFailedDeletes}
      `;
    }
  }

  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        Failed to delete entities
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText>
          Unfortunately the operation failed.
          {message}
          Please try again later.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseDialog}
          variant="contained"
          color="error"
          size="medium"
          type="button"
          endIcon={<ErrorIcon />}
          sx={{ m: 1 }}
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteEntitiesFailed;
