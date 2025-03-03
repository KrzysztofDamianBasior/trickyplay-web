import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import StatefulButton from "..";

describe("StatefulButton component", () => {
  it("should render children elements", () => {
    expect.assertions(5);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <StatefulButton
        isActive={true}
        isDarkMode={true}
        data-testid="stateful-button"
      >
        <input type="checkbox" />
        <h1>heading</h1>
        <p>paragraph</p>
      </StatefulButton>
    );

    // const statefulButton = screen.getByRole("button");
    const statefulButton = screen.getByTestId("stateful-button");
    const checkboxChild = screen.getByRole("checkbox");
    const headingChild = screen.getByRole("heading");
    const paragraphChild = screen.getByRole("paragraph");

    expect(statefulButton).toBeInTheDocument();
    expect(statefulButton).toBeEnabled();
    expect(checkboxChild).toBeInTheDocument();
    expect(headingChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();

    // screen.debug(undefined, null, {highlight: false})
    // screen.debug(actionButton, 7000);
  });

  it("should properly trigger the onClick event handler", async () => {
    const onClick = vi.fn();

    render(
      <StatefulButton isActive={true} isDarkMode={true} onClick={onClick}>
        <div>text content</div>
      </StatefulButton>
    );

    // screen.getByRole('')
    const actionButton = screen.getByRole("button");

    await userEvent.click(actionButton); //userEvent triggers more events than fireEvent

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
