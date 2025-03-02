import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it } from "vitest";

import AnimatedPage from "..";

describe("ActionButton component", () => {
  it("should render children elements", async () => {
    expect.assertions(2);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <AnimatedPage>
        <input type="checkbox" />
      </AnimatedPage>
    );

    // screen.getByRole("");
    // screen.debug(undefined, undefined, { highlight: false });
    // screen.debug(animatedPage, 7000);

    const animatedPage = screen.getByTestId("animated-page");
    const checkboxChild = screen.getByRole("checkbox");

    expect(animatedPage).toBeInTheDocument();
    expect(checkboxChild).toBeInTheDocument();
  });

  it("the opacity should be close to 1 within 1 second after the component is mounted", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <AnimatedPage>
        <div></div>
      </AnimatedPage>
    );
    const animatedPage = screen.getByTestId("animated-page");
    expect(animatedPage).toBeInTheDocument();
    expect(animatedPage.style.opacity).toBeCloseTo(0);

    await waitFor(() => expect(animatedPage.style.opacity).toBeCloseTo(1));
  });
});
