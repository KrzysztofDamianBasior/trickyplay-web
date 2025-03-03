import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import AccountDeleteFailed from "../AccountDeleteFailed";

describe("AccountDeleteFailed component", () => {
  it("should render button, heading and message", async () => {
    expect.assertions(3);
    const onClose = vi.fn();

    render(
      <AccountDeleteFailed
        deleteAccountResult={{ status: 500, message: "Internal server error" }}
        onCloseDialog={onClose}
      />
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const closeButton = screen.getByRole("button");
    const title = screen.getByRole("heading");

    // const infoContent = screen.getByRole("paragraph");
    const infoContent = screen.getByText(/Internal server error/i, {
      exact: false,
    }); // substring match, ignore case

    expect(closeButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(infoContent).toBeInTheDocument();
  });

  it("should properly trigger the onClick event handler", async () => {
    expect.assertions(1);
    const onClose = vi.fn();

    render(
      <AccountDeleteFailed
        deleteAccountResult={{ status: 500, message: "Internal server error" }}
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
