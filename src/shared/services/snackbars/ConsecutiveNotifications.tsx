import { NotificationDetailsType } from "./useNotifications";

import Snackbar from "@mui/material/Snackbar";
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
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      TransitionProps={{ onExited: handleExited }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        severity={messageInfo?.severity}
        onClose={handleClose}
        variant="filled"
        sx={{ width: "100%" }}
      >
        <AlertTitle>{messageInfo?.title}</AlertTitle>
        {messageInfo?.body}
      </Alert>
    </Snackbar>
  );
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}
