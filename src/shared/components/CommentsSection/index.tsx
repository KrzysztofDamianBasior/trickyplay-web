import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select/Select";
import FormControl from "@mui/material/FormControl/FormControl";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
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
import { GameNameType } from "../../models/internalAppRepresentation/resources";

type Props = {
  gameName: GameNameType;
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
    refreshActivePage,
    authState,
  } = useCommentsPaginatedCollection({
    gameName,
    collectionType: "GAME_COMMENTS",
  });

  const handleSelectChange = (event: SelectChangeEvent) => {
    handleCommentsRowsPerPageChange({
      newCommentsPerPage: parseInt(event.target.value),
    });
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
    <Paper sx={{ width: "90%", marginY: 4 }} variant="outlined">
      <Toolbar
        sx={{
          display: "flex",
          alginItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          bgcolor: (theme) =>
            commentsPaginatedCollectionState.status === "ERROR"
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
          <Tooltip title="refresh the active comments page" arrow>
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
            Comments Section
          </Typography>
          {commentsPaginatedCollectionState.status === "ERROR" && (
            <Tooltip
              title="An error occured. Try refreshing the comments section or page, or wait for the server to start responding."
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
          <Pagination
            count={
              commentsPaginatedCollectionState.commentsPaginatedCollection
                .length
            }
            page={commentsPaginatedCollectionState.commentsActivePage + 1}
            onChange={(_, page) => {
              handleCommentsPageChange({ nextPage: page - 1 });
            }}
            variant="outlined"
            color="secondary"
            showFirstButton
            showLastButton
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginX: { xs: 1, sm: 2, md: 3, lg: 4 },
          }}
        >
          <FormControl
            variant="standard"
            error={false}
            sx={{ minWidth: "80px", m: 1 }}
          >
            <InputLabel id="comments-per-page-select-label">
              Rows per page
            </InputLabel>
            <Select
              labelId="comments-per-page-select-label"
              id="rows-per-page-select"
              value={commentsPaginatedCollectionState.commentsPerPage.toString()}
              label="Rows per page"
              onChange={handleSelectChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
      {authState.status === "LOGGED_IN" ? (
        <Paper
          elevation={4}
          sx={{
            m: { xs: 1, sm: 2, md: 3 },
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Typography sx={{ m: 1 }} variant="h6">
            Write comment
          </Typography>
          <CommentForm
            onCancelCallback={() => {}}
            onSubmitCallback={(commentContent: string) =>
              handleCommentAdd({ content: commentContent, gameName })
            }
            hasCancelButton={true}
            initialText=""
            submitLabel="Publish"
            disabled={commentsPaginatedCollectionState.status === "LOADING"}
          />
        </Paper>
      ) : (
        <Paper
          elevation={4}
          sx={{ m: 1, paddingX: { xs: 1, sm: 2, md: 3, lg: 4 }, paddingY: 1 }}
        >
          <Typography sx={{ m: 1 }} variant="h6">
            You have to be signed in to post a comment
          </Typography>
        </Paper>
      )}

      <Paper
        sx={{
          m: { xs: 1, sm: 2, md: 3 },
          p: { xs: 1, sm: 2, md: 3 },
        }}
        variant="outlined"
      >
        <Toolbar>
          <ToggleButtonGroup
            size="small"
            value={commentsPaginatedCollectionState.textAlignment}
            onChange={(_, value) => {
              handleTextAlignmentChange({ newAlignment: value });
            }}
            exclusive={true}
            aria-label="Medium sizes"
            sx={{ marginLeft: "auto" }}
          >
            {textAlignButtons}
          </ToggleButtonGroup>
        </Toolbar>
        {commentsPaginatedCollectionState.status === "LOADING" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              color="secondary"
              sx={{ m: { xs: 1, sm: 2, md: 3, lg: 4 } }}
            />
          </Box>
        ) : (
          commentsPaginatedCollectionState.commentsPaginatedCollection[
            commentsPaginatedCollectionState.commentsActivePage
          ].map((comment) => (
            <Comment
              key={comment.id}
              commentDetails={comment}
              activeCommentDetails={
                commentsPaginatedCollectionState.activeComment
              }
              handleCommentDelete={handleCommentDelete}
              handleCommentUpdate={handleCommentUpdate}
              handleSetActiveComment={handleSetActiveComment}
              commentPage={commentsPaginatedCollectionState.commentsActivePage}
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
