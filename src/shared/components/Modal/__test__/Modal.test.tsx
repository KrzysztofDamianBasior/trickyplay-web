import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import Modal from "../index";

describe("Modal component", () => {
  it("should render modal content, footer and body, when the prop isModalOpen equals true", async () => {
    const onClose: () => void = vi.fn();
    const onConfirm: () => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Modal
        isModalOpened={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="modal title"
      >
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </Modal>
    );

    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();
  });

  it("should not render modal content, footer and body, when the prop isModalOpen equals false", async () => {
    const onClose: () => void = vi.fn();
    const onConfirm: () => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Modal
        isModalOpened={false}
        onClose={onClose}
        onConfirm={onConfirm}
        title="modal title"
      >
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </Modal>
    );

    const checkboxChild = screen.queryByRole("checkbox");
    const paragraphChild = screen.queryByRole("paragraph");
    const fragmentChild = screen.queryByText("And one more fragment");

    expect(checkboxChild).not.toBeInTheDocument();
    expect(paragraphChild).not.toBeInTheDocument();
    expect(fragmentChild).not.toBeInTheDocument();
  });

  it("should properly trigger event handler when the cancel button is clicked", async () => {
    const onClose: () => void = vi.fn();
    const onConfirm: () => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Modal
        isModalOpened={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="modal title"
      >
        <h1>heading</h1>
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </Modal>
    );

    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[0]).toHaveTextContent("Cancel");

    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[1]).toHaveTextContent("Continue");

    await userEvent.click(buttons[0]); //userEvent triggers more events than fireEvent

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should properly trigger event handler when the continue button is clicked", async () => {
    const onClose: () => void = vi.fn();
    const onConfirm: () => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <Modal
        isModalOpened={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="modal title"
      >
        <p>paragraph</p>
        <input type="checkbox" />
        <div>And one more fragment</div>
      </Modal>
    );

    const checkboxChild = screen.getByRole("checkbox");
    const paragraphChild = screen.getByRole("paragraph");
    const fragmentChild = screen.getByText("And one more fragment");

    expect(checkboxChild).toBeInTheDocument();
    expect(paragraphChild).toBeInTheDocument();
    expect(fragmentChild).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[0]).toHaveTextContent("Cancel");

    expect(buttons[1]).toBeInTheDocument();
    expect(buttons[1]).toHaveTextContent("Continue");

    await userEvent.click(buttons[1]); //userEvent triggers more events than fireEvent

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
