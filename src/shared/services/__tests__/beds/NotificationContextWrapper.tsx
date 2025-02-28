import ConsecutiveNotifications from "../../snackbars/ConsecutiveNotifications";
import { NotificationContext } from "../../snackbars/NotificationsContext";
import useNotifications from "../../snackbars/useNotifications";

const NotificationContextWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    closeSnackbar,
    openSnackbar,
    handleSnackbarExited,
    isSnackbarOpened,
    messageInfo,
  } = useNotifications();

  return (
    <NotificationContext.Provider value={{ closeSnackbar, openSnackbar }}>
      {children}
      <ConsecutiveNotifications
        handleClose={closeSnackbar}
        handleExited={handleSnackbarExited}
        isOpened={isSnackbarOpened}
        messageInfo={messageInfo}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationContextWrapper;
