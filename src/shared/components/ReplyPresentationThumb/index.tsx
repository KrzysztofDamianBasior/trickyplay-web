import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { type ReplyDetailsType } from "../../models/internalAppRepresentation/resources";

export default function ReplyCard({
  replyDetails,
}: {
  replyDetails: ReplyDetailsType;
}) {
  const { author, body, createdAt, updatedAt, id } = replyDetails;
  return (
    <Card sx={{ maxWidth: 345 }} key={id}>
      <CardHeader
        avatar={
          <Avatar aria-label="the first letter of the user's nickname">
            {author.name[0].toUpperCase()}
          </Avatar>
        }
        title={author.name}
        subheader={`reply created at: ${new Date(
          createdAt
        ).toLocaleString()}, last updated at: ${new Date(
          updatedAt
        ).toLocaleString()}`}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
}
