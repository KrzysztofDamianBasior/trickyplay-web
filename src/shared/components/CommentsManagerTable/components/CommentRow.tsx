import { useState, useContext, useRef } from "react";

import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import RepliesTable from "../../RepliesManagerTable";

import { handleCommentDeleteType } from "../../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { NotificationContext } from "../../../services/snackbars/NotificationsContext";
import { CommentDetailsType } from "../../../services/api/useCommentsAPIFacade";

type Props = {
  handleCommentDelete: handleCommentDeleteType;
  commentDetails: CommentDetailsType;
  commentPage: number;
  gameName: string;
};

export default function CommentRow({
  commentDetails,
  commentPage,
  gameName,
  handleCommentDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);

  const { openSnackbar } = useContext(NotificationContext);

  const haveRepliesBeenMounted = useRef(false);

  const handleExpandClick = () => {
    haveRepliesBeenMounted.current = true;
    setExpanded(!expanded);
  };

  const deleteComment = () => {
    deleteEntitiesConfirmationDialogManager.openDialog({
      commentsToDelete: [commentDetails],
      repliesToDelete: [],
      onCancel: () => {
        openSnackbar({
          severity: "info",
          title: `comment with id ${commentDetails.id} has not been deleted`,
          body: "comment deletion aborted",
        });
      },
      onConfirm: () => {
        handleCommentDelete({ comment: commentDetails, commentPage });
      },
    });
  };

  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        hover
        key={commentDetails.id}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleExpandClick}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align={"left"}>{commentDetails.id}id</TableCell>
        <TableCell align={"left"}>{commentDetails.body}content</TableCell>
        <TableCell align={"left"}>
          {commentDetails.createdAt}created at
        </TableCell>
        <TableCell align={"left"}>
          {commentDetails.lastUpdatedAt}last updated at
        </TableCell>
        <TableCell align={"left"}>
          {commentDetails.author.name}author name
        </TableCell>
        <TableCell align={"left"}>
          <Button onClick={deleteComment}>Delete</Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={expanded}
            timeout="auto"
            //unmountOnExit
          >
            <RepliesTable
              gameName={gameName}
              parentCommentDetails={commentDetails}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
