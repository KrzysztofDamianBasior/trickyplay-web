import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import Backdrop from "../Backdrop";

describe("Backdrop component", () => {
  it("should render children elements", async () => {
    const onClick: () => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Backdrop onClick={onClick}>
        <h1>heading</h1>
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </Backdrop>
    );

    const backdrop = screen.getByTestId("backdrop");
    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const headingChild = screen.getByRole("heading");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(backdrop).toBeInTheDocument();
    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(headingChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();
  });

  it("the opacity should be close to 1 within 1 second after the component is mounted", async () => {
    const onClick: () => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Backdrop onClick={onClick}>
        <h1>heading</h1>
      </Backdrop>
    );

    const backdrop = screen.getByTestId("backdrop");
    expect(backdrop).toBeInTheDocument();
    expect(backdrop.style.opacity).toBeCloseTo(0);

    await waitFor(() => expect(backdrop.style.opacity).toBeCloseTo(1));
  });

  it("should properly trigger the onClick event handler", async () => {
    const onClick = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Backdrop onClick={onClick}>
        <h1>heading</h1>
      </Backdrop>
    );

    const backdrop = screen.getByTestId("backdrop");
    expect(backdrop).toBeInTheDocument();

    await userEvent.click(backdrop); //userEvent triggers more events than fireEvent

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
