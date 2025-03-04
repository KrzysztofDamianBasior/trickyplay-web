// it triggers proper callback when Ban button is clicked
// it triggers proper callback when Unban button is clicked
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";

import {
  userStub,
  bannedStub,
  adminName,
  password,
} from "../../../../../__tests__/msw/stubs/users";
import { type AccountAuthenticationManager } from "../../../../services/__tests__/beds/AccountContextWrapper";
import NotificationContextAndSigningAccountContextWrapper from "../../../../services/__tests__/beds/NotificationContextAndSigningAccountContextWrapper";

import UserRow from "../UserRow";
import {
  type HandleGrantAdminPermissionsType,
  type HandleUserBanType,
  type HandleUserUnbanType,
} from "../../../../services/usersPaginatedCollection/useUsersPaginatedCollection";
import { type UserDetailsType } from "../../../../models/internalAppRepresentation/resources";

const accountAuthenticationManager: AccountAuthenticationManager = {
  isAuthenticated: true,
  userCredentials: {
    username: adminName,
    password: password,
  },
};

describe("UserRow component", () => {
  it("should properly render user details", async () => {
    const handleUserBan: HandleUserBanType = vi.fn();
    const handleUserUnban: HandleUserUnbanType = vi.fn();
    const handleGrantAdminPermissions: HandleGrantAdminPermissionsType =
      vi.fn();

    const userDetails: UserDetailsType = {
      ...userStub,
      id: userStub.id.toString(),
      role: "USER",
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <UserRow
          userPage={0}
          handleGrantAdminPermissions={handleGrantAdminPermissions}
          handleUserBan={handleUserBan}
          handleUserUnban={handleUserUnban}
          userDetails={userDetails}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const tableCells = screen.getAllByRole("cell");
    expect(tableCells).toHaveLength(6);
    expect(tableCells[0]).toHaveTextContent(userDetails.id);
    expect(tableCells[1]).toHaveTextContent(userDetails.name);
    expect(tableCells[2]).toHaveTextContent(userDetails.role);
    expect(tableCells[3]).toHaveTextContent(
      new Date(userDetails.createdAt).toLocaleString()
    );
    expect(tableCells[4]).toHaveTextContent(
      new Date(userDetails.updatedAt).toLocaleString()
    );

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(2);

    expect(buttons[0]).toHaveTextContent("Grant admin permissions");
    expect(buttons[1]).toHaveTextContent("Ban");
  });

  it("should properly trigger proper callback when Grant-admin-permissions button is clicked", async () => {
    const handleUserBan: HandleUserBanType = vi.fn();
    const handleUserUnban: HandleUserUnbanType = vi.fn();
    const handleGrantAdminPermissions: HandleGrantAdminPermissionsType =
      vi.fn();

    const userDetails: UserDetailsType = {
      ...userStub,
      id: userStub.id.toString(),
      role: "USER",
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <UserRow
          userPage={0}
          handleGrantAdminPermissions={handleGrantAdminPermissions}
          handleUserBan={handleUserBan}
          handleUserUnban={handleUserUnban}
          userDetails={userDetails}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const grantAdminPermissionsButton = await screen.findByRole("button", {
      name: "Grant admin permissions",
    });

    await userEvent.click(grantAdminPermissionsButton); //userEvent triggers more events than fireEvent

    expect(handleGrantAdminPermissions).toHaveBeenCalledTimes(1);
  });

  it("should properly trigger proper callback when Ban button is clicked", async () => {
    const handleUserBan: HandleUserBanType = vi.fn();
    const handleUserUnban: HandleUserUnbanType = vi.fn();
    const handleGrantAdminPermissions: HandleGrantAdminPermissionsType =
      vi.fn();

    const userDetails: UserDetailsType = {
      ...userStub,
      id: userStub.id.toString(),
      role: "USER",
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <UserRow
          userPage={0}
          handleGrantAdminPermissions={handleGrantAdminPermissions}
          handleUserBan={handleUserBan}
          handleUserUnban={handleUserUnban}
          userDetails={userDetails}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const banButton = await screen.findByRole("button", {
      name: "Ban",
    });

    await userEvent.click(banButton); //userEvent triggers more events than fireEvent

    expect(handleUserBan).toHaveBeenCalledTimes(1);
  });

  it("should properly trigger proper callback when Unban button is clicked", async () => {
    const handleUserBan: HandleUserBanType = vi.fn();
    const handleUserUnban: HandleUserUnbanType = vi.fn();
    const handleGrantAdminPermissions: HandleGrantAdminPermissionsType =
      vi.fn();

    const userDetails: UserDetailsType = {
      ...bannedStub,
      id: bannedStub.id.toString(),
      role: "BANNED",
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rerender } = render(
      <NotificationContextAndSigningAccountContextWrapper
        accountAuthenticationManager={accountAuthenticationManager}
      >
        <UserRow
          userPage={0}
          handleGrantAdminPermissions={handleGrantAdminPermissions}
          handleUserBan={handleUserBan}
          handleUserUnban={handleUserUnban}
          userDetails={userDetails}
        />
      </NotificationContextAndSigningAccountContextWrapper>
    );

    const unbanButton = await screen.findByRole("button", {
      name: "Unban",
    });

    await userEvent.click(unbanButton); //userEvent triggers more events than fireEvent

    expect(handleUserUnban).toHaveBeenCalledTimes(1);
  });
});
