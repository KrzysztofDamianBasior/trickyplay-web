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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <AppBar>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(usersPaginatedCollectionState.status === "ERROR" && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          <Tooltip title="refresh the active page" arrow>
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
          {/* {usersPaginatedCollectionState.status === "ERROR" && ( */}
          <Tooltip
            title="An error occured. Try refreshing the comments section or page, or wait for the server to start responding."
            arrow
          >
            <ErrorIcon fontSize="large" color="error" />
          </Tooltip>
          {/* )} */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Users Table
          </Typography>
          <TablePagination
            component="div"
            count={usersPaginatedCollectionState.totalNumberOfAllUsers}
            page={usersPaginatedCollectionState.usersActivePage} // 0 - ...
            rowsPerPage={usersPaginatedCollectionState.usersPerPage}
            // rowsPerPageOptions={[10, 25, 100]}
            onPageChange={(_, page) => {
              console.log("next users page" + page);
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
        </Toolbar>
      </AppBar>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky collapsible table">
          <TableHead>
            <TableRow>
              {["id", "name", "roles", "createdAt", "lastUpdatedAt"].map(
                (label) => (
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
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {usersPaginatedCollectionState.status === "LOADING" ? (
              <CircularProgress color="secondary" />
            ) : (
              usersPaginatedCollectionState.usersPaginatedCollection[
                usersPaginatedCollectionState.usersActivePage
              ].map((user) => (
                <UserRow
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
      </TableContainer>
    </Paper>
  );
};

export default UsersTable;
