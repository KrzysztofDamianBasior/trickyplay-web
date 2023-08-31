import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

import useAccount from "../../../services/account/useAccount";
import {
  HandleGrantAdminPermissionsType,
  HandleUserBanType,
  HandleUserUnbanType,
} from "../../../services/usersPaginatedCollection/useUsersPaginatedCollection";
import { UserDetailsType } from "../../../services/api/useUsersAPIFacade";

type Props = {
  userDetails: UserDetailsType;
  userPage: number;
  handleUserBan: HandleUserBanType;
  handleUserUnban: HandleUserUnbanType;
  handleGrantAdminPermissions: HandleGrantAdminPermissionsType;
};

const UserRow = ({
  userPage,
  userDetails,
  handleGrantAdminPermissions,
  handleUserBan,
  handleUserUnban,
}: Props) => {
  const { authState } = useAccount();

  const canBan =
    authState.user &&
    !authState.user.roles.includes("Admin") &&
    ["Banned", "Admin"].some((condition) =>
      userDetails.roles.includes(condition as "Admin" | "Banned")
    );

  const canUnban = authState.user && authState.user.roles.includes("Banned");

  const canGrantAdminPermissions =
    authState.user &&
    !authState.user.roles.includes("Admin") &&
    ["Banned", "Admin"].some((condition) =>
      userDetails.roles.includes(condition as "Admin" | "Banned")
    );

  return (
    <TableRow
      sx={{ "& > *": { borderBottom: "unset" } }}
      hover
      key={userDetails.id}
    >
      <TableCell align={"left"}>{userDetails.id}</TableCell>
      <TableCell align={"left"}>{userDetails.name}</TableCell>
      <TableCell align={"left"}>{userDetails.roles}</TableCell>
      <TableCell align={"left"}>
        {new Date(userDetails.createdAt).toLocaleString()}
      </TableCell>
      <TableCell align={"left"}>
        {new Date(userDetails.lastUpdatedAt).toLocaleString()}
      </TableCell>
      <TableCell align={"left"}>
        {canGrantAdminPermissions && (
          <Button
            onClick={() =>
              handleGrantAdminPermissions({
                user: userDetails,
                page: userPage,
              })
            }
          >
            Grant admin permissions
          </Button>
        )}
        {canBan && (
          <Button
            onClick={() => {
              handleUserBan({ user: userDetails, page: userPage });
            }}
          >
            Ban
          </Button>
        )}
        {canUnban && (
          <Button
            onClick={() =>
              handleUserUnban({ user: userDetails, page: userPage })
            }
          >
            Unban
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
