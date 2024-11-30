import Unit from "@/types/unit";
import type { ISideBarIconProps } from "./../UI/Icons/SideBarIcon/index";

export const SidebarData: {
  title: string;
  path: string;
  icon: ISideBarIconProps["keyIcon"];
}[] = [
  {
    title: "Tổng quan",
    path: "/",
    icon: "DashboardIcon",
  },
  {
    title: "Sản phẩm",
    path: "/san-pham",
    icon: "ProductionQuantityLimitsIcon",
  },
  {
    title: "Đánh giá",
    path: "/danh-gia",
    icon: "AssessmentIcon",
  },
  {
    title: "Báo cáo",
    path: "/bao-cao",
    icon: "SummarizeIcon",
  },
  {
    title: "Vận chuyển",
    path: "/van-chuyen",
    icon: "LocationCityIcon",
  },
  {
    title: "Thêm quy trình",
    path: "/them-quy-trinh",
    icon: "LocationCityIcon",
  },
];

export const monthNumber = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

export const units: Unit[] = [
  { id: "kg", name: "kg" },
  { id: "liter", name: "lít" },
  { id: "items", name: "cái" },
];

export const SupplierType = [{ id: "" }];
