import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import ExternalLinkButton from "..";

describe("ExternalLinkButton component", () => {
  it("should render children elements", async () => {
    expect.assertions(5);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <ExternalLinkButton url="/">
        <h1>heading</h1>
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </ExternalLinkButton>
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });

    const externalLinkButton = screen.getByTestId("external-link-button");
    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const headingChild = screen.getByRole("heading");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(externalLinkButton).toBeInTheDocument();
    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(headingChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();
  });
});
