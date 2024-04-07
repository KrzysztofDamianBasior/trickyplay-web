import Box from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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

  return (
    <Paper sx={{ m: 1 }} elevation={8}>
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
            Replies Table
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

        <TablePagination
          component="div"
          count={repliesPaginatedCollectionState.totalNumberOfAllReplies}
          page={repliesPaginatedCollectionState.repliesActivePage} // The zero-based index of the current page.
          rowsPerPage={repliesPaginatedCollectionState.repliesPerPage}
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
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
      </Toolbar>
      <Table size="small" aria-label="replies">
        <TableHead>
          <TableRow>
            {[
              "id",
              "content",
              "created at",
              "last updated at",
              "author",
              "actions",
            ].map((label) => (
              <TableCell
                align={"center"}
                component="th"
                scope="col"
                key={label}
                sx={{
                  bgcolor: (theme) =>
                    repliesPaginatedCollectionState.status === "ERROR"
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
          {repliesPaginatedCollectionState.status === "LOADING" ? (
            <TableRow>
              <TableCell colSpan={8}>
                <CircularProgress color="secondary" />
              </TableCell>
            </TableRow>
          ) : (
            repliesPaginatedCollectionState.repliesPaginatedCollection[
              repliesPaginatedCollectionState.repliesActivePage
            ].map((reply) => (
              <ReplyRow
                key={reply.id}
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
