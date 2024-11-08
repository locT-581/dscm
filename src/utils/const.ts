import type { ISideBarIconProps } from "./../UI/Icons/SideBarIcon/index";

export const SidebarData: {
    title: string;
    path: string;
    icon: ISideBarIconProps["keyIcon"];
    cName: string;
}[] = [
    {
        title: "Dashboard",
        path: "/",
        icon: "DashboardIcon",
        cName: "side-text",
    },
    {
        title: "Products",
        path: "/products",
        icon: "ProductionQuantityLimitsIcon",
        cName: "side-text",
    },
    {
        title: "Assessments",
        path: "/assessments",
        icon: "AssessmentIcon",
        cName: "side-text",
    },
    {
        title: "Reports",
        path: "/Reports",
        icon: "SummarizeIcon",
        cName: "side-text",
    },
    {
        title: "Journey",
        path: "/journey",
        icon: "LocationCityIcon",
        cName: "side-text",
    },
];
