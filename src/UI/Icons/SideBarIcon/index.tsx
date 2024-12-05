import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import RecyclingIcon from "@mui/icons-material/Recycling";
import ForestIcon from "@mui/icons-material/Forest";
import Groups2Icon from "@mui/icons-material/Groups2";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
export interface ISideBarIconProps {
  keyIcon:
    | "DashboardIcon"
    | "ProductionQuantityLimitsIcon"
    | "AssessmentIcon"
    | "SummarizeIcon"
    | "LocationCityIcon"
    | "PrecisionManufacturingIcon"
    | "RecyclingIcon"
    | "ForestIcon"
    | "Groups2Icon"
    | "ShoppingBasketIcon"
    | "LocalShippingIcon";
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
    case "PrecisionManufacturingIcon":
      return <PrecisionManufacturingIcon color="inherit" sx={{ fontSize: width }} />;
    case "RecyclingIcon":
      return <RecyclingIcon color="inherit" sx={{ fontSize: width }} />;
    case "ForestIcon":
      return <ForestIcon color="inherit" sx={{ fontSize: width }} />;
    case "Groups2Icon":
      return <Groups2Icon color="inherit" sx={{ fontSize: width }} />;
    case "ShoppingBasketIcon":
      return <ShoppingBasketIcon color="inherit" sx={{ fontSize: width }} />;
    case "LocalShippingIcon":
      return <LocalShippingIcon color="inherit" sx={{ fontSize: width }} />;
    default:
      return null;
  }
}
