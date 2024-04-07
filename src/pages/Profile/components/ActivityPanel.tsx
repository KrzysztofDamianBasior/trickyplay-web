import { useContext } from "react";

import { Button, Paper, Toolbar, Typography } from "@mui/material";

import CommentsTable from "../../../shared/components/CommentsManagerTable";
import { AccountContext } from "../../../shared/services/account/AccountContext";

const ActivityPanel = () => {
  const { accountActivitySummary, authState } = useContext(AccountContext);

  return (
    <Paper sx={{ m: 1, p: 1 }} variant="outlined">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Typography variant="h4">Activity panel</Typography>
        <Button
          onClick={accountActivitySummary}
          variant="contained"
          sx={{ m: 1, p: 1 }}
        >
          Download activity summary in pdf
        </Button>
      </Toolbar>
      {authState.user?.id && (
        <CommentsTable
          collectionType="USER_COMMENTS"
          authorId={authState.user.id}
        />
      )}
    </Paper>
  );
};

export default ActivityPanel;
