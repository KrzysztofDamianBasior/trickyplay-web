import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { CommentDetailsType } from "../../services/api/useCommentsAPIFacade";

export default function CommentCard({
  commentDetails,
}: {
  commentDetails: CommentDetailsType;
}) {
  const { author, body, createdAt, lastUpdatedAt, gameName, id } =
    commentDetails;
  return (
    <Card sx={{ maxWidth: 345 }} key={id}>
      <CardHeader
        avatar={
          <Avatar aria-label="the first letter of the user's nickname">
            {author.name[0].toUpperCase()}
          </Avatar>
        }
        title={author.name}
        subheader={`comment created at: ${createdAt}, last updated at: ${lastUpdatedAt}`}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </CardContent>

      <CardActions>
        <Typography variant="body2" color="text.secondary">
          id: {id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          game name: {gameName}
        </Typography>
      </CardActions>
    </Card>
  );
}
