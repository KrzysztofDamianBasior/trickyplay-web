import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";

import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";

import useRepliesPaginatedCollection from "../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";
import ReplyRow from "./components/ReplyRow";

type Props =
  | {
      tableType: "USER_REPLIES";
      authorId: string;
    }
  | {
      tableType: "COMMENT_REPLIES";
      parentCommentId: string;
    };

const RepliesTable = (props: Props) => {
  const {
    repliesPaginatedCollectionState,
    refreshActivePage,
    handleRepliesPageChange,
    handleRepliesRowsPerPageChange,
    handleReplyDelete,
  } = useRepliesPaginatedCollection(
    props.tableType === "COMMENT_REPLIES"
      ? {
          collectionType: "COMMENT_REPLIES",
          parentCommentId: props.parentCommentId,
        }
      : { collectionType: "USER_REPLIES", authorId: props.authorId }
  );

  //maybe try TableContainer instead of Paper
  return (
    <Paper sx={{ margin: 1 }}>
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
          {/* {repliesPaginatedCollectionState.status === "ERROR" && ( */}
          <Tooltip
            title="An error occured. Try refreshing the comments section or page, or wait for the server to start responding."
            arrow
          >
            <ErrorIcon fontSize="large" color="error" />
          </Tooltip>
          {/* )} */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Replies Table
          </Typography>
          <TablePagination
            component="div"
            count={repliesPaginatedCollectionState.totalNumberOfAllReplies}
            page={repliesPaginatedCollectionState.repliesActivePage} // 0 - ...
            rowsPerPage={repliesPaginatedCollectionState.repliesPerPage}
            // rowsPerPageOptions={[10, 25, 100]}
            onPageChange={(_, page) => {
              console.log("next replies page" + page);
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
        </Toolbar>
      </AppBar>
      <Table size="small" sx={{ minWidth: 650 }} aria-label="replies">
        <TableHead>
          <TableRow>
            {[
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
          {repliesPaginatedCollectionState.status === "LOADING" ? (
            <CircularProgress color="secondary" />
          ) : (
            repliesPaginatedCollectionState.repliesPaginatedCollection[
              repliesPaginatedCollectionState.repliesActivePage
            ].map((reply) => (
              <ReplyRow
                handleReplyDelete={handleReplyDelete}
                replyDetails={reply}
                replyPage={repliesPaginatedCollectionState.repliesActivePage}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RepliesTable;
