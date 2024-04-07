import { useContext, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useMediaQuery, useTheme } from "@mui/material";

import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import { AccountContext } from "../../shared/services/account/AccountContext";

import AccountPanel from "./components/AccountPanel";
import ActivityPanel from "./components/ActivityPanel";
import AdminPanel from "./components/AdminPanel";

const Profile = () => {
  const { authState } = useContext(AccountContext);
  const theme = useTheme();
  const isMatchMD = useMediaQuery(theme.breakpoints.down("md"));
  const isMatchSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabManager, setTabManager] = useState<{
    activeTab: number;
    hasPanelBeenMounted: {
      activityPanel: boolean;
      adminPanel: boolean;
    };
  }>({
    activeTab: 0,
    hasPanelBeenMounted: {
      activityPanel: false,
      adminPanel: false,
    },
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        setTabManager((prev) => {
          return { ...prev, activeTab: 0 };
        });
        break;
      case 1:
        setTabManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              activityPanel: true,
            },
            activeTab: 1,
          };
        });
        break;
      case 2:
        setTabManager((prev) => {
          return {
            hasPanelBeenMounted: {
              ...prev.hasPanelBeenMounted,
              adminPanel: true,
            },
            activeTab: 2,
          };
        });
        break;
      default:
        break;
    }
  };

  return (
    <AnimatedPage>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          mt: 4,
          mb: 4,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Tabs
          orientation={
            isMatchMD ? (isMatchSM ? "vertical" : "horizontal") : "vertical"
          }
          value={tabManager.activeTab}
          onChange={handleChange}
          aria-label="account tabs"
          sx={{
            width: { sm: "auto", md: "150px" },
            flex: "none",
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            marginY: { xs: 1, sm: 2, md: 3, lg: 4 },
            alignSelf: { xs: "center", md: "flex-start" },
          }}
        >
          <Tab label="Account panel" {...a11yProps(0)} />
          <Tab label="Activity panel" {...a11yProps(1)} />
          {authState.user?.role === "ADMIN" && (
            <Tab label="Admin panel" {...a11yProps(2)} />
          )}
        </Tabs>

        <TabPanel value={tabManager.activeTab} index={0}>
          <AccountPanel />
        </TabPanel>
        <TabPanel value={tabManager.activeTab} index={1}>
          {tabManager.hasPanelBeenMounted.activityPanel && <ActivityPanel />}
        </TabPanel>
        {authState.user?.role === "ADMIN" && (
          <TabPanel value={tabManager.activeTab} index={2}>
            {tabManager.hasPanelBeenMounted.adminPanel && <AdminPanel />}
          </TabPanel>
        )}
      </Box>

      <Footer />
    </AnimatedPage>
  );
};

export default Profile;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      style={{
        flexGrow: 2,
      }}
      {...other}
    >
      {children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `account-tabpanel-${index}`,
  };
}
