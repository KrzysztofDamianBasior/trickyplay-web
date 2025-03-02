import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import Banner from "..";

describe("Banner component", () => {
  it("should render text content properly", async () => {
    expect.assertions(3);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(<Banner text="TicTacToe" />);

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });
    const banner = screen.getByTestId("banner");

    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent("TicTacToe");

    const text = banner.querySelector(".neon-text-effect__text");
    expect(text?.textContent).toEqual("TicTacToe");
  });
});
