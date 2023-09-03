import { useContext } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import ErrorIcon from "@mui/icons-material/Error";

import { DialogsContext } from "../../../services/dialogs/DialogsContext";

const UsernameUpdateFailed = () => {
  const { changeUsernameDialogManager } = useContext(DialogsContext);

  const { closeDialog } = changeUsernameDialogManager;

  return (
    <>
      <DialogTitle id="change-password-title">
        Failed to update password
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-password-dialog-description">
          Unfortunately the password change process failed. Please try again
          later.
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
