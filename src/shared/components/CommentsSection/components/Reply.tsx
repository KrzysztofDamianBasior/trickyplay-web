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

import useAuth from "../../../services/account/useAccount";
import { TextAlignentType } from "../../../services/commentsPaginatedCollection/commentsPaginatedCollectionReducer";
import {
  handleReplyDeleteType,
  handleReplyUpdateType,
  handleSetActiveReplyType,
} from "../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";
import { ReplyDetailsType } from "../../../services/api/useRepliesAPIFacade";
import { ActiveReplyDetailsType } from "../../../services/repliesPaginatedCollection/repliesPaginatedCollectionReducer";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { NotificationContext } from "../../../services/snackbars/NotificationsContext";

type Props = {
  activeReplyDetails: ActiveReplyDetailsType;
  replyDetails: ReplyDetailsType;
  replyPage: number;
  gameName: string;
  handleReplyDelete: handleReplyDeleteType;
  handleReplyUpdate: handleReplyUpdateType;
  handleSetActiveReply: handleSetActiveReplyType;
  textAlignment: TextAlignentType;
};

const Reply = ({
  activeReplyDetails,
  replyDetails,
  replyPage,
  handleReplyDelete,
  handleReplyUpdate,
  handleSetActiveReply,
  textAlignment,
  gameName,
}: Props) => {
  const { authState } = useAuth();
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);
  const { openSnackbar } = useContext(NotificationContext);

  const isEditing =
    activeReplyDetails &&
    activeReplyDetails.replyId === replyDetails.id &&
    activeReplyDetails.type === "Editing";

  const canDelete =
    authState.user && authState.user.id === replyDetails.author.id;

  const canUpdate =
    authState.user && authState.user.id === replyDetails.author.id;

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
    <Card elevation={1} key={replyDetails.id}>
      <CardHeader
        avatar={
          <Avatar aria-label="the first letter of the user's nickname">
            {replyDetails.author.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <Tooltip title="Delete reply">
            <IconButton onClick={() => deleteReply()}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        }
        title={replyDetails.author.name}
        subheader={`reply created at: ${replyDetails.createdAt}, last updated at: ${replyDetails.lastUpdatedAt}`}
      />

      <CardContent>
        {!isEditing && (
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign={textAlignment}
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
        <ButtonGroup
          variant="text"
          aria-label="text button group"
          className="comment-actions"
        >
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
          {canDelete && (
            <Button
              onClick={() => {
                deleteReply();
              }}
            >
              Delete
            </Button>
          )}
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default Reply;
