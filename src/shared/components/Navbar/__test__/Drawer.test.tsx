import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it } from "vitest";

import NotificationContextAndSigningAccountContextWrapper from "../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";
import { type AccountAuthenticationManager } from "../../../services/__tests__/beds/AccountContextWrapper";
import { password, userName } from "../../../../__tests__/msw/stubs/users";

import Drawer from "../Drawer";

describe("Drawer component", () => {
  it("should render the appropriate buttons depending on the LOGGED_IN state", async () => {
    expect.assertions(7);

    const accountAuthenticationManager: AccountAuthenticationManager = {
      isAuthenticated: true,
      userCredentials: {
        username: userName,
        password: password,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <BrowserRouter>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <Drawer />
        </NotificationContextAndSigningAccountContextWrapper>
      </BrowserRouter>
    );
    // screen.getByRole("");

    const openDrawerButton = screen.getByRole("button");
    await userEvent.click(openDrawerButton);

    const drawerRoot = screen.getByRole("presentation");
    expect(drawerRoot).toBeInTheDocument();
    const pagesList = screen.getByRole("list");
    expect(pagesList).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Home");
    expect(buttons[1]).toHaveTextContent("Games");
    expect(buttons[2]).toHaveTextContent("Account");
    expect(buttons[3]).toHaveTextContent("Account");
    expect(buttons[4]).toHaveTextContent("Logout");
  });

  it("should render the appropriate buttons depending on the LOGGED_OUT state", async () => {
    expect.assertions(7);

    const accountAuthenticationManager: AccountAuthenticationManager = {
      isAuthenticated: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <BrowserRouter>
        <NotificationContextAndSigningAccountContextWrapper
          accountAuthenticationManager={accountAuthenticationManager}
        >
          <Drawer />
        </NotificationContextAndSigningAccountContextWrapper>
      </BrowserRouter>
    );
    // screen.getByRole("");

    const openDrawerButton = screen.getByRole("button");
    await userEvent.click(openDrawerButton);

    const drawerRoot = screen.getByRole("presentation");
    expect(drawerRoot).toBeInTheDocument();
    const pagesList = screen.getByRole("list");
    expect(pagesList).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Home");
    expect(buttons[1]).toHaveTextContent("Games");
    expect(buttons[2]).toHaveTextContent("Account");
    expect(buttons[3]).toHaveTextContent("Login");
    expect(buttons[4]).toHaveTextContent("SignUp");
  });
});
