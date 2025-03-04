import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { adminName, password } from "../../../../__tests__/msw/stubs/users";
import { repliesCollectionStub } from "../../../../__tests__/msw/stubs/replies";
import { type AccountAuthenticationManager } from "../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import DialogsContextWrapper, {
  DialogsStateManager,
} from "../../../services/__tests__/beds/DialogsContextWrapper";

import DeleteEntitiesDialog from "../../DeleteEntitiesDialog/DeleteEntitiesDialog";
import RepliesManagerTable from "../index";

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

describe("RepliesManagerTable component", () => {
  it("should properly render replies table content", async () => {
    const parentCommentId: string = "1";

    render(
      <DialogsContextWrapper dialogsStateManager={dialogsStateManager}>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <RepliesManagerTable
            tableType="COMMENT_REPLIES"
            parentCommentId={parentCommentId}
          />
        </NotificationContextAndSigningAccountContextWrapper>
        <DeleteEntitiesDialog />
      </DialogsContextWrapper>
    );

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Replies Table");

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("id");
    expect(headers[1]).toHaveTextContent("content");
    expect(headers[2]).toHaveTextContent("created at");
    expect(headers[3]).toHaveTextContent("last updated at");
    expect(headers[4]).toHaveTextContent("author");
    expect(headers[5]).toHaveTextContent("actions");

    const actionButtons = await screen.findAllByRole("button", {
      name: "Delete",
    });

    const repliesOfChosenComment = repliesCollectionStub.filter(
      (repl) => repl.parentComment.id.toString() === parentCommentId
    );

    const repliesLength = repliesOfChosenComment.length;
    const initialRepliesPerPage = 10;
    const numberOfDisplayedReplies =
      repliesLength > initialRepliesPerPage
        ? initialRepliesPerPage
        : repliesLength;

    expect(actionButtons).toHaveLength(numberOfDisplayedReplies);

    expect(screen.getAllByRole("row")).toHaveLength(
      numberOfDisplayedReplies + 1
    );
  });
});
