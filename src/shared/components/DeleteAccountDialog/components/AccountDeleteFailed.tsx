import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import ErrorIcon from "@mui/icons-material/Error";

import { DeleteAccountResultType } from "../../../services/account/AccountContext";

type Props = {
  deleteAccountResult: Awaited<DeleteAccountResultType> | null;
  onCloseDialog: () => void;
};

const UsernameUpdateFailed = ({
  deleteAccountResult,
  onCloseDialog,
}: Props) => {
  return (
    <>
      <DialogTitle id="scroll-dialog-title">
        Failed to delete account
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-username-dialog-description">
          Unfortunately the delete account process failed.
        </DialogContentText>
        <DialogContentText id="change-username-dialog-description">
          {deleteAccountResult?.message}
        </DialogContentText>
        <DialogContentText id="change-username-dialog-description">
          Please try again later.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseDialog}
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
