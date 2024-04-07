import { useContext } from "react";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

import {
  type HandleGrantAdminPermissionsType,
  type HandleUserBanType,
  type HandleUserUnbanType,
} from "../../../services/usersPaginatedCollection/useUsersPaginatedCollection";
import { type UserDetailsType } from "../../../models/internalAppRepresentation/resources";
import { AccountContext } from "../../../services/account/AccountContext";

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
  const { authState } = useContext(AccountContext);

  const canUserGetBanned =
    authState.user &&
    authState.user.role === "ADMIN" &&
    userDetails.role === "USER";

  const canUserGetUnbanned =
    authState.user &&
    authState.user.role === "ADMIN" &&
    userDetails.role === "BANNED";

  const canUserGetAdminPermissions =
    authState.user &&
    authState.user.role === "ADMIN" &&
    userDetails.role === "USER";

  return (
    <TableRow
      sx={{ "& > *": { borderBottom: "unset" } }}
      hover
      key={userDetails.id}
    >
      <TableCell align={"left"}>{userDetails.id}</TableCell>
      <TableCell align={"left"}>{userDetails.name}</TableCell>
      <TableCell align={"left"}>{userDetails.role}</TableCell>
      <TableCell align={"left"}>
        {new Date(userDetails.createdAt).toLocaleString()}
      </TableCell>
      <TableCell align={"left"}>
        {new Date(userDetails.updatedAt).toLocaleString()}
      </TableCell>
      <TableCell
        align={"left"}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        {canUserGetAdminPermissions && (
          <Button
            variant="outlined"
            onClick={() =>
              handleGrantAdminPermissions({
                user: userDetails,
                page: userPage,
              })
            }
            sx={{ m: 1 }}
            size="small"
          >
            Grant admin permissions
          </Button>
        )}
        {canUserGetBanned && (
          <Button
            variant="outlined"
            onClick={() => {
              handleUserBan({ user: userDetails, page: userPage });
            }}
            sx={{ m: 1 }}
            size="small"
          >
            Ban
          </Button>
        )}
        {canUserGetUnbanned && (
          <Button
            variant="outlined"
            onClick={() =>
              handleUserUnban({ user: userDetails, page: userPage })
            }
            sx={{ m: 1 }}
            size="small"
          >
            Unban
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
