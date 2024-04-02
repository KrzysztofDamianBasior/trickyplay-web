import { useState, useEffect } from "react";

export type NotificationDetailsType = {
  title: string;
  body: string;
  key: number;
  severity: "error" | "warning" | "info" | "success";
};

export default function useNotifications() {
  const [snackPack, setSnackPack] = useState<
    readonly NotificationDetailsType[]
  >([]);
  const [isSnackbarOpened, setIsSnackbarOpened] = useState<boolean>(false);
  const [messageInfo, setMessageInfo] = useState<
    NotificationDetailsType | undefined
  >(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setIsSnackbarOpened(true);
    } else if (snackPack.length && messageInfo && isSnackbarOpened) {
      setIsSnackbarOpened(false);
    }
  }, [snackPack, messageInfo, isSnackbarOpened]);

  const openSnackbar = ({
    title,
    body,
    severity,
  }: Omit<NotificationDetailsType, "key">) => {
    setSnackPack((prev) => [
      ...prev,
      { key: new Date().getTime(), body, severity, title },
    ]);
  };

  const closeSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpened(false);
  };

  const handleSnackbarExited = () => {
    setMessageInfo(undefined);
  };

  return {
    openSnackbar,
    closeSnackbar,
    isSnackbarOpened,
    messageInfo,
    handleSnackbarExited,
  };
}
