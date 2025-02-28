import React from "react";

import AccountContextWrapper, {
  AccountAuthenticationManager,
} from "./AccountContextWrapper";

import { NotificationContext } from "../../snackbars/NotificationsContext";
import useNotifications from "../../snackbars/useNotifications";
import ConsecutiveNotifications from "../../snackbars/ConsecutiveNotifications";

type Props = {
  accountAuthenticationManager: AccountAuthenticationManager;
  children: React.ReactNode;
};

const NotificationContextAndSigningAccountContextWrapper = ({
  accountAuthenticationManager,
  children,
}: Props) => {
  const {
    closeSnackbar,
    openSnackbar,
    handleSnackbarExited,
    isSnackbarOpened,
    messageInfo,
  } = useNotifications();

  return (
    <NotificationContext.Provider value={{ closeSnackbar, openSnackbar }}>
      <AccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
        openSnackbar={openSnackbar}
      >
        {children}
      </AccountContextWrapper>
      <ConsecutiveNotifications
        handleClose={closeSnackbar}
        handleExited={handleSnackbarExited}
        isOpened={isSnackbarOpened}
        messageInfo={messageInfo}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationContextAndSigningAccountContextWrapper;
