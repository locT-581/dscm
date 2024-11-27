"use client";
import SideBarIcon from "@/UI/Icons/SideBarIcon";
import { SidebarData } from "@/utils/const";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();

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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth * (1 / 12);
      const height = (window.innerHeight * 2) / 3;

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
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex h-fit relative">
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
        <ul className="flex flex-col absolute h-full">
          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link className="flex gap-1" href={item.path}>
                  <SideBarIcon keyIcon={item.icon} />
                  {isFullSize && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
