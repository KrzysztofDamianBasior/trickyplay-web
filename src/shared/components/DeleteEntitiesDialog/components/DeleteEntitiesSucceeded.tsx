import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

import DoneIcon from "@mui/icons-material/Done";

const DeleteEntitiesSucceeded = ({
  onCloseDialog,
}: {
  onCloseDialog: () => void;
}) => {
  return (
    <>
      <DialogTitle id="scroll-dialog-title">Operation succeed</DialogTitle>
      <DialogContent dividers={false}>
        <DialogContentText>
          The deletion operation was performed successfully. Have a great time
          browsing.
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

export default DeleteEntitiesSucceeded;
