import React from "react";

import { AccountAuthenticationManager } from "./AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "./NotificationContextAndSigningAccountContextWrapper";

const notificationContextAndSigningAccountContextWrapperCreator = (
  accountAuthenticationManager: AccountAuthenticationManager
) => {
  return ({ children }: { children: React.ReactNode }) => (
    <NotificationContextAndSigningAccountContextWrapper
      accountAuthenticationManager={accountAuthenticationManager}
    >
      {children}
    </NotificationContextAndSigningAccountContextWrapper>
  );
};

export default notificationContextAndSigningAccountContextWrapperCreator;
