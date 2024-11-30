import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";

export interface ISideBarIconProps {
  keyIcon: "DashboardIcon" | "ProductionQuantityLimitsIcon" | "AssessmentIcon" | "SummarizeIcon" | "LocationCityIcon";
  width?: number | string;
}

export default function SideBarIcon({ keyIcon, width = 36 }: ISideBarIconProps) {
  switch (keyIcon) {
    case "DashboardIcon":
      return <DashboardCustomizeOutlinedIcon color="inherit" sx={{ fontSize: width }} />;
    case "ProductionQuantityLimitsIcon":
      return <ProductionQuantityLimitsOutlinedIcon color="inherit" sx={{ fontSize: width }} />;
    case "AssessmentIcon":
      return <AssessmentOutlinedIcon color="inherit" sx={{ fontSize: width }} />;
    case "SummarizeIcon":
      return <SummarizeOutlinedIcon color="inherit" sx={{ fontSize: width }} />;
    case "LocationCityIcon":
      return <MapOutlinedIcon color="inherit" sx={{ fontSize: width }} />;
    default:
      return null;
  }
}
