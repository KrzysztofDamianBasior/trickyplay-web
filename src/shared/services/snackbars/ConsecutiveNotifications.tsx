import { NotificationDetailsType } from "./useNotifications";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Slide, { SlideProps } from "@mui/material/Slide";

type Props = {
  isOpened: boolean;
  messageInfo: NotificationDetailsType | undefined;
  handleClose: (event: React.SyntheticEvent | Event, reason?: string) => void;
  handleExited: () => void;
};

export default function ConsecutiveNotifications({
  isOpened,
  messageInfo,
  handleClose,
  handleExited,
}: Props) {
  return (
    <Snackbar
      key={messageInfo?.key}
      open={isOpened}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      TransitionComponent={SlideTransition}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          sx={{ p: 0.5 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      }
    >
      <Alert severity={messageInfo?.severity}>
        <AlertTitle>{messageInfo?.title}</AlertTitle>
        {messageInfo?.body}
      </Alert>
    </Snackbar>
  );
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}
