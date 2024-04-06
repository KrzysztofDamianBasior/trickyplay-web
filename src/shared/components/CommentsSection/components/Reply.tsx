import { useContext } from "react";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import CommentForm from "./CommentForm";

import { type TextAlignmentType } from "../../../services/commentsPaginatedCollection/commentsPaginatedCollectionReducer";
import {
  type handleReplyDeleteType,
  type handleReplyUpdateType,
  type handleSetActiveReplyType,
} from "../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";
import { type ActiveReplyDetailsType } from "../../../services/repliesPaginatedCollection/repliesPaginatedCollectionReducer";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { type ReplyDetailsType } from "../../../models/internalAppRepresentation/resources";
import { AccountContext } from "../../../services/account/AccountContext";

type Props = {
  activeReplyDetails: ActiveReplyDetailsType;
  replyDetails: ReplyDetailsType;
  replyPage: number;
  handleReplyDelete: handleReplyDeleteType;
  handleReplyUpdate: handleReplyUpdateType;
  handleSetActiveReply: handleSetActiveReplyType;
  textAlignment: TextAlignmentType;
};

const Reply = ({
  activeReplyDetails,
  replyDetails,
  replyPage,
  handleReplyDelete,
  handleReplyUpdate,
  handleSetActiveReply,
  textAlignment,
}: Props) => {
  const { authState } = useContext(AccountContext);
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);

  const isEditing =
    activeReplyDetails &&
    activeReplyDetails.replyId === replyDetails.id &&
    activeReplyDetails.type === "Editing";

  const canDelete =
    authState.user && authState.user.id === replyDetails.author.id;

  const canUpdate =
    authState.user && authState.user.id === replyDetails.author.id;

  const createdAt = new Date(replyDetails.createdAt);
  const updatedAt = new Date(replyDetails.updatedAt);

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
    <Card
      elevation={24}
      key={replyDetails.id}
      sx={{ m: { xs: 1, sm: 2, md: 3 }, p: 1 }}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="the first letter of the user's nickname">
            {replyDetails.author.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <Tooltip title="Delete reply">
            <IconButton onClick={deleteReply}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        }
        title={replyDetails.author.name}
        subheader={`reply created at: ${createdAt.toLocaleString()}, last updated at: ${updatedAt.toLocaleString()}`}
      />

      <CardContent>
        {!isEditing && (
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign={textAlignment}
            sx={{
              wordWrap: "break-word",
            }}
          >
            {replyDetails.body}
          </Typography>
        )}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton={true}
            initialText={replyDetails.body}
            disabled={false}
            onSubmitCallback={(text: string) => {
              handleReplyUpdate({
                newContent: text,
                reply: replyDetails,
                page: replyPage,
              });
              handleSetActiveReply(null);
            }}
            onCancelCallback={() => {
              handleSetActiveReply(null);
            }}
          />
        )}
      </CardContent>

      <CardActions disableSpacing>
        <ButtonGroup variant="text" aria-label="text button group">
          {canUpdate && (
            <Button
              onClick={() => {
                handleSetActiveReply({
                  replyId: replyDetails.id,
                  type: "Editing",
                });
              }}
            >
              Edit
            </Button>
          )}
          {canDelete && <Button onClick={deleteReply}>Delete</Button>}
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default Reply;
