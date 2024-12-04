import Unit from "@/types/unit";
import type { ISideBarIconProps } from "./../UI/Icons/SideBarIcon/index";

export const SidebarData: {
  title: string;
  path: string;
  icon: ISideBarIconProps["keyIcon"];
  isShow?: boolean;
  onlyAdmin?: boolean;
}[] = [
  {
    title: "Tổng quan",
    path: "/",
    icon: "DashboardIcon",
    isShow: true,
  },
  {
    title: "Tổng quan",
    path: "/tong-quan",
    icon: "DashboardIcon",
    isShow: false,
  },
  {
    title: "Sản phẩm",
    path: "/san-pham",
    icon: "ProductionQuantityLimitsIcon",
    isShow: true,
    onlyAdmin: true,
  },
  {
    title: "Nhà cung cấp",
    path: "/nha-cung-cap",
    icon: "PrecisionManufacturingIcon",
    isShow: true,
    onlyAdmin: true,
  },
  {
    title: "Đánh giá",
    path: "/danh-gia",
    icon: "AssessmentIcon",
    isShow: true,
  },
  {
    title: "Báo cáo",
    path: "/bao-cao",
    icon: "SummarizeIcon",
    isShow: true,
  },
  {
    title: "Vận chuyển",
    path: "/van-chuyen",
    icon: "LocationCityIcon",
    isShow: true,
  },
  {
    title: "Thêm quy trình",
    path: "/them-quy-trinh",
    icon: "LocationCityIcon",
    isShow: false,
  },
  {
    title: "Thêm sản phẩm",
    path: "/them-san-pham",
    icon: "ShoppingBasketIcon",
    isShow: false,
    onlyAdmin: true,
  },
  {
    title: "Thêm Nhà cung cấp",
    path: "/them-nha-cung-cap",
    icon: "Groups2Icon",
    isShow: false,
    onlyAdmin: true,
  },
  {
    title: "LCI",
    path: "/lci",
    icon: "RecyclingIcon",
    isShow: false,
    onlyAdmin: false,
  },
  {
    title: "Môi trường",
    path: "/moi-truong",
    icon: "ForestIcon",
    isShow: false,
    onlyAdmin: false,
  },
  {
    title: "Xã hội",
    path: "/xa-hoi",
    icon: "Groups2Icon",
    isShow: false,
    onlyAdmin: false,
  },
  {
    title: "Tạo đơn hàng",
    path: "/tao-don-hang",
    icon: "ShoppingBasketIcon",
    isShow: false,
    onlyAdmin: false,
  },
  {
    title: "Đánh giá",
    path: "/danh-gia",
    icon: "SummarizeIcon",
    isShow: false,
    onlyAdmin: false,
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
