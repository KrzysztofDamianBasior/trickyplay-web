import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import DeleteAccountDialog from "..";

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
    isChangeUsernameDialogOpened: false,
  },
  deleteAccountConfirmationDialogManager: {
    isDeleteAccountConfirmationDialogOpened: true,
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

describe("DeleteAccountDialog component", () => {
  it("should complete the delete account process correctly", async () => {
    render(
      <DialogsContextWrapper dialogsStateManager={dialogsStateManager}>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <DeleteAccountDialog />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const deleteAccountDialogTitle = screen.getByRole("heading");
    expect(deleteAccountDialogTitle).toBeInTheDocument();
    expect(deleteAccountDialogTitle).toHaveTextContent(
      "Delete your TickyPlay account"
    );

    const operatingInstructions = screen.getByText(
      /^Are you sure you want to delete your account?/i
    );
    expect(operatingInstructions).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /I confirm that I want to delete my account/i,
    });
    expect(confirmCheckbox).toBeInTheDocument();
    await userEvent.click(confirmCheckbox);

    const submitButton = screen.getByRole("button", {
      name: "Delete account",
    });
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    const closeButton = screen.getByRole("button");
    const title = screen.getByRole("heading");
    const infoContent = screen.getByText(/Your account has been deleted/i, {
      exact: false,
    }); // substring match, ignore case

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(infoContent).toBeInTheDocument();
  });
});
