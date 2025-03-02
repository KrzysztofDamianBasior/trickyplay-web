import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountAuthenticationManager } from "../../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import { userName, password } from "../../../../../__tests__/msw/stubs/users";

import ChangePasswordForm from "../ChangePasswordForm";
import { type ChangePasswordDialogStatusType } from "../..";

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: userName,
    password: password,
  },
};

describe("ChangePasswordDialog component", () => {
  it("should render the form's initial content correctly", () => {
    const onClose = vi.fn();

    const changePasswordDialogStatus: (
      status: ChangePasswordDialogStatusType
    ) => void = vi.fn();

    const setDialogStatus = (status: ChangePasswordDialogStatusType) => {
      changePasswordDialogStatus(status);
    };

    render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <ChangePasswordForm
          setDialogStatus={setDialogStatus}
          onCloseDialog={onClose}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const changePasswordDialogTitle = screen.getByRole("heading");
    expect(changePasswordDialogTitle).toBeInTheDocument();
    expect(changePasswordDialogTitle).toHaveTextContent("Change password");

    const greetings = screen.getByText(/^Hello .+$/i);
    expect(greetings).toBeInTheDocument();

    const operatingInstructions = screen.getByText(
      /^To change your password, please enter .+$/i
    );
    expect(operatingInstructions).toBeInTheDocument();

    const newPasswordField = screen.getByLabelText(/Confirm new password/i);
    expect(newPasswordField).toBeInTheDocument();

    const confirmNewPasswordField = screen.getByPlaceholderText(
      /Enter your new password/i
    );
    expect(confirmNewPasswordField).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Change password",
    });
    expect(submitButton).toBeInTheDocument();
  });

  it("should call the onSubmit function when the form field values are correct and the submit button is pressed", async () => {
    const onClose = vi.fn();

    const changePasswordDialogStatus: (
      status: ChangePasswordDialogStatusType
    ) => void = vi.fn();

    const setDialogStatus = (status: ChangePasswordDialogStatusType) => {
      changePasswordDialogStatus(status);
    };

    render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <ChangePasswordForm
          setDialogStatus={setDialogStatus}
          onCloseDialog={onClose}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    // screen.getByRole('')
    const changePasswordDialogTitle = screen.getByRole("heading");
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

    await waitFor(() =>
      expect(changePasswordDialogStatus).toBeCalledWith("OPERATION_SUCCEEDED")
    );
  });
});
