import { useContext } from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

import { type handleReplyDeleteType } from "../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { AccountContext } from "../../../services/account/AccountContext";

import { type ReplyDetailsType } from "../../../models/internalAppRepresentation/resources";

type Props = {
  replyDetails: ReplyDetailsType;
  replyPage: number;
  handleReplyDelete: handleReplyDeleteType;
};

const ReplyRow = ({ handleReplyDelete, replyDetails, replyPage }: Props) => {
  const { authState } = useContext(AccountContext);
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);

  const canReplyGetDeleted =
    authState.user &&
    (authState.user.id === replyDetails.author.id ||
      authState.user.role === "ADMIN");

  const deleteReply = () => {
    deleteEntitiesConfirmationDialogManager.openDialog({
      commentsToDelete: [],
      repliesToDelete: [replyDetails],
      onConfirm: async () => {
        const result = await handleReplyDelete({
          reply: replyDetails,
          replyPage,
        });
        return {
          deleteCommentsResults: [],
          deleteRepliesResults: [result],
        };
      },
    });
  };

  return (
    <TableRow
      sx={{ "& > *": { borderBottom: "unset" } }}
      hover
      key={replyDetails.id}
    >
      <TableCell align="left">{replyDetails.id}</TableCell>
      <TableCell align="left">{replyDetails.body}</TableCell>
      <TableCell align="left">
        {new Date(replyDetails.createdAt).toLocaleString()}
      </TableCell>
      <TableCell align="left">
        {new Date(replyDetails.updatedAt).toLocaleString()}
      </TableCell>
      <TableCell align="left">{replyDetails.author.name}</TableCell>
      <TableCell align="left">
        {canReplyGetDeleted && (
          <Button variant="outlined" onClick={deleteReply}>
            Delete
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ReplyRow;
