import DashboardIcon from "@mui/icons-material/Dashboard";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

export interface ISideBarIconProps {
    keyIcon: "DashboardIcon" | "ProductionQuantityLimitsIcon" | "AssessmentIcon" | "SummarizeIcon" | "LocationCityIcon";
}

export default function SideBarIcon({ keyIcon }: ISideBarIconProps) {
    switch (keyIcon) {
        case "DashboardIcon":
            return <DashboardIcon />;
        case "ProductionQuantityLimitsIcon":
            return <ProductionQuantityLimitsIcon />;
        case "AssessmentIcon":
            return <AssessmentIcon />;
        case "SummarizeIcon":
            return <SummarizeIcon />;
        case "LocationCityIcon":
            return <LocationCityIcon />;
        default:
            return null;
    }
}
