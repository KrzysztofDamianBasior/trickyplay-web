import { useContext } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import ErrorIcon from "@mui/icons-material/Error";

import { AccountContext } from "../../../services/account/AccountContext";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";

const UsernameUpdateFailed = () => {
  const { authState } = useContext(AccountContext);
  const { changeUsernameDialogManager } = useContext(DialogsContext);

  const { closeDialog } = changeUsernameDialogManager;

  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        Failed to update username
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-username-dialog-description">
          Unfortunately the username change process failed. Your current
          username is ${authState.user?.name}. Please try again later.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          variant="contained"
          color="error"
          size="medium"
          type="button"
          endIcon={<ErrorIcon />}
          sx={{ m: 1 }}
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </>
  );
};

export default UsernameUpdateFailed;
