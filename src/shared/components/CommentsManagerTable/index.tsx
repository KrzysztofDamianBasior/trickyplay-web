import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";

import useCommentsPaginatedCollection from "../../services/commentsPaginatedCollection/useCommentsPaginatedCollection";
import CommentRow from "./components/CommentRow";

type Props = { gameName: string; commentsOwner: null };

const CommentsTable = ({ gameName, commentsOwner }: Props) => {
  const {
    commentsPaginatedCollectionState,
    handleCommentsPageChange,
    handleCommentsRowsPerPageChange,
    handleCommentDelete,
    commentsActivePage,
    commentsPerPage,
    refreshActivePage,
  } = useCommentsPaginatedCollection({ gameName, userId: commentsOwner });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
          <Tooltip title="refresh the active users page" arrow>
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
            Comments Table
          </Typography>
          <TablePagination
            component="div"
            count={commentsPaginatedCollectionState.totalNumberOfAllComments}
            page={commentsActivePage} // 0 - ...
            rowsPerPage={commentsPerPage}
            // rowsPerPageOptions={[10, 25, 100]}
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
        </Toolbar>
      </AppBar>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky collapsible table">
          <TableHead>
            <TableRow>
              {[
                "Show replies",
                "id",
                "content",
                "created at",
                "last updated at",
                "author name",
                "actions",
              ].map((label) => (
                <TableCell
                  align={"center"}
                  style={{ minWidth: 100 }}
                  component="th"
                  scope="col"
                  // sx={{
                  //   backgroundColor: 'background.paper',
                  // }}
                  key={label}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {commentsPaginatedCollectionState.status === "LOADING" ? (
              <CircularProgress color="secondary" />
            ) : (
              commentsPaginatedCollectionState.commentsPaginatedCollection[
                commentsActivePage
              ].map((comment) => (
                <CommentRow
                  handleCommentDelete={handleCommentDelete}
                  commentDetails={comment}
                  commentPage={commentsActivePage}
                  gameName={gameName}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CommentsTable;
