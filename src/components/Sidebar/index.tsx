"use client";
import SideBarIcon from "@/UI/Icons/SideBarIcon";
import { SidebarData } from "@/utils/const";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useWeb3Store } from "@/stores/storeProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useWeb3Store((state) => state);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [isFullSize, setIsFullSize] = useState(false);

  const [points, setPoints] = useState([
    [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    [{ x: 0, y: 0 }],
  ]);

  const [sidebar, setSidebar] = useState(SidebarData);
  useEffect(() => {
    if (user?.role == "Focal company") {
      setSidebar(SidebarData.filter((i) => i.isShow));
    } else {
      setSidebar(SidebarData.filter((i) => i.isShow && !i.onlyAdmin));
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      const width = Math.max(window.innerWidth * ((isFullSize ? 2 : 1) / 19), isFullSize ? 180 : 80);
      const height = Math.max((window.innerHeight * 2) / 3, 450);

      setWidth(width);
      setHeight(height);
      setPoints([
        [
          { x: 0, y: 0 },
          { x: width * 0.2, y: height * 0.03625 },
          { x: width * 0.4827, y: height * 0.05 },
        ],
        [
          { x: width * 0.56, y: height * 0.05375 },
          { x: width * 0.64655, y: height * 0.0575 },
          { x: width * 0.7155, y: height * 0.06 },
        ],
        [
          { x: width * 0.8793, y: height * 0.0675 },
          { x: width, y: height * 0.09 },
          { x: width, y: height * 0.115 },
        ],

        [{ x: 0, y: height - height * 0.115 }],
      ]);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isFullSize]);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          width={width}
          height={height}
          overflow="visible"
        >
          <path
            d={`
              M0 0
              C${points[0][0].x} ${points[0][0].y} ${points[0][1].x} ${points[0][1].y} ${points[0][2].x} ${
              points[0][2].y
            }
              C${points[1][0].x} ${points[1][0].y} ${points[1][1].x} ${points[1][1].y} ${points[1][2].x} ${
              points[1][2].y
            }
              C${points[2][0].x} ${points[2][0].y} ${points[2][1].x} ${points[2][1].y} ${points[2][2].x} ${
              points[2][2].y
            }
              V${points[3][0].y}
              
              C${width} ${height - points[2][1].y} ${points[2][0].x} ${height - points[2][0].y} ${points[1][2].x} ${
              height - points[1][2].y
            }
              C${points[1][1].x} ${height - points[1][1].y} ${points[1][0].x} ${height - points[1][0].y} ${
              points[0][2].x
            } ${height - points[0][2].y}
              C${points[0][1].x} ${height - points[0][1].y} 0 ${height} 0 ${height}
              V0Z
              `}
            fill="url(#paint0_linear_4_58)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_4_58"
              x1="58"
              y1="52.4017"
              x2="58"
              y2="800"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3DB4C3" />
              <stop offset="1" stopColor="#028090" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            paddingBlock: height * 0.125 + "px",
            width: isFullSize ? "90%" : "55%",
          }}
          className="absolute inset-0 flex flex-col items-center mx-auto"
        >
          <button
            type="button"
            onClick={() => {
              setIsFullSize(!isFullSize);
            }}
          >
            <KeyboardDoubleArrowRightIcon
              style={{
                right: (isFullSize ? 8 : -4) + "px",
              }}
              className={`absolute -right-1 top-[7%] cursor-pointer ${!isFullSize ? "rotate-0" : "rotate-180"} `}
            />
          </button>
          <div
            style={{
              gap: height * 0.0275 + "px",
              justifyContent: !isFullSize ? "center" : "flex-start",
            }}
            className="relative flex flex-col items-center justify-center w-full"
          >
            {sidebar
              .filter((i) => i.isShow)
              .map((item, index) => {
                return (
                  <Link
                    key={index}
                    style={{
                      backgroundColor:
                        pathname.replace("/", "") === item.path.replace("/", "") ? "#DEE2FF" : "transparent",
                      color: pathname.replace("/", "") === item.path.replace("/", "") ? "#028090" : "#D6EADF",
                      aspectRatio: !isFullSize ? "1/1" : "unset",
                      paddingBlock: (isFullSize ? 12 : 0) + "px",
                      paddingLeft: (isFullSize ? 12 : 0) + "px",
                      justifyContent: !isFullSize ? "center" : "start",
                    }}
                    className="flex gap-1 w-full items-center rounded-xl hover:bg-[#DEE2FF] hover:text-[#028090] transition-all"
                    href={item.path}
                  >
                    <SideBarIcon width="170%" keyIcon={item.icon} />
                    {isFullSize && <span>{item.title}</span>}
                  </Link>
                );
              })}
          </div>
          {/* <button>
            <LogoutIcon sx={{ fontSize: 36 }} />
            {isFullSize && <span>Đăng xuất</span>}
          </button> */}
        </div>
      </div>
    </div>
  );
}
