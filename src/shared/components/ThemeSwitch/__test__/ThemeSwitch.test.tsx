import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import { ThemeContext } from "../../../services/theme/ThemeContext";
import ThemeSwitch from "..";

describe("ThemeSwitch component", () => {
  it("should properly trigger the onClick event handler", async () => {
    const isDarkMode: boolean = true;
    const toggle: () => void = vi.fn();
    const enable: () => void = vi.fn();
    const disable: () => void = vi.fn();
    const set: (value: boolean) => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <ThemeContext.Provider
        value={{ isDarkMode, toggle, enable, disable, set }}
      >
        <ThemeSwitch />
      </ThemeContext.Provider>
    );

    const actionButton = screen.getByTestId("theme-switch");

    await userEvent.click(actionButton); //userEvent triggers more events than fireEvent

    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
