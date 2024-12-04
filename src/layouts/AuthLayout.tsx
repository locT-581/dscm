"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import { SidebarData } from "@/utils/const";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useWeb3Store((state) => state);
  const pathname = usePathname();

  useEffect(() => {
    SidebarData.forEach((item) => {
      if (
        (item.path === pathname || pathname.includes(item.path)) &&
        item.onlyAdmin &&
        (!!!user || user.role !== "Focal company")
      ) {
        alert("Yêu cầu đăng nhập");
      }
    });
  }, [pathname, user]);

  return <>{children}</>;
}
