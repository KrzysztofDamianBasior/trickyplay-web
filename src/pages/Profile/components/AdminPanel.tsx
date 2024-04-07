import { useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CommentsTable from "../../../shared/components/CommentsManagerTable";
import UsersTable from "../../../shared/components/UsersManagerTable";
import { Paper, Toolbar } from "@mui/material";

const AdminPanel = () => {
  const [gameTableManager, setGameTableManager] = useState<{
    activeTab: number;
    hasPanelBeenMounted: {
      minesweeperPanel: boolean;
      snakePanel: boolean;
      ticTacToePanel: boolean;
    };
  }>({
    activeTab: 0,
    hasPanelBeenMounted: {
      minesweeperPanel: true,
      snakePanel: false,
      ticTacToePanel: false,
    },
  });

  const [activeManager, setActiveManager] = useState<{
    activeTab: number;
    hasPanelBeenMounted: {
      gameComments: boolean;
      userComments: boolean;
    };
  }>({
    activeTab: 0,
    hasPanelBeenMounted: {
      gameComments: true,
      userComments: false,
    },
  });

  const handleGameTableChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    switch (newValue) {
      case 0:
        setGameTableManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              minesweeperPanel: true,
            },
            activeTab: 0,
          };
        });
        break;
      case 1:
        setGameTableManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              ticTacToePanel: true,
            },
            activeTab: 1,
          };
        });
        break;
      case 2:
        setGameTableManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              snakePanel: true,
            },
            activeTab: 2,
          };
        });
        break;
      default:
        break;
    }
  };

  const handleManagerChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    switch (newValue) {
      case 0:
        setActiveManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              gameComments: true,
            },
            activeTab: 0,
          };
        });
        break;
      case 1:
        setActiveManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              userComments: true,
            },
            activeTab: 1,
          };
        });
        break;
      default:
        break;
    }
  };

  return (
    <Paper sx={{ m: 1, p: 1 }} variant="outlined">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">Admin Panel</Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeManager.activeTab}
            onChange={handleManagerChange}
            aria-label="managers tabs"
          >
            <Tab label="Games" {...a11yProps(0)} />
            <Tab label="Users" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </Toolbar>
      <TabPanel value={activeManager.activeTab} index={1} prefix={"users"}>
        {activeManager.hasPanelBeenMounted.userComments && <UsersTable />}
      </TabPanel>
      <TabPanel value={activeManager.activeTab} index={0} prefix={"games"}>
        {activeManager.hasPanelBeenMounted.gameComments && (
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={gameTableManager.activeTab}
                onChange={handleGameTableChange}
                aria-label="games tabs"
              >
                <Tab label="Minesweeper" {...a11yProps(0)} />
                <Tab label="TicTacToe" {...a11yProps(1)} />
                <Tab label="Snake" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel
              value={gameTableManager.activeTab}
              index={0}
              prefix="Minesweepere"
            >
              {gameTableManager.hasPanelBeenMounted.minesweeperPanel && (
                <CommentsTable
                  collectionType="GAME_COMMENTS"
                  gameName="Minesweeper"
                />
              )}
            </TabPanel>
            <TabPanel
              value={gameTableManager.activeTab}
              index={1}
              prefix="TicTacToe"
            >
              {gameTableManager.hasPanelBeenMounted.ticTacToePanel && (
                <CommentsTable
                  collectionType="GAME_COMMENTS"
                  gameName="TicTacToe"
                />
              )}
            </TabPanel>
            <TabPanel
              value={gameTableManager.activeTab}
              index={2}
              prefix="Snake"
            >
              {gameTableManager.hasPanelBeenMounted.snakePanel && (
                <CommentsTable
                  collectionType="GAME_COMMENTS"
                  gameName="Snake"
                />
              )}
            </TabPanel>
          </Box>
        )}
      </TabPanel>
    </Paper>
  );
};

export default AdminPanel;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, prefix, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={prefix + `tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 1 }}>{children}</Box>
    </div>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  prefix: string;
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
