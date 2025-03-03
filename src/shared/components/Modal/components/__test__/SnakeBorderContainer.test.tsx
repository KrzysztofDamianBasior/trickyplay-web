import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import SnakeBorderContainer from "../SnakeBorderContainer";

describe("SnakeBorderContainer component", () => {
  it("should render children elements", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <SnakeBorderContainer
        size="lg"
        theme="light"
        data-testid="snake-border-container"
      >
        <h1>heading</h1>
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </SnakeBorderContainer>
    );

    const snakeBorderContainer = screen.getByTestId("snake-border-container");
    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const headingChild = screen.getByRole("heading");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(snakeBorderContainer).toBeInTheDocument();
    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(headingChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();
  });
});
