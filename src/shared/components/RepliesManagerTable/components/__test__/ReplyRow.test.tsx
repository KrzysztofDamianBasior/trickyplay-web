import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import { adminName, password } from "../../../../../__tests__/msw/stubs/users";
import { userRepliesCollectionStub } from "../../../../../__tests__/msw/stubs/replies";
import { type AccountAuthenticationManager } from "../../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import DialogsContextWrapper, {
  type DialogsStateManager,
} from "../../../../services/__tests__/beds/DialogsContextWrapper";

import ReplyRow from "../ReplyRow";
import { type ReplyDetailsType } from "../../../../models/internalAppRepresentation/resources";
import { handleReplyDeleteType } from "../../../../services/repliesPaginatedCollection/useRepliesPaginatedCollection";
import DeleteEntitiesDialog from "../../../DeleteEntitiesDialog/DeleteEntitiesDialog";
import { DeleteReplyResultType } from "../../../../services/api/useRepliesAPIFacade";

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: adminName,
    password: password,
  },
};

const dialogsStateManager: DialogsStateManager = {
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
    isDeleteEntitiesConfirmationDialogOpened: false,
    commentsToDelete: [],
    repliesToDelete: [],
    onConfirm: async () => {
      return { deleteCommentsResults: [], deleteRepliesResults: [] };
    },
  },
};

describe("ReplyRow component", () => {
  it("should properly render reply details", async () => {
    const handleDelete: handleReplyDeleteType = vi.fn();

    const replyDetails: ReplyDetailsType = {
      ...userRepliesCollectionStub[0],
      id: userRepliesCollectionStub[0].id.toString(),
      author: {
        ...userRepliesCollectionStub[0].author,
        id: userRepliesCollectionStub[0].author.id.toString(),
      },
      parentCommentId: userRepliesCollectionStub[0].parentComment.id.toString(),
    };

    render(
      <DialogsContextWrapper dialogsStateManager={dialogsStateManager}>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <ReplyRow
            handleReplyDelete={handleDelete}
            replyDetails={replyDetails}
            replyPage={0}
          />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const tableCells = screen.getAllByRole("cell");
    expect(tableCells).toHaveLength(6);
    expect(tableCells[0]).toHaveTextContent(replyDetails.id);
    expect(tableCells[1]).toHaveTextContent(replyDetails.body);
    expect(tableCells[2]).toHaveTextContent(
      new Date(replyDetails.createdAt).toLocaleString()
    );
    expect(tableCells[3]).toHaveTextContent(
      new Date(replyDetails.updatedAt).toLocaleString()
    );
    expect(tableCells[4]).toHaveTextContent(replyDetails.author.name);

    const button = await screen.findByRole("button", { name: "Delete" });
    expect(button).toBeEnabled();
  });

  it("should properly trigger proper callback when Delete button is clicked", async () => {
    const resolvedResult: Awaited<DeleteReplyResultType> = {
      message: "Success",
      status: 200,
    };

    const handleDelete: handleReplyDeleteType = vi
      .fn()
      .mockResolvedValue(resolvedResult);

    const replyDetails: ReplyDetailsType = {
      ...userRepliesCollectionStub[0],
      id: userRepliesCollectionStub[0].id.toString(),
      author: {
        ...userRepliesCollectionStub[0].author,
        id: userRepliesCollectionStub[0].author.id.toString(),
      },
      parentCommentId: userRepliesCollectionStub[0].parentComment.id.toString(),
    };

    render(
      <DialogsContextWrapper dialogsStateManager={dialogsStateManager}>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <ReplyRow
            handleReplyDelete={handleDelete}
            replyDetails={replyDetails}
            replyPage={0}
          />
          <DeleteEntitiesDialog />
        </NotificationContextAndSigningAccountContextWrapper>
      </DialogsContextWrapper>
    );

    const button = await screen.findByRole("button", { name: "Delete" });

    await userEvent.click(button); //userEvent triggers more events than fireEvent

    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: "Are you sure you want to delete this reply?",
        })
      ).toBeVisible()
    );

    const confirmationButton = await screen.getByRole("button", {
      name: "Delete reply",
    });

    await userEvent.click(confirmationButton); //userEvent triggers more events than fireEvent

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
