import { useContext } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { DialogsContext } from "../../services/dialogs/DialogsContext";

import CommentCard from "../CommentPresentationThumb";
import ReplyCard from "../ReplyPresentationThumb";

export default function DeleteEntitiesDialog() {
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);

  const {
    isDeleteEntitiesConfirmationDialogOpened,
    commentsToDelete,
    repliesToDelete,
    openDialog,
    closeDialog,
    onCancel,
    onConfirm,
  } = deleteEntitiesConfirmationDialogManager;

  const handleCancel = () => {
    onCancel();
    closeDialog();
  };
  const handleConfirm = () => {
    onConfirm();
    closeDialog();
  };

  return (
    <Dialog
      open={isDeleteEntitiesConfirmationDialogOpened}
      onClose={() => closeDialog()}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        Are you sure you want to delete these entities?
      </DialogTitle>
      <DialogContent dividers={true}>
        {commentsToDelete.length > 0 && (
          <>
            <Typography>Comments</Typography>
            {commentsToDelete.map((comment) => (
              <CommentCard commentDetails={comment} />
            ))}
          </>
        )}

        {repliesToDelete.length > 0 && (
          <>
            <Divider />
            <Typography>Replies</Typography>
            {repliesToDelete.map((reply) => (
              <ReplyCard replyDetails={reply} />
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
