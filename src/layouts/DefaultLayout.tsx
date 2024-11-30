"use client";

import Background from "@/components/Background";
import Sidebar from "@/components/Sidebar";
import IconBreadcrumbs from "@/UI/Breadcrumbs";
import SideBarIcon from "@/UI/Icons/SideBarIcon";
import { SidebarData } from "@/utils/const";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [[width, height], setSize] = useState([window.innerWidth, window.innerHeight]);

  const pathParts = useMemo(() => pathname.split("/").filter((part) => part !== ""), [pathname]);

  useEffect(() => {
    const onWindowResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    onWindowResize();

    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  return (
    <div className="flex justify-between h-screen w-screen overflow-auto relative">
      <Background className="absolute top-0 left-0 -z-[1]" width={width} height={height} />
      <Sidebar />
      <div className="flex flex-col gap-3 w-full h-full p-4 !pr-8 overflow-auto">
        <header className="w-full flex items-center justify-between">
          <span className="flex flex-col">
            <p className="text-[20px] font-semibold">Xin chào,</p>
            <p className="text-5xl font-semibold">
              Trang {SidebarData.find((path) => path.path.replace("/", "") == pathname.replace("/", ""))?.title}
            </p>
          </span>

          <span className="flex items-center">hhh</span>
        </header>

        <IconBreadcrumbs
          stack={
            pathParts.map((part, index) => ({
              href: pathParts.slice(0, index + 1).join("/"),
              icon: (
                <SideBarIcon
                  width={16}
                  keyIcon={SidebarData.find((path) => path.path.replace("/", "") == part)?.icon ?? "DashboardIcon"}
                />
              ),
              label: SidebarData.find((path) => path.path.replace("/", "") == part)?.title ?? "",
            })) ?? ["/"]
          }
        />
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
}
