import React, { useState } from "react";

import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Select from "@mui/material/Select/Select";
import FormControl from "@mui/material/FormControl/FormControl";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import FormHelperText from "@mui/material/FormHelperText/FormHelperText";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material";
import { alpha } from "@mui/material/styles";

import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";

import { handleSetActiveCommentType } from "../../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import { CommentDetailsType } from "../../../services/api/useCommentsAPIFacade";
import useRepliesPaginatedCollection from "../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";

import CommentForm from "./CommentForm";
import Reply from "./Reply";

type Props = {
  parentCommentDetails: CommentDetailsType;
  gameName: string;
  isReplying: boolean;
  handleSetActiveComment: handleSetActiveCommentType;
};

const Replies = ({
  parentCommentDetails,
  gameName,
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
    repliesActivePage,
    repliesPerPage,
  } = useRepliesPaginatedCollection({
    parentCommentId: parentCommentDetails.id,
    gameName,
    userId: null,
  });

  const [rpp, setRpp] = useState<number>(10);
  const handleSelectChange = (event: SelectChangeEvent) => {
    setRpp(parseInt(event.target.value));
  };

  const textAlignButtons = [
    <ToggleButton value="left" key="left">
      <FormatAlignLeftIcon />
    </ToggleButton>,
    <ToggleButton value="center" key="center">
      <FormatAlignCenterIcon />
    </ToggleButton>,
    <ToggleButton value="right" key="right">
      <FormatAlignRightIcon />
    </ToggleButton>,
    <ToggleButton value="justify" key="justify">
      <FormatAlignJustifyIcon />
    </ToggleButton>,
  ];

  return (
    <Paper elevation={5}>
      <AppBar>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(repliesPaginatedCollectionState.status === "ERROR" && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          <Tooltip title="refresh the active comments page" arrow>
            <IconButton
              aria-label="refresh button"
              color="secondary"
              size="large"
              onClick={refreshActivePage}
              edge="start"
              sx={{ mr: 2 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {/* {repliesPaginatedCollectionState.status === "ERROR" && ( */}
          <Tooltip
            title="An error occured. Try refreshing the comments section or page, or wait for the server to start responding."
            arrow
          >
            <ErrorIcon fontSize="large" color="error" />
          </Tooltip>
          {/* )} */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Comments Section
          </Typography>

          <TablePagination
            component="div"
            count={
              repliesPaginatedCollectionState.repliesPaginatedCollection.length
            }
            page={repliesActivePage + 1}
            rowsPerPage={repliesPerPage}
            onPageChange={(_, page) =>
              handleRepliesPageChange({ nextPage: page })
            }
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleRepliesRowsPerPageChange({
                newRepliesPerPage: parseInt(event.target.value, 10),
              });
            }}
          />
          <Pagination
            count={
              repliesPaginatedCollectionState.repliesPaginatedCollection.length
            }
            page={repliesActivePage}
            onChange={(_, page) => handleRepliesPageChange({ nextPage: page })}
            variant="outlined"
            color="secondary"
            showFirstButton
            showLastButton
          />
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
          <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
            error={false}
          >
            <InputLabel id="comments-per-page-select-label">
              Rows per page
            </InputLabel>
            <Select
              labelId="comments-per-page-select-label"
              id="rows-per-page-select"
              value={rpp.toString()}
              label="Rows per page"
              onChange={handleSelectChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
            <FormHelperText>
              Set the number of displayed comments per page
            </FormHelperText>
          </FormControl>
        </Toolbar>
      </AppBar>

      {isReplying && (
        <CommentForm
          submitLabel="Reply"
          initialText=""
          hasCancelButton={true}
          onCancelCallback={() => {
            handleSetActiveComment(null);
          }}
          onSubmitCallback={(content: string) => {
            handleReplyAdd({ content });
            handleSetActiveComment(null);
          }}
          disabled={repliesPaginatedCollectionState.status === "LOADING"}
        />
      )}

      <Paper elevation={3}>
        {repliesPaginatedCollectionState.status === "LOADING" ? (
          <CircularProgress color="secondary" />
        ) : (
          repliesPaginatedCollectionState.repliesPaginatedCollection[
            repliesActivePage
          ].map((reply) => (
            <Reply
              replyDetails={reply}
              activeReplyDetails={repliesPaginatedCollectionState.activeReply}
              gameName={gameName}
              replyPage={repliesActivePage}
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
