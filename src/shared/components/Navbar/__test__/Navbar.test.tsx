import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";

import NotificationContextAndSigningAccountContextWrapper from "../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import { type AccountAuthenticationManager } from "../../../services/__tests__/beds/AccountContextWrapper";
import { password, userName } from "../../../../__tests__/msw/stubs/users";

import { ThemeContext } from "../../../services/theme/ThemeContext";
import Navbar from "../index";

describe("Navbar component", () => {
  it("should render list of links properly, displays the appropriate buttons depending on the LOGGED_IN state", async () => {
    expect.assertions(7);

    const accountAuthenticationManager: AccountAuthenticationManager = {
      isAuthenticated: true,
      userCredentials: {
        username: userName,
        password: password,
      },
    };

    const isDarkMode: boolean = true;
    const toggle: () => void = vi.fn();
    const enable: () => void = vi.fn();
    const disable: () => void = vi.fn();
    const set: (value: boolean) => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <BrowserRouter>
        <ThemeContext.Provider
          value={{ isDarkMode, toggle, enable, disable, set }}
        >
          <NotificationContextAndSigningAccountContextWrapper
            accountAuthenticationManager={accountAuthenticationManager}
          >
            <Navbar />
          </NotificationContextAndSigningAccountContextWrapper>
        </ThemeContext.Provider>
      </BrowserRouter>
    );
    // screen.getByRole("");
    const banner = screen.getByRole("banner");
    expect(banner).toBeInTheDocument();

    // const tablist = screen.getByRole("tablist");
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent("Home");
    expect(tabs[1]).toHaveTextContent("Games");
    expect(tabs[2]).toHaveTextContent("Account");

    const buttons = screen.getAllByRole("button");

    await waitFor(() => {
      expect(buttons[0]).toHaveTextContent("Account");
    });
    expect(buttons[1]).toHaveTextContent("Logout");
  });

  it("should render list of links properly, displays the appropriate buttons depending on the LOGGED_OUT state", async () => {
    const accountAuthenticationManager: AccountAuthenticationManager = {
      isAuthenticated: false,
    };

    const isDarkMode: boolean = true;
    const toggle: () => void = vi.fn();
    const enable: () => void = vi.fn();
    const disable: () => void = vi.fn();
    const set: (value: boolean) => void = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <BrowserRouter>
        <ThemeContext.Provider
          value={{ isDarkMode, toggle, enable, disable, set }}
        >
          <NotificationContextAndSigningAccountContextWrapper
            accountAuthenticationManager={accountAuthenticationManager}
          >
            <Navbar />
          </NotificationContextAndSigningAccountContextWrapper>
        </ThemeContext.Provider>
      </BrowserRouter>
    );
    // screen.getByRole("");
    const banner = screen.getByRole("banner");
    expect(banner).toBeInTheDocument();

    // const tablist = screen.getByRole("tablist");
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent("Home");
    expect(tabs[1]).toHaveTextContent("Games");
    expect(tabs[2]).toHaveTextContent("Account");

    const buttons = screen.getAllByRole("button");
    await waitFor(() => expect(buttons[0]).toHaveTextContent("Login"));
    expect(buttons[1]).toHaveTextContent("SignUp");
  });
});
