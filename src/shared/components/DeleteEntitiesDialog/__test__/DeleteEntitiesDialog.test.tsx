import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import DialogsContextWrapper, {
  DialogsStateManager,
} from "../../../services/__tests__/beds/DialogsContextWrapper";
import { userSnakeCommentsCollectionStub } from "../../../../__tests__/msw/stubs/comments";
import { userRepliesCollectionStub } from "../../../../__tests__/msw/stubs/replies";

import DeleteEntitiesDialog from "../DeleteEntitiesDialog";

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

describe("DeleteEntitiesDialog component", () => {
  it("should complete the delete account process correctly, when the submit button is pressed, when comments to delete are passed", async () => {
    render(
      <DialogsContextWrapper
        dialogsStateManager={dialogsStateManagerWithCommentsToDelete}
      >
        <DeleteEntitiesDialog />
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

    const closeButton = screen.getByRole("button");
    const title = screen.getByRole("heading");
    const infoContent = screen.getByText(
      /The deletion operation was performed successfully./i,
      {
        exact: false,
      }
    ); // substring match, ignore case

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(infoContent).toBeInTheDocument();
  });

  it("should complete the delete account process correctly, when the submit button is pressed, when replies to delete are passed", async () => {
    render(
      <DialogsContextWrapper
        dialogsStateManager={dialogsStateManagerWithRepliesToDelete}
      >
        <DeleteEntitiesDialog />
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

    const closeButton = screen.getByRole("button");
    const title = screen.getByRole("heading");
    const infoContent = screen.getByText(
      /The deletion operation was performed successfully./i,
      {
        exact: false,
      }
    ); // substring match, ignore case

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(infoContent).toBeInTheDocument();
  });
});
