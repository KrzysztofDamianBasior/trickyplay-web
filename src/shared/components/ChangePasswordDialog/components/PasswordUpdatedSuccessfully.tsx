import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import DoneIcon from "@mui/icons-material/Done";

const PasswordUpdatedSuccessfully = ({
  onCloseDialog,
}: {
  onCloseDialog: () => void;
}) => {
  return (
    <>
      <DialogTitle id="change-password-title">
        Password updated successfully
      </DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText id="change-password-dialog-description">
          Your password has been updated. Wishing you endless hours of joy and
          adventure on our website!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseDialog}
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
