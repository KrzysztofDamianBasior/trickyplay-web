import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ChangeUsernameDialog from "..";

import { password, userName } from "../../../../__tests__/msw/stubs/users";
import DialogsContextWrapper, {
  DialogsStateManager,
} from "../../../services/__tests__/beds/DialogsContextWrapper";
import { AccountAuthenticationManager } from "../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";

const dialogsStateManager: DialogsStateManager = {
  changePasswordDialogManager: {
    isChangePasswordDialogOpened: false,
  },
  changeUsernameDialogManager: {
    isChangeUsernameDialogOpened: true,
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

describe("ChangeUsernameDialog component", () => {
  it("should complete the user name change process correctly", async () => {
    render(
      <DialogsContextWrapper dialogsStateManager={dialogsStateManager}>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <ChangeUsernameDialog />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    // const delay = (delayInms: number) => {
    //   return new Promise((resolve) => setTimeout(resolve, delayInms));
    // };
    // await delay(1000);
    // screen.getByRole("");

    await waitFor(() =>
      expect(screen.getByRole("heading")).toHaveTextContent("Change username")
    );

    const greetings = screen.getByText(/^Hello .+$/i);
    expect(greetings).toBeInTheDocument();

    const operatingInstructions = screen.getByText(
      /^To change your username, please enter your new name$/i
    );
    expect(operatingInstructions).toBeInTheDocument();

    const newUsernameField = screen.getByLabelText(/Update username to:/i);
    expect(newUsernameField).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Change username",
    });
    expect(submitButton).toBeInTheDocument();

    await userEvent.type(newUsernameField, "NewUser");
    await userEvent.click(submitButton);

    // screen.getByRole("");
    const infoContent = await screen.findByText(
      /Your username has been updated/i,
      {
        exact: false,
      }
    ); // substring match, ignore case

    expect(infoContent).toBeInTheDocument();
  });
});
