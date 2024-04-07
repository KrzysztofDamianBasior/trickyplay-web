import { useContext } from "react";

import {
  Avatar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { AccountContext } from "../../../shared/services/account/AccountContext";
import { DialogsContext } from "../../../shared/services/dialogs/DialogsContext";

const AccountPanel = () => {
  const { authState } = useContext(AccountContext);
  const {
    changePasswordDialogManager,
    changeUsernameDialogManager,
    deleteAccountConfirmationDialogManager,
  } = useContext(DialogsContext);

  return (
    <Paper
      elevation={4}
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
        p: { xs: 1, sm: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            m: { xs: 1, sm: 2, md: 3, lg: 4 },
          }}
        >
          User account information
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            m: { xs: 1, sm: 2, md: 3, lg: 4 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            sx={{ m: 1 }}
            onClick={changeUsernameDialogManager.openDialog}
            variant="outlined"
          >
            Update username
          </Button>
          <Button
            sx={{ m: 1 }}
            onClick={changePasswordDialogManager.openDialog}
            variant="outlined"
          >
            Update password
          </Button>
          <Button
            sx={{ m: 1 }}
            onClick={deleteAccountConfirmationDialogManager.openDialog}
            variant="outlined"
          >
            Delete account
          </Button>
        </Box>
      </Box>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          m: { xs: 1, sm: 2, md: 3, lg: 4 },
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Table
          sx={{ maxWidth: "70%", m: { xs: 1, sm: 2, md: 3, lg: 4 } }}
          size="small"
          aria-label="a dense table"
        >
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                username
              </TableCell>
              <TableCell align="center">{authState.user?.name}</TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                id
              </TableCell>
              <TableCell align="center">{authState.user?.id}</TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                role
              </TableCell>
              <TableCell align="center">{authState.user?.role}</TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                created at
              </TableCell>
              <TableCell align="center">
                {authState.user &&
                  new Date(authState.user?.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                updated at
              </TableCell>
              <TableCell align="center">
                {authState.user &&
                  new Date(authState.user?.updatedAt).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Avatar sx={{ m: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
          {authState.user?.name[0]}
        </Avatar>
      </Paper>
    </Paper>
  );
};

export default AccountPanel;
