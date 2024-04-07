import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorIcon from "@mui/icons-material/Error";
import { alpha } from "@mui/material/styles";

import useUsersPaginatedCollection from "../../services/usersPaginatedCollection/useUsersPaginatedCollection";
import UserRow from "./components/UserRow";

const UsersTable = () => {
  const {
    usersPaginatedCollectionState,
    refreshActivePage,
    handleGrantAdminPermissions,
    handleUserBan,
    handleUserUnban,
    handleUsersPageChange,
    handleUsersRowsPerPageChange,
  } = useUsersPaginatedCollection();

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
            usersPaginatedCollectionState.status === "ERROR"
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
            Users Table
          </Typography>
          {usersPaginatedCollectionState.status === "ERROR" && (
            <Tooltip
              title="An error occured. Try refreshing the users section or page, or wait for the server to start responding."
              arrow
            >
              <ErrorIcon fontSize="medium" color="error" />
            </Tooltip>
          )}
        </Box>

        <TablePagination
          component="div"
          count={usersPaginatedCollectionState.totalNumberOfAllUsers}
          page={usersPaginatedCollectionState.usersActivePage} // The zero-based index of the current page.
          rowsPerPage={usersPaginatedCollectionState.usersPerPage}
          rowsPerPageOptions={[5, 10, 15, 20, 25]}
          onPageChange={(_, page) => {
            handleUsersPageChange({ nextPage: page });
          }}
          onRowsPerPageChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            handleUsersRowsPerPageChange({
              newUsersPerPage: parseInt(event.target.value, 10),
            });
          }}
        />
      </Box>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Table
            stickyHeader
            aria-label="sticky collapsible users table"
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {[
                  "id",
                  "name",
                  "role",
                  "created at",
                  "last updated at",
                  "actions",
                ].map((label) => (
                  <TableCell
                    align={"center"}
                    component="th"
                    scope="col"
                    key={label}
                    sx={{
                      bgcolor: (theme) =>
                        usersPaginatedCollectionState.status === "ERROR"
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
              {usersPaginatedCollectionState.status === "LOADING" ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <CircularProgress color="secondary" />
                  </TableCell>
                </TableRow>
              ) : (
                usersPaginatedCollectionState.usersPaginatedCollection[
                  usersPaginatedCollectionState.usersActivePage
                ].map((user) => (
                  <UserRow
                    key={user.id}
                    userDetails={user}
                    userPage={usersPaginatedCollectionState.usersActivePage}
                    handleGrantAdminPermissions={handleGrantAdminPermissions}
                    handleUserBan={handleUserBan}
                    handleUserUnban={handleUserUnban}
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

export default UsersTable;
