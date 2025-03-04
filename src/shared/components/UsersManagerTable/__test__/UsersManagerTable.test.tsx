import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  adminName,
  password,
  usersCollectionStub,
} from "../../../../__tests__/msw/stubs/users";
import { type AccountAuthenticationManager } from "../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";

import UserManagerTable from "../index";

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: adminName,
    password: password,
  },
};

describe("UserManagerTable component", () => {
  it("should properly render users table content", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <UserManagerTable />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    // screen.getByRole("");

    // import { within } from "@testing-library/react";
    // const table = getByRole("table")
    // const tbody = within(table).getAllByRole("rowgroup")[1]
    // const rows = within(tbody).getAllByRole("row")
    // const columns = within(row).getAllByRole("cell");

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Users Table");

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("id");
    expect(headers[1]).toHaveTextContent("name");
    expect(headers[2]).toHaveTextContent("role");
    expect(headers[3]).toHaveTextContent("created at");
    expect(headers[4]).toHaveTextContent("last updated at");
    expect(headers[5]).toHaveTextContent("actions");

    const initialUsersPerPage = 10;

    const actionButtons = await screen.findAllByRole("button", {
      name: "Grant admin permissions",
    });
    const numberOfCasualUsers = usersCollectionStub
      .slice(0, initialUsersPerPage)
      .filter((user) => user.role === "USER").length;
    expect(actionButtons).toHaveLength(numberOfCasualUsers);

    expect(screen.getAllByRole("row")).toHaveLength(initialUsersPerPage + 1); // users + header
  });
});
