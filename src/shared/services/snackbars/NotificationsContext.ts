import { createContext } from "react";
import { NotificationDetailsType } from "./useNotifications";

export type NotificationContextType = {
  openSnackbar: ({
    title,
    body,
    severity,
  }: Omit<NotificationDetailsType, "key">) => void;
  closeSnackbar: (event: React.SyntheticEvent | Event, reason?: string) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  closeSnackbar: () => {},
  openSnackbar: () => {},
});
