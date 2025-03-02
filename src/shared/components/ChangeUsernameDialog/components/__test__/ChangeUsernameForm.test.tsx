import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountAuthenticationManager } from "../../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import { userName, password } from "../../../../../__tests__/msw/stubs/users";

import ChangeUsernameForm from "../ChangeUsernameForm";
import { type ChangeUsernameDialogStatusType } from "../..";

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: userName,
    password: password,
  },
};

describe("ChangeUsernameForm component", () => {
  it("should render the form's initial content correctly", () => {
    const onClose = vi.fn();

    const changeUsernameDialogStatus: (
      status: ChangeUsernameDialogStatusType
    ) => void = vi.fn();

    const setDialogStatus = (status: ChangeUsernameDialogStatusType) => {
      changeUsernameDialogStatus(status);
    };

    render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <ChangeUsernameForm
          setDialogStatus={setDialogStatus}
          onCloseDialog={onClose}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const changUsernameFormTitle = screen.getByRole("heading");
    expect(changUsernameFormTitle).toBeInTheDocument();
    expect(changUsernameFormTitle).toHaveTextContent("Change username");

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
  });

  it("should call the onSubmit function when the form field values are correct and the submit button is pressed", async () => {
    const onClose = vi.fn();

    const changeUsernameDialogStatus: (
      status: ChangeUsernameDialogStatusType
    ) => void = vi.fn();

    const setDialogStatus = (status: ChangeUsernameDialogStatusType) => {
      changeUsernameDialogStatus(status);
    };

    render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <ChangeUsernameForm
          setDialogStatus={setDialogStatus}
          onCloseDialog={onClose}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const changUsernameFormTitle = screen.getByRole("heading");
    expect(changUsernameFormTitle).toBeInTheDocument();
    expect(changUsernameFormTitle).toHaveTextContent("Change username");

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

    await waitFor(() =>
      expect(changeUsernameDialogStatus).toBeCalledWith("OPERATION_SUCCEEDED")
    );
  });
});
