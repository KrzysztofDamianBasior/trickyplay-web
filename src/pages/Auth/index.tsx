import React, { useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const Auth = () => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={20}
        sx={{
          width: { xs: 300, sm: 500, md: 600, lg: 650 },
          m: { xs: 2, sm: 10, md: 20, lg: 30 },
        }}
      >
        <Tabs
          value={value}
          textColor="secondary"
          indicatorColor="secondary"
          variant="fullWidth"
          onChange={handleChange}
          aria-label="auth tabs"
        >
          <Tab label="Sign In" {...a11yProps(0)} />
          <Tab label="Sign Up" {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <SignIn handleChange={handleChange} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SignUp />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Auth;

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    "aria-controls": `auth-tabpanel-${index}`,
  };
}

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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3, lg: 4 } }}>{children}</Box>
      )}
    </div>
  );
}
