import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

import useAccount from "../../../services/account/useAccount";
import {
  type HandleGrantAdminPermissionsType,
  type HandleUserBanType,
  type HandleUserUnbanType,
} from "../../../services/usersPaginatedCollection/useUsersPaginatedCollection";
import { type UserDetailsType } from "../../../models/internalAppRepresentation/resources";

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

  const canUserGetBanned = authState.user && authState.user.role === "USER";

  const canUserGetUnbanned = authState.user && authState.user.role === "BANNED";

  const canUserGetAdminPermissions =
    authState.user && authState.user.role === "USER";

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
      <TableCell align={"left"}>
        {canUserGetAdminPermissions && (
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
        {canUserGetBanned && (
          <Button
            onClick={() => {
              handleUserBan({ user: userDetails, page: userPage });
            }}
          >
            Ban
          </Button>
        )}
        {canUserGetUnbanned && (
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
