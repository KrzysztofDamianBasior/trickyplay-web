import React from "react";

import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";

import { type handleSetActiveCommentType } from "../../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import useRepliesPaginatedCollection from "../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";

import CommentForm from "./CommentForm";
import Reply from "./Reply";

import { type CommentDetailsType } from "../../../models/internalAppRepresentation/resources";

type Props = {
  parentCommentDetails: CommentDetailsType;
  isReplying: boolean;
  handleSetActiveComment: handleSetActiveCommentType;
};

const Replies = ({
  parentCommentDetails,
  isReplying,
  handleSetActiveComment,
}: Props) => {
  const {
    repliesPaginatedCollectionState,
    handleTextAlignmentChange,
    handleRepliesPageChange,
    handleRepliesRowsPerPageChange,
    handleReplyAdd,
    handleReplyDelete,
    handleReplyUpdate,
    handleSetActiveReply,
    refreshActivePage,
  } = useRepliesPaginatedCollection({
    parentCommentId: parentCommentDetails.id,
    collectionType: "COMMENT_REPLIES",
  });

  const textAlignButtons = [
    <ToggleButton value="left" key="left" size="small">
      <FormatAlignLeftIcon />
    </ToggleButton>,
    <ToggleButton value="center" key="center" size="small">
      <FormatAlignCenterIcon />
    </ToggleButton>,
    <ToggleButton value="right" key="right" size="small">
      <FormatAlignRightIcon />
    </ToggleButton>,
    <ToggleButton value="justify" key="justify" size="small">
      <FormatAlignJustifyIcon />
    </ToggleButton>,
  ];

  return (
    <Paper
      variant="outlined"
      sx={{ width: "100%", marginLeft: "auto", marginRight: "auto" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alginItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          bgcolor: (theme) =>
            repliesPaginatedCollectionState.status === "ERROR"
              ? alpha(
                  theme.palette.error.main,
                  theme.palette.action.activatedOpacity
                )
              : alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginX: { xs: 1, sm: 2, md: 3, lg: 4 },
          }}
        >
          <Tooltip title="refresh the active replies page" arrow>
            <IconButton
              aria-label="refresh button"
              color="secondary"
              size="large"
              onClick={refreshActivePage}
              edge="start"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" sx={{ mr: 1 }}>
            Replies Section
          </Typography>
          {repliesPaginatedCollectionState.status === "ERROR" && (
            <Tooltip
              title="An error occured. Try refreshing the replies section or page, or wait for the server to start responding."
              arrow
            >
              <ErrorIcon fontSize="medium" color="error" />
            </Tooltip>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginX: { xs: 1, sm: 2, md: 3, lg: 4 },
          }}
        >
          <TablePagination
            component="div"
            count={repliesPaginatedCollectionState.totalNumberOfAllReplies}
            page={repliesPaginatedCollectionState.repliesActivePage} // 	The zero-based index of the current page.
            rowsPerPage={repliesPaginatedCollectionState.repliesPerPage}
            onPageChange={(_, page) => {
              handleRepliesPageChange({ nextPage: page });
            }}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleRepliesRowsPerPageChange({
                newRepliesPerPage: parseInt(event.target.value, 10),
              });
            }}
          />
        </Box>
      </Toolbar>

      {isReplying && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <CommentForm
            submitLabel="Reply"
            initialText=""
            hasCancelButton={true}
            onCancelCallback={() => {
              handleSetActiveComment(null);
            }}
            onSubmitCallback={(content: string) => {
              handleReplyAdd({
                content,
                parentCommentId: parentCommentDetails.id,
              });
              handleSetActiveComment(null);
            }}
            disabled={repliesPaginatedCollectionState.status === "LOADING"}
          />
        </Box>
      )}

      <Paper sx={{ m: { xs: 1, sm: 2, md: 3 }, p: 1 }} variant="outlined">
        <Toolbar>
          <Stack spacing={2} alignItems="center">
            <ToggleButtonGroup
              size="medium"
              value={repliesPaginatedCollectionState.textAlignment}
              onChange={(_, value) => {
                handleTextAlignmentChange({ newAlignment: value });
              }}
              exclusive={true}
              aria-label="Medium sizes"
            >
              {textAlignButtons}
            </ToggleButtonGroup>
          </Stack>
        </Toolbar>
        {repliesPaginatedCollectionState.status === "LOADING" ? (
          <CircularProgress color="secondary" />
        ) : (
          repliesPaginatedCollectionState.repliesPaginatedCollection[
            repliesPaginatedCollectionState.repliesActivePage
          ].map((reply) => (
            <Reply
              key={reply.id}
              replyDetails={reply}
              activeReplyDetails={repliesPaginatedCollectionState.activeReply}
              replyPage={repliesPaginatedCollectionState.repliesActivePage}
              textAlignment={repliesPaginatedCollectionState.textAlignment}
              handleReplyDelete={handleReplyDelete}
              handleReplyUpdate={handleReplyUpdate}
              handleSetActiveReply={handleSetActiveReply}
            />
          ))
        )}
      </Paper>
    </Paper>
  );
};

export default Replies;
