"use client";

// import Welcome from "@/components/views/Welcome";
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

  // if (!!!user)
  // return <Welcome onConnect={() => {}} />;
  return <>{children}</>;
}
