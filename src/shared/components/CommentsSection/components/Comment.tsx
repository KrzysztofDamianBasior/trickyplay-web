import { useState, useRef, useContext } from "react";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import CommentForm from "./CommentForm";

import { CommentDetailsType } from "../../../services/api/useCommentsAPIFacade";
import useAccount from "../../../services/account/useAccount";
import {
  ActiveCommentDetailsType,
  TextAlignentType,
} from "../../../services/commentsPaginatedCollection/commentsPaginatedCollectionReducer";
import {
  handleCommentDeleteType,
  handleCommentUpdateType,
  handleSetActiveCommentType,
} from "../../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import Replies from "./Replies";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { NotificationContext } from "../../../services/snackbars/NotificationsContext";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type Props = {
  commentDetails: CommentDetailsType;
  activeCommentDetails: ActiveCommentDetailsType;
  commentPage: number;
  gameName: string;
  handleCommentDelete: handleCommentDeleteType;
  handleCommentUpdate: handleCommentUpdateType;
  handleSetActiveComment: handleSetActiveCommentType;
  textAlignment: TextAlignentType;
};

const Comment = ({
  commentDetails,
  activeCommentDetails,
  commentPage,
  gameName,
  handleCommentDelete,
  handleCommentUpdate,
  handleSetActiveComment,
  textAlignment,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);
  const { openSnackbar } = useContext(NotificationContext);

  const { authState } = useAccount();

  const haveRepliesBeenMounted = useRef(false);

  const handleExpandClick = () => {
    haveRepliesBeenMounted.current = true;
    setExpanded(!expanded);
  };

  const isEditing =
    activeCommentDetails &&
    activeCommentDetails.id === commentDetails.id &&
    activeCommentDetails.type === "Editing";

  const isReplying =
    activeCommentDetails &&
    activeCommentDetails.id === commentDetails.id &&
    activeCommentDetails.type === "Replying";

  const canReply = Boolean(authState.user);

  const canDelete =
    authState.user && authState.user.id === commentDetails.author.id;

  const canUpdate =
    authState.user && authState.user.id === commentDetails.author.id;

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
    <Card elevation={1} key={commentDetails.id}>
      <CardHeader
        avatar={
          <Avatar aria-label="the first letter of the user's nickname">
            {commentDetails.author.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteComment()}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        }
        title={commentDetails.author.name}
        subheader={`comment created at: ${commentDetails.createdAt}, last updated at: ${commentDetails.lastUpdatedAt}`}
      />

      <CardContent>
        {!isEditing && (
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign={textAlignment}
          >
            {commentDetails.body}
          </Typography>
        )}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton={true}
            initialText={commentDetails.body}
            disabled={false}
            onSubmitCallback={(text: string) =>
              handleCommentUpdate({
                newContent: text,
                comment: commentDetails,
                page: commentPage,
              })
            }
            onCancelCallback={() => {
              handleSetActiveComment(null);
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
          {canReply && (
            <Button
              onClick={() => {
                handleSetActiveComment({
                  commentId: commentDetails.id,
                  type: "Replying",
                });
                setExpanded(true);
              }}
            >
              Reply
            </Button>
          )}
          {canUpdate && (
            <Button
              onClick={() => {
                handleSetActiveComment({
                  commentId: commentDetails.id,
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
                deleteComment();
              }}
            >
              Delete
            </Button>
          )}
        </ButtonGroup>
        <Typography>Show replies</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show replies"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse
        in={expanded}
        timeout="auto"
        // unmountOnExit
      >
        <CardContent>
          {haveRepliesBeenMounted && (
            <Replies
              parentCommentDetails={commentDetails}
              gameName={gameName}
              isReplying={Boolean(isReplying)}
              handleSetActiveComment={handleSetActiveComment}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Comment;
