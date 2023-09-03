import { useContext } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import DoneIcon from "@mui/icons-material/Done";

import { DialogsContext } from "../../../services/dialogs/DialogsContext";

const PasswordUpdatedSuccessfully = () => {
  const { changePasswordDialogManager } = useContext(DialogsContext);

  const { closeDialog } = changePasswordDialogManager;

  return (
    <>
      <DialogTitle id="change-password-title">
        Password updated successfully
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-password-dialog-description">
          Your password has been updated. Have a great time browsing.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          variant="contained"
          color="success"
          size="medium"
          type="button"
          endIcon={<DoneIcon />}
          sx={{ m: 1 }}
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </>
  );
};

export default PasswordUpdatedSuccessfully;
