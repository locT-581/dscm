"use client";

// import Welcome from "@/components/views/Welcome";
import { useWeb3Store } from "@/stores/storeProvider";
import { SidebarData } from "@/utils/const";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useWeb3Store((state) => state);
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    SidebarData.forEach((item) => {
      if (
        (item.path === pathname || pathname.includes(item.path)) &&
        item.onlyAdmin &&
        (!!!user || user.role !== "Focal company")
      ) {
        router.push("/");
      }
    });
  }, [pathname, user]);

  // if (!!!user)ss
  // return <Welcome onConnect={() => {}} />;sss
  return <>{children}</>;
}
