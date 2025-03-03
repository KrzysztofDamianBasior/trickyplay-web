import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DeleteEntitiesFailed from "../DeleteEntitiesFailed";

describe("DeleteEntitiesFailed component", () => {
  it("should render button, heading and message when delete comments results are passed", async () => {
    expect.assertions(3);
    const onClose = vi.fn();

    render(
      <DeleteEntitiesFailed
        deleteEntitiesResults={{
          deleteCommentsResults: [
            { message: "Network error", status: 500 },
            { message: "Success", status: 200 },
          ],
          deleteRepliesResults: [],
        }}
        onCloseDialog={onClose}
      />
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const closeButton = screen.getByRole("button", { name: "Continue" });
    const title = screen.getByRole("heading", {
      name: /Failed to delete entities/i,
    });

    // const infoContent = screen.getByRole("paragraph");
    const infoContent = screen.getByText(
      /number of successfully deleted comments: 1, number of failed comment deletes: 1/i,
      {
        exact: false,
      }
    ); // substring match, ignore case

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(infoContent).toBeInTheDocument();
  });

  it("should render button, heading and message when delete replies results are passed", async () => {
    expect.assertions(3);
    const onClose = vi.fn();

    render(
      <DeleteEntitiesFailed
        deleteEntitiesResults={{
          deleteRepliesResults: [
            { message: "Network error", status: 500 },
            { message: "Success", status: 200 },
          ],
          deleteCommentsResults: [],
        }}
        onCloseDialog={onClose}
      />
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const closeButton = screen.getByRole("button", { name: "Continue" });
    const title = screen.getByRole("heading", {
      name: /Failed to delete entities/i,
    });

    // const infoContent = screen.getByRole("paragraph");
    const infoContent = screen.getByText(
      /number of successfully deleted replies: 1, number of failed replies deletes: 1/i,
      {
        exact: false,
      }
    ); // substring match, ignore case

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(infoContent).toBeInTheDocument();
  });

  it("should properly trigger the onClose event handler", async () => {
    expect.assertions(1);
    const onClose = vi.fn();

    render(
      <DeleteEntitiesFailed
        deleteEntitiesResults={{
          deleteCommentsResults: [
            { message: "Network error", status: 500 },
            { message: "Success", status: 200 },
          ],
          deleteRepliesResults: [],
        }}
        onCloseDialog={onClose}
      />
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const closeButton = screen.getByRole("button");

    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
