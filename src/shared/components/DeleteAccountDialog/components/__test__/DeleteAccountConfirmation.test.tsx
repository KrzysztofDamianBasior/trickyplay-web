import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountAuthenticationManager } from "../../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import { userName, password } from "../../../../../__tests__/msw/stubs/users";

import DeleteAccountConfirmation from "../DeleteAccountConfirmation";
import { type DeleteAccountDialogStatusType } from "../..";
import { type DeleteAccountResultType } from "../../../../services/account/AccountContext";

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: userName,
    password: password,
  },
};

describe("DeleteAccountConfirmation component", () => {
  it("should render the form's initial content correctly", () => {
    const onClose = vi.fn();

    const setDeleteAccountDialogStatus: (
      status: DeleteAccountDialogStatusType
    ) => void = vi.fn();

    const setDeleteAccountResult: (
      result: Awaited<DeleteAccountResultType>
    ) => void = vi.fn();

    render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <DeleteAccountConfirmation
          setDeleteAccountDialogStatus={setDeleteAccountDialogStatus}
          onCloseDialog={onClose}
          setDeleteAccountResult={setDeleteAccountResult}
        />
      </NotificationContextAndSigningAccountContextWrapper>
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

    const submitButton = screen.getByRole("button", {
      name: "Delete account",
    });
    expect(submitButton).toBeInTheDocument();

    const confirmCheckbox = screen.getByRole("checkbox", {
      name: /I confirm that I want to delete my account/i,
    });
    expect(confirmCheckbox).toBeInTheDocument();
  });

  it("should call the onClose function when the checkbox is checked and the submit button is pressed", async () => {
    const onClose = vi.fn();

    const setDeleteAccountDialogStatus: (
      status: DeleteAccountDialogStatusType
    ) => void = vi.fn();

    const setDeleteAccountResult: (
      result: Awaited<DeleteAccountResultType>
    ) => void = vi.fn();

    render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <DeleteAccountConfirmation
          setDeleteAccountDialogStatus={setDeleteAccountDialogStatus}
          onCloseDialog={onClose}
          setDeleteAccountResult={setDeleteAccountResult}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    // screen.getByRole('')

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

    await waitFor(() =>
      expect(setDeleteAccountDialogStatus).toBeCalledWith("OPERATION_SUCCEEDED")
    );
  });
});
