import { useEffect } from "react";

import { AccountContext, type SignInProps } from "../../account/AccountContext";
import useAccount from "../../account/useAccount";
import { type NotificationDetailsType } from "../../snackbars/useNotifications";

export type AccountAuthenticationManager =
  | {
      isAuthenticated: true;
      userCredentials: SignInProps;
    }
  | {
      isAuthenticated: false;
    };

const AccountContextWrapper = ({
  accountAuthenticationManager,
  openSnackbar,
  children,
}: {
  openSnackbar: ({
    title,
    body,
    severity,
  }: Omit<NotificationDetailsType, "key">) => void;
  accountAuthenticationManager: AccountAuthenticationManager;
  children: React.ReactNode;
}) => {
  const {
    authState,
    axiosPrivate,
    axiosPublic,
    accountActivitySummary,
    allSessionsSignOut,
    deleteAccount,
    signIn,
    signUp,
    singleSessionSignOut,
    updatePassword,
    updateUsername,
  } = useAccount({ openSnackbar });

  useEffect(() => {
    if (accountAuthenticationManager.isAuthenticated) {
      signIn(accountAuthenticationManager.userCredentials);
    } else {
      singleSessionSignOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAuthenticationManager.isAuthenticated]);

  return (
    <AccountContext.Provider
      value={{
        authState: authState,
        axiosPrivate: axiosPrivate,
        axiosPublic: axiosPublic,
        accountActivitySummary: accountActivitySummary,
        allSessionsSignOut: allSessionsSignOut,
        deleteAccount: deleteAccount,
        signIn: signIn,
        signUp: signUp,
        singleSessionSignOut: singleSessionSignOut,
        updatePassword: updatePassword,
        updateUsername: updateUsername,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextWrapper;
