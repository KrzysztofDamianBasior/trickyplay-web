import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";

import useCommentsPaginatedCollection from "../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import CommentRow from "./components/CommentRow";

type Props =
  | {
      collectionType: "USER_COMMENTS";
      authorId: string;
    }
  | {
      collectionType: "GAME_COMMENTS";
      gameName: string;
    };

const CommentsTable = (props: Props) => {
  const {
    commentsPaginatedCollectionState,
    handleCommentsPageChange,
    handleCommentsRowsPerPageChange,
    handleCommentDelete,
    refreshActivePage,
  } = useCommentsPaginatedCollection(props);

  return (
    <Paper
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "95%",
        maxHeight: "1000px",
        p: { xs: 1, sm: 2, md: 3 },
        marginY: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alginItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
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
          <Tooltip title="refresh the active page" arrow>
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

          <Typography variant="h6" sx={{ mr: 1 }}>
            Comments Table
          </Typography>
          {commentsPaginatedCollectionState.status === "ERROR" && (
            <Tooltip
              title="An error occured. Try refreshing the comments table or page, or wait for the server to start responding."
              arrow
            >
              <ErrorIcon fontSize="medium" color="error" />
            </Tooltip>
          )}
        </Box>

        <TablePagination
          component="div"
          count={commentsPaginatedCollectionState.totalNumberOfAllComments}
          page={commentsPaginatedCollectionState.commentsActivePage} // The zero-based index of the current page.
          rowsPerPage={commentsPaginatedCollectionState.commentsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          onPageChange={(_, page) => {
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
      </Box>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Table stickyHeader aria-label="sticky collapsible comments table">
            <TableHead>
              <TableRow>
                {[
                  "Show replies",
                  "id",
                  "content",
                  "created at",
                  "updated at",
                  "author",
                  "game name",
                  "actions",
                ].map((label) => (
                  <TableCell
                    align="center"
                    component="th"
                    scope="col"
                    key={label}
                    sx={{
                      bgcolor: (theme) =>
                        commentsPaginatedCollectionState.status === "ERROR"
                          ? alpha(
                              theme.palette.error.main,
                              theme.palette.action.selectedOpacity
                            )
                          : alpha(
                              theme.palette.primary.main,
                              theme.palette.action.selectedOpacity
                            ),
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {commentsPaginatedCollectionState.status === "LOADING" ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <CircularProgress color="secondary" />
                  </TableCell>
                </TableRow>
              ) : (
                commentsPaginatedCollectionState.commentsPaginatedCollection[
                  commentsPaginatedCollectionState.commentsActivePage
                ].map((comment) => (
                  <CommentRow
                    key={comment.id}
                    handleCommentDelete={handleCommentDelete}
                    commentDetails={comment}
                    commentPage={
                      commentsPaginatedCollectionState.commentsActivePage
                    }
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommentsTable;
