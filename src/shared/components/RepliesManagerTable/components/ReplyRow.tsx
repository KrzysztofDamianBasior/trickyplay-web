import React, { useContext } from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import Button from "@mui/material/Button";
import { ReplyDetailsType } from "../../../services/api/useRepliesAPIFacade";
import { handleReplyDeleteType } from "../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";
import useAccount from "../../../services/account/useAccount";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { NotificationContext } from "../../../services/snackbars/NotificationsContext";

type Props = {
  replyDetails: ReplyDetailsType;
  replyPage: number;
  gameName: string;
  handleReplyDelete: handleReplyDeleteType;
};

const ReplyRow = ({
  gameName,
  handleReplyDelete,
  replyDetails,
  replyPage,
}: Props) => {
  const { authState } = useAccount();
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);
  const { openSnackbar } = useContext(NotificationContext);

  const canDelete =
    authState.user &&
    (authState.user.id === replyDetails.author.id ||
      authState.user.roles.includes("Admin"));

  const deleteReply = () => {
    deleteEntitiesConfirmationDialogManager.openDialog({
      commentsToDelete: [],
      repliesToDelete: [replyDetails],
      onCancel: () => {
        openSnackbar({
          severity: "info",
          title: `reply with id ${replyDetails.id} has not been deleted`,
          body: "reply deletion aborted",
        });
      },
      onConfirm: () => {
        handleReplyDelete({ reply: replyDetails, replyPage });
      },
    });
  };

  return (
    <TableRow
      sx={{ "& > *": { borderBottom: "unset" } }}
      hover
      key={replyDetails.id}
    >
      <TableCell align={"left"}>{replyDetails.id}id</TableCell>
      <TableCell align={"left"}>{replyDetails.body}content</TableCell>
      <TableCell align={"left"}>{replyDetails.createdAt}created at</TableCell>
      <TableCell align={"left"}>
        {replyDetails.lastUpdatedAt}last updated at
      </TableCell>
      <TableCell align={"left"}>
        {replyDetails.author.name}author name
      </TableCell>
      <TableCell align={"left"}>
        {canDelete && <Button onClick={deleteReply}>Delete</Button>}
      </TableCell>
    </TableRow>
  );
};

export default ReplyRow;
