import { useState, useContext, useRef } from "react";

import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import RepliesTable from "../../RepliesManagerTable";

import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { type handleCommentDeleteType } from "../../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import { type CommentDetailsType } from "../../../models/internalAppRepresentation/resources";
import { AccountContext } from "../../../services/account/AccountContext";

type Props = {
  handleCommentDelete: handleCommentDeleteType;
  commentDetails: CommentDetailsType;
  commentPage: number;
};

export default function CommentRow({
  commentDetails,
  commentPage,
  handleCommentDelete,
}: Props) {
  const { authState } = useContext(AccountContext);
  const [expanded, setExpanded] = useState(false);
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);
  const haveRepliesBeenMounted = useRef(false);

  const handleExpandClick = () => {
    haveRepliesBeenMounted.current = true;
    setExpanded(!expanded);
  };

  const deleteComment = async () => {
    deleteEntitiesConfirmationDialogManager.openDialog({
      commentsToDelete: [commentDetails],
      repliesToDelete: [],
      onConfirm: async () => {
        const result = await handleCommentDelete({
          comment: commentDetails,
          commentPage,
        });
        return {
          deleteCommentsResults: [result],
          deleteRepliesResults: [],
        };
      },
    });
  };

  const canCommentGetDeleted =
    authState.user &&
    (authState.user.id === commentDetails.author.id ||
      authState.user.role === "ADMIN");

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
        <TableCell align={"left"}>{commentDetails.id}</TableCell>
        <TableCell align={"left"}>{commentDetails.body}</TableCell>
        <TableCell align={"left"}>
          {new Date(commentDetails.createdAt).toLocaleString()}
        </TableCell>
        <TableCell align={"left"}>
          {new Date(commentDetails.updatedAt).toLocaleString()}
        </TableCell>
        <TableCell align={"left"}>{commentDetails.author.name}</TableCell>
        <TableCell align={"left"}>{commentDetails.gameName}</TableCell>
        <TableCell align={"left"}>
          {canCommentGetDeleted && (
            <Button onClick={deleteComment} variant="outlined">
              Delete
            </Button>
          )}
        </TableCell>
      </TableRow>

      <TableRow sx={{ minHeight: 0 }}>
        <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse
            in={expanded}
            timeout="auto"
            //unmountOnExit
          >
            {haveRepliesBeenMounted.current && (
              <RepliesTable
                parentCommentId={commentDetails.id}
                tableType="COMMENT_REPLIES"
              />
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
