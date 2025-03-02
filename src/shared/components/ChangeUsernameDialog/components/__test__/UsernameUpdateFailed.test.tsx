import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import UsernameUpdateFailed from "../UsernameUpdateFailed";

describe("UsernameUpdateFailed component", () => {
  it("should render button, heading and message", async () => {
    expect.assertions(3);
    const onClose = vi.fn();

    render(<UsernameUpdateFailed onCloseDialog={onClose} />);

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const closeButton = screen.getByRole("button");
    const title = screen.getByRole("heading");

    const infoContent = screen.getByText(
      /Unfortunately the username change process failed./i,
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

    render(<UsernameUpdateFailed onCloseDialog={onClose} />);

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const closeButton = screen.getByRole("button");

    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
