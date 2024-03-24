import { useContext } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import DoneIcon from "@mui/icons-material/Done";

import { DialogsContext } from "../../../services/dialogs/DialogsContext";

const UsernameUpdatedSuccessfully = () => {
  const { changeUsernameDialogManager } = useContext(DialogsContext);

  const { closeDialog } = changeUsernameDialogManager;

  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        Account deleted successfully
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-username-dialog-description">
          Your account has been deleted. We hope you will visit us again.
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

export default UsernameUpdatedSuccessfully;
