"use client";

import { Box, Tab, Tabs as MUITabs, TabsTypeMap } from "@mui/material";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export interface ITabsProps {
  children: { title: string; element: React.ReactNode }[];
  tabsConfig?: TabsTypeMap;
}

export default function Tabs({ children, tabsConfig }: ITabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <MUITabs
        value={value}
        onChange={handleChange}
        aria-label="dashboard-tabs"
        sx={{
          "& .MuiTab-root": {
            color: "#8E9AAF",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
          },
          "& .Mui-selected": {
            color: "#028090 !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#028090 !important",
          },
        }}
        {...tabsConfig}
      >
        {children.map((child, i) => (
          <Tab key={i} label={child.title} {...a11yProps(2)} />
        ))}
      </MUITabs>

      {children.map((child, i) => (
        <CustomTabPanel key={i} value={value} index={i}>
          {child.element}
        </CustomTabPanel>
      ))}
    </div>
  );
}
