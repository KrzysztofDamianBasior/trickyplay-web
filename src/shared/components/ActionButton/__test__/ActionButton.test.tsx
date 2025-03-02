import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import ActionButton from "..";

describe("ActionButton component", () => {
  it("should render children elements", () => {
    expect.assertions(3);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <ActionButton onClick={() => {}} data-testid="action-button">
        <input type="checkbox" />
      </ActionButton>
    );
    const actionButton = screen.getByRole("button");
    const checkboxChild = screen.getByRole("checkbox");

    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toBeEnabled();
    expect(checkboxChild).toBeInTheDocument();

    // screen.debug(undefined, null, {highlight: false})
    // screen.debug(actionButton, 7000);
  });

  it("should properly trigger the onClick event handler", async () => {
    const onClick = vi.fn();

    render(
      <ActionButton onClick={onClick} data-testid="action-button">
        <div>text content</div>
      </ActionButton>
    );

    // screen.getByRole('')
    const actionButton = screen.getByRole("button");

    await userEvent.click(actionButton); //userEvent triggers more events than fireEvent
    // fireEvent.click(actionButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
