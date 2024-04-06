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
import Box from "@mui/material/Box";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import CommentForm from "./CommentForm";
import Replies from "./Replies";

import {
  type ActiveCommentDetailsType,
  type TextAlignmentType,
} from "../../../services/commentsPaginatedCollection/commentsPaginatedCollectionReducer";
import {
  type handleCommentDeleteType,
  type handleCommentUpdateType,
  type handleSetActiveCommentType,
} from "../../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";
import { AccountContext } from "../../../services/account/AccountContext";

import { type CommentDetailsType } from "../../../models/internalAppRepresentation/resources";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
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
  textAlignment: TextAlignmentType;
};

const Comment = ({
  commentDetails,
  activeCommentDetails,
  commentPage,
  handleCommentDelete,
  handleCommentUpdate,
  handleSetActiveComment,
  textAlignment,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { deleteEntitiesConfirmationDialogManager } =
    useContext(DialogsContext);

  const { authState } = useContext(AccountContext);

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

  return (
    <Card elevation={8} sx={{ m: { xs: 1, sm: 2, md: 3 }, p: 1 }}>
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
        subheader={`comment created at: ${new Date(
          commentDetails.createdAt
        ).toLocaleString()}, last updated at: ${new Date(
          commentDetails.updatedAt
        ).toLocaleString()}`}
      />

      <CardContent>
        {!isEditing && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              wordWrap: "break-word",
            }}
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
          {canDelete && <Button onClick={deleteComment}>Delete</Button>}
        </ButtonGroup>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Show replies:
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show replies"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
      </CardActions>

      <Collapse
        in={expanded}
        timeout="auto"
        // unmountOnExit
      >
        <Box>
          {haveRepliesBeenMounted.current && (
            <Replies
              parentCommentDetails={commentDetails}
              isReplying={Boolean(isReplying)}
              handleSetActiveComment={handleSetActiveComment}
            />
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default Comment;
