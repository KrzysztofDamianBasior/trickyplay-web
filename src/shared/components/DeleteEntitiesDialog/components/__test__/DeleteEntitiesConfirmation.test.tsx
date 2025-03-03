import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountAuthenticationManager } from "../../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import { userName, password } from "../../../../../__tests__/msw/stubs/users";
import DialogsContextWrapper, {
  DialogsStateManager,
} from "../../../../services/__tests__/beds/DialogsContextWrapper";

import DeleteEntitiesConfirmation from "../DeleteEntitiesConfirmation";
import { type DeleteEntitiesDialogStatusType } from "../../DeleteEntitiesDialog";
import { type DeleteEntitiesOnConfirmResultType } from "../../../../services/dialogs/DialogsContext";
import { userSnakeCommentsCollectionStub } from "../../../../../__tests__/msw/stubs/comments";
import { userRepliesCollectionStub } from "../../../../../__tests__/msw/stubs/replies";

const dialogsStateManagerWithCommentsToDelete: DialogsStateManager = {
  changePasswordDialogManager: {
    isChangePasswordDialogOpened: false,
  },
  changeUsernameDialogManager: {
    isChangeUsernameDialogOpened: false,
  },
  deleteAccountConfirmationDialogManager: {
    isDeleteAccountConfirmationDialogOpened: false,
  },
  deleteEntitiesConfirmationDialogManager: {
    isDeleteEntitiesConfirmationDialogOpened: true,
    commentsToDelete: [
      {
        ...userSnakeCommentsCollectionStub[0],
        id: userSnakeCommentsCollectionStub[0].id.toString(),
        gameName: "Snake",
        author: {
          ...userSnakeCommentsCollectionStub[0].author,
          id: userSnakeCommentsCollectionStub[0].author.id.toString(),
        },
      },
      {
        ...userSnakeCommentsCollectionStub[1],
        id: userSnakeCommentsCollectionStub[1].id.toString(),
        gameName: "Snake",
        author: {
          ...userSnakeCommentsCollectionStub[1].author,
          id: userSnakeCommentsCollectionStub[1].author.id.toString(),
        },
      },
    ],
    repliesToDelete: [],
    onConfirm: async () => {
      return {
        deleteCommentsResults: [
          { message: "Success", status: 200 },
          { message: "Success", status: 200 },
        ],
        deleteRepliesResults: [],
      };
    },
  },
};
const dialogsStateManagerWithRepliesToDelete: DialogsStateManager = {
  changePasswordDialogManager: {
    isChangePasswordDialogOpened: false,
  },
  changeUsernameDialogManager: {
    isChangeUsernameDialogOpened: false,
  },
  deleteAccountConfirmationDialogManager: {
    isDeleteAccountConfirmationDialogOpened: false,
  },
  deleteEntitiesConfirmationDialogManager: {
    isDeleteEntitiesConfirmationDialogOpened: true,
    commentsToDelete: [],
    repliesToDelete: [
      {
        ...userRepliesCollectionStub[0],
        id: userRepliesCollectionStub[0].id.toString(),
        author: {
          ...userRepliesCollectionStub[0].author,
          id: userRepliesCollectionStub[0].author.id.toString(),
        },
        parentCommentId:
          userRepliesCollectionStub[0].parentComment.id.toString(),
      },
      {
        ...userRepliesCollectionStub[1],
        id: userRepliesCollectionStub[1].id.toString(),
        author: {
          ...userRepliesCollectionStub[1].author,
          id: userRepliesCollectionStub[1].author.id.toString(),
        },
        parentCommentId:
          userRepliesCollectionStub[1].parentComment.id.toString(),
      },
    ],
    onConfirm: async () => {
      return {
        deleteCommentsResults: [],
        deleteRepliesResults: [
          { message: "Success", status: 200 },
          { message: "Success", status: 200 },
        ],
      };
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

describe("DeleteEntitiesConfirmation component", () => {
  it("should render the form's initial content correctly, when comments to delete are passed", () => {
    const onClose = vi.fn();

    const setDeleteEntitiesDialogStatus: (
      status: DeleteEntitiesDialogStatusType
    ) => void = vi.fn();

    const setDeleteEntitiesResults: (
      props: Awaited<DeleteEntitiesOnConfirmResultType>
    ) => void = vi.fn();

    render(
      <DialogsContextWrapper
        dialogsStateManager={dialogsStateManagerWithCommentsToDelete}
      >
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <DeleteEntitiesConfirmation
            setDeleteEntitiesDialogStatus={setDeleteEntitiesDialogStatus}
            setDeleteEntitiesResults={setDeleteEntitiesResults}
            onCloseDialog={onClose}
          />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const deleteEntitiesConfirmationTitle = screen.getByRole("heading");
    expect(deleteEntitiesConfirmationTitle).toBeInTheDocument();
    expect(deleteEntitiesConfirmationTitle).toHaveTextContent(
      "Are you sure you want to delete these entities?"
    );

    const operatingInstructions = screen.getByText(/Comments/i);
    expect(operatingInstructions).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Delete entities",
    });
    expect(submitButton).toBeInTheDocument();
  });

  it("should call the onSubmit function, when the submit button is pressed, when comments to delete are passed", async () => {
    const onClose = vi.fn();

    const setDeleteEntitiesDialogStatus: (
      status: DeleteEntitiesDialogStatusType
    ) => void = vi.fn();

    const setDeleteEntitiesResults: (
      props: Awaited<DeleteEntitiesOnConfirmResultType>
    ) => void = vi.fn();

    render(
      <DialogsContextWrapper
        dialogsStateManager={dialogsStateManagerWithCommentsToDelete}
      >
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <DeleteEntitiesConfirmation
            setDeleteEntitiesDialogStatus={setDeleteEntitiesDialogStatus}
            setDeleteEntitiesResults={setDeleteEntitiesResults}
            onCloseDialog={onClose}
          />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const deleteEntitiesConfirmationTitle = screen.getByRole("heading");
    expect(deleteEntitiesConfirmationTitle).toBeInTheDocument();
    expect(deleteEntitiesConfirmationTitle).toHaveTextContent(
      "Are you sure you want to delete these entities?"
    );

    const operatingInstructions = screen.getByText(/Comments/i);
    expect(operatingInstructions).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Delete entities",
    });
    expect(submitButton).toBeInTheDocument();

    await userEvent.click(submitButton);

    await waitFor(() =>
      expect(setDeleteEntitiesDialogStatus).toBeCalledWith(
        "OPERATION_SUCCEEDED"
      )
    );
    expect(setDeleteEntitiesResults).toBeCalledWith({
      deleteCommentsResults: [
        { message: "Success", status: 200 },
        { message: "Success", status: 200 },
      ],
      deleteRepliesResults: [],
    });
  });

  it("should render the form's initial content correctly, when replis to delete are passed", () => {
    const onClose = vi.fn();

    const setDeleteEntitiesDialogStatus: (
      status: DeleteEntitiesDialogStatusType
    ) => void = vi.fn();

    const setDeleteEntitiesResults: (
      props: Awaited<DeleteEntitiesOnConfirmResultType>
    ) => void = vi.fn();

    render(
      <DialogsContextWrapper
        dialogsStateManager={dialogsStateManagerWithRepliesToDelete}
      >
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <DeleteEntitiesConfirmation
            setDeleteEntitiesDialogStatus={setDeleteEntitiesDialogStatus}
            setDeleteEntitiesResults={setDeleteEntitiesResults}
            onCloseDialog={onClose}
          />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const deleteEntitiesConfirmationTitle = screen.getByRole("heading");
    expect(deleteEntitiesConfirmationTitle).toBeInTheDocument();
    expect(deleteEntitiesConfirmationTitle).toHaveTextContent(
      "Are you sure you want to delete these entities?"
    );

    const operatingInstructions = screen.getByText(/Replies/i);
    expect(operatingInstructions).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Delete entities",
    });
    expect(submitButton).toBeInTheDocument();
  });

  it("should call the onSubmit function, when the submit button is pressed, when replies to delete are passed", async () => {
    const onClose = vi.fn();

    const setDeleteEntitiesDialogStatus: (
      status: DeleteEntitiesDialogStatusType
    ) => void = vi.fn();

    const setDeleteEntitiesResults: (
      props: Awaited<DeleteEntitiesOnConfirmResultType>
    ) => void = vi.fn();

    render(
      <DialogsContextWrapper
        dialogsStateManager={dialogsStateManagerWithRepliesToDelete}
      >
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <DeleteEntitiesConfirmation
            setDeleteEntitiesDialogStatus={setDeleteEntitiesDialogStatus}
            setDeleteEntitiesResults={setDeleteEntitiesResults}
            onCloseDialog={onClose}
          />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const deleteEntitiesConfirmationTitle = screen.getByRole("heading");
    expect(deleteEntitiesConfirmationTitle).toBeInTheDocument();
    expect(deleteEntitiesConfirmationTitle).toHaveTextContent(
      "Are you sure you want to delete these entities?"
    );

    const operatingInstructions = screen.getByText(/Replies/i);
    expect(operatingInstructions).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Delete entities",
    });
    expect(submitButton).toBeInTheDocument();

    await userEvent.click(submitButton);

    await waitFor(() =>
      expect(setDeleteEntitiesDialogStatus).toBeCalledWith(
        "OPERATION_SUCCEEDED"
      )
    );
    expect(setDeleteEntitiesResults).toBeCalledWith({
      deleteCommentsResults: [],
      deleteRepliesResults: [
        { message: "Success", status: 200 },
        { message: "Success", status: 200 },
      ],
    });
  });
});
