import { useState } from "react";

import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select/Select";
import FormControl from "@mui/material/FormControl/FormControl";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import FormHelperText from "@mui/material/FormHelperText/FormHelperText";
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

import CommentForm from "./components/CommentForm";
import Comment from "./components/Comment";

import useCommentsPaginatedCollection from "../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";

type Props = {
  gameName: string;
};

const CommentsSection = ({ gameName }: Props) => {
  const {
    commentsPaginatedCollectionState,
    handleCommentAdd,
    handleCommentsPageChange,
    handleCommentsRowsPerPageChange,
    handleTextAlignmentChange,
    handleCommentDelete,
    handleCommentUpdate,
    handleSetActiveComment,
    commentsActivePage,
    commentsPerPage,
    refreshActivePage,
  } = useCommentsPaginatedCollection({ gameName, userId: null });

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
            ...(commentsPaginatedCollectionState.status === "ERROR" && {
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
          {/* {commentsPaginatedCollectionState.status === "ERROR" && ( */}
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
            count={commentsPaginatedCollectionState.totalNumberOfAllComments}
            page={commentsActivePage} // 0 - ...
            rowsPerPage={commentsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
            onPageChange={(_, page) => {
              console.log("next comments page" + page);
              handleCommentsPageChange({ nextPage: page });
            }}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleCommentsRowsPerPageChange({
                newCommentsPerPage: parseInt(event.target.value, 10),
              });
            }}
          />
          <Pagination
            count={
              commentsPaginatedCollectionState.commentsPaginatedCollection
                .length
            }
            page={commentsActivePage}
            onChange={(_, page) => handleCommentsPageChange({ nextPage: page })}
            variant="outlined"
            color="secondary"
            showFirstButton
            showLastButton
          />
          <Stack spacing={2} alignItems="center">
            <Tooltip title="set comment alignment" arrow>
              <ToggleButtonGroup
                size="medium"
                value={commentsPaginatedCollectionState.textAlignment}
                onChange={(_, value) => {
                  handleTextAlignmentChange({ newAlignment: value });
                }}
                exclusive={true}
                aria-label="Medium sizes"
              >
                {textAlignButtons}
              </ToggleButtonGroup>
            </Tooltip>
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

      <Paper elevation={3}>
        <Typography>Write comment</Typography>
        <CommentForm
          onCancelCallback={() => {}}
          onSubmitCallback={(commentContent: string) =>
            handleCommentAdd({ content: commentContent })
          }
          hasCancelButton={true}
          initialText=""
          submitLabel="Publish"
          disabled={commentsPaginatedCollectionState.status === "LOADING"}
        />
      </Paper>

      <Paper elevation={3}>
        {commentsPaginatedCollectionState.status === "LOADING" ? (
          <CircularProgress color="secondary" />
        ) : (
          commentsPaginatedCollectionState.commentsPaginatedCollection[
            commentsActivePage
          ].map((comment) => (
            <Comment
              commentDetails={comment}
              activeCommentDetails={
                commentsPaginatedCollectionState.activeComment
              }
              handleCommentDelete={handleCommentDelete}
              handleCommentUpdate={handleCommentUpdate}
              handleSetActiveComment={handleSetActiveComment}
              commentPage={commentsActivePage}
              gameName={gameName}
              textAlignment={commentsPaginatedCollectionState.textAlignment}
            />
          ))
        )}
      </Paper>
    </Paper>
  );
};

export default CommentsSection;
