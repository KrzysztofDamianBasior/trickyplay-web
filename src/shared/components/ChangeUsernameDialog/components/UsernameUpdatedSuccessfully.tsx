import { useContext } from "react";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import DoneIcon from "@mui/icons-material/Done";

import { AccountContext } from "../../../services/account/AccountContext";
import { DialogsContext } from "../../../services/dialogs/DialogsContext";

const UsernameUpdatedSuccessfully = () => {
  const { authState } = useContext(AccountContext);
  const { changeUsernameDialogManager } = useContext(DialogsContext);

  const { closeDialog } = changeUsernameDialogManager;

  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        Username updated successfully
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-username-dialog-description">
          Your username has been updated. Now you will log in using username: $
          {authState.user?.name}. Have a great time browsing.
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
