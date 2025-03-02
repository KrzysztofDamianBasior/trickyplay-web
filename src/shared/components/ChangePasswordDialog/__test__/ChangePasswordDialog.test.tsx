import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ChangePasswordDialog from "..";

import { password, userName } from "../../../../__tests__/msw/stubs/users";
import DialogsContextWrapper, {
  DialogsStateManager,
} from "../../../services/__tests__/beds/DialogsContextWrapper";
import { AccountAuthenticationManager } from "../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";

const dialogsStateManager: DialogsStateManager = {
  changePasswordDialogManager: {
    isChangePasswordDialogOpened: true,
  },
  changeUsernameDialogManager: {
    isChangeUsernameDialogOpened: false,
  },
  deleteAccountConfirmationDialogManager: {
    isDeleteAccountConfirmationDialogOpened: false,
  },
  deleteEntitiesConfirmationDialogManager: {
    isDeleteEntitiesConfirmationDialogOpened: false,
    commentsToDelete: [],
    repliesToDelete: [],
    onConfirm: async () => {
      return { deleteCommentsResults: [], deleteRepliesResults: [] };
    },
  },
};

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: userName,
    password: password,
  },
};

describe("ChangePasswordDialog component", () => {
  it("should complete the password change process correctly", async () => {
    render(
      <DialogsContextWrapper dialogsStateManager={dialogsStateManager}>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <ChangePasswordDialog />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    // const delay = (delayInms: number) => {
    //   return new Promise((resolve) => setTimeout(resolve, delayInms));
    // };
    // await delay(1000);
    // screen.getByRole("");

    await waitFor(() =>
      expect(screen.getByRole("heading")).toHaveTextContent("Change password")
    );

    const changePasswordDialogTitle = await screen.findByRole("heading");
    expect(changePasswordDialogTitle).toBeInTheDocument();
    expect(changePasswordDialogTitle).toHaveTextContent("Change password");

    const greetings = screen.getByText(/^Hello .+$/i);
    expect(greetings).toBeInTheDocument();

    const operatingInstructions = screen.getByText(
      /^To change your password, please enter .+$/i
    );
    expect(operatingInstructions).toBeInTheDocument();

    const newPasswordField = screen.getByPlaceholderText(
      /Enter your new password/i
    );
    expect(newPasswordField).toBeInTheDocument();

    const confirmNewPasswordField =
      screen.getByPlaceholderText(/Repeat new password/i);
    expect(confirmNewPasswordField).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Change password",
    });
    expect(submitButton).toBeInTheDocument();

    await userEvent.type(newPasswordField, "newPass123");
    await userEvent.type(confirmNewPasswordField, "newPass123");
    await userEvent.click(submitButton);

    // screen.getByRole("");
    const infoContent = await screen.findByText(
      /Password updated successfully/i,
      {
        exact: false,
      }
    ); // substring match, ignore case

    expect(infoContent).toBeInTheDocument();
  });
});
