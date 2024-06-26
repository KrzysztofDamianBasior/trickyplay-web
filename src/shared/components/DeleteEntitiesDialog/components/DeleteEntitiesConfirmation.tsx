import { useContext, useState } from "react";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import CancelIcon from "@mui/icons-material/Cancel";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

import CommentCard from "../../CommentPresentationThumb";
import ReplyCard from "../../ReplyPresentationThumb";
import { type DeleteEntitiesDialogStatusType } from "../DeleteEntitiesDialog";

import {
  type DeleteEntitiesOnConfirmResultType,
  DialogsContext,
} from "../../../services/dialogs/DialogsContext";

type Props = {
  setDeleteEntitiesDialogStatus: (
    newStatus: DeleteEntitiesDialogStatusType
  ) => void;
  setDeleteEntitiesResults: (
    deleteEntitiesOnConfirmResultType: Awaited<DeleteEntitiesOnConfirmResultType>
  ) => void;
  onCloseDialog: () => void;
};

const DeleteEntitiesConfirmation = ({
  setDeleteEntitiesDialogStatus,
  setDeleteEntitiesResults,
  onCloseDialog,
}: Props) => {
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);
  const [
    deleteEntitiesConfirmationStatus,
    setDeleteEntitiesConfirmationStatus,
  ] = useState<"SERVER_PROCESSING_PHASE" | "USER_CONFIRMATION_PHASE">(
    "USER_CONFIRMATION_PHASE"
  );

  const { commentsToDelete, repliesToDelete, onConfirm } =
    deleteEntitiesConfirmationDialogManager;

  const handleCancel = () => {
    onCloseDialog();
  };

  const handleConfirm = async () => {
    setDeleteEntitiesConfirmationStatus("SERVER_PROCESSING_PHASE");
    const deleteEntitiesResults = await onConfirm();
    setDeleteEntitiesResults(deleteEntitiesResults);

    if (
      deleteEntitiesResults.deleteRepliesResults.some(
        (repl) => repl.message !== "Success"
      ) ||
      deleteEntitiesResults.deleteCommentsResults.some(
        (comm) => comm.message !== "Success"
      )
    ) {
      setDeleteEntitiesDialogStatus("OPERATION_FAILED");
    } else {
      setDeleteEntitiesDialogStatus("OPERATION_SUCCEEDED");
    }
  };

  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        {repliesToDelete.length === 1 && commentsToDelete.length === 0
          ? "Are you sure you want to delete this reply?"
          : repliesToDelete.length === 0 && commentsToDelete.length === 1
          ? "Are you sure you want to delete this comment?"
          : "Are you sure you want to delete these entities?"}
      </DialogTitle>
      <DialogContent
        dividers={true}
        id="delete-entities-dialog-description"
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        {commentsToDelete.length > 0 && (
          <>
            <Typography sx={{ m: 1, alignSelf: "start" }}>
              {commentsToDelete.length === 1 ? "Comment: " : "Comments:"}
            </Typography>
            {commentsToDelete.map((comment) => (
              <CommentCard key={comment.id} commentDetails={comment} />
            ))}
          </>
        )}

        {repliesToDelete.length > 0 && (
          <>
            <Typography sx={{ m: 1, alignSelf: "start" }}>
              {repliesToDelete.length === 1 ? "Reply:" : "Replies:"}
            </Typography>
            {repliesToDelete.map((reply) => (
              <ReplyCard key={reply.id} replyDetails={reply} />
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          variant="contained"
          color="secondary"
          size="medium"
          type="button"
          sx={{ m: 1 }}
          fullWidth
          disabled={
            deleteEntitiesConfirmationStatus === "SERVER_PROCESSING_PHASE"
          }
          endIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          type="submit"
          color="success"
          endIcon={<PublishedWithChangesIcon />}
          variant="contained"
          disabled={
            deleteEntitiesConfirmationStatus === "SERVER_PROCESSING_PHASE"
          }
          sx={{ m: 1 }}
          fullWidth
        >
          {deleteEntitiesConfirmationStatus === "USER_CONFIRMATION_PHASE"
            ? repliesToDelete.length === 1 && commentsToDelete.length === 0
              ? "Delete reply"
              : repliesToDelete.length === 0 && commentsToDelete.length === 1
              ? "Delete comment"
              : "Delete entities"
            : "Loading"}
        </Button>
      </DialogActions>
    </>
  );
};
export default DeleteEntitiesConfirmation;
