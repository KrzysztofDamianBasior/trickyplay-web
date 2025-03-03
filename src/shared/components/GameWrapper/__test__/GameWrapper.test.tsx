import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import GameWrapper from "..";

describe("GameWrapper component", () => {
  it("should render children elements", async () => {
    expect.assertions(5);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <GameWrapper data-testid="game-wrapper">
        <h1>heading</h1>
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </GameWrapper>
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const gameWrapper = screen.getByTestId("game-wrapper");
    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const headingChild = screen.getByRole("heading");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(gameWrapper).toBeInTheDocument();
    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(headingChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();
  });
});
