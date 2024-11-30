import * as React from "react";

export interface IBackgroundProps {
  width: number;
  height: number;
  className?: string;
}

export default function Background({ width, height, className }: IBackgroundProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      width={width}
      height={height}
      overflow="visible"
      className={className}
    >
      <g filter="url(#filter0_b_10_2)">
        <rect width={width} height={height} fill="#F8F7F4" />
        <g opacity="0.5" filter="url(#filter1_f_10_2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M412.813 -8.02029C458.801 32.2207 558.902 17.457 564.536 83.6684C570.127 149.376 489.983 203.502 434.958 252.225C390.2 291.857 339.748 311.75 286.06 330.251C212.664 355.543 118.544 426.223 72.0219 377.293C24.7961 327.622 108.549 231.854 119.281 154.84C127.795 93.7367 93.0707 36.0794 127.361 -19.83C166.659 -83.9043 236.552 -147.775 303.189 -145.019C367.971 -142.338 367.273 -47.8687 412.813 -8.02029Z"
            fill="#F0F3BD"
          />
        </g>
        <g opacity="0.5" filter="url(#filter2_f_10_2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1542.25 285.526C1600.94 267.268 1636.64 159.247 1698.95 197.891C1760.78 236.24 1770.25 350.947 1787.15 437.415C1800.9 507.749 1794.11 570.5 1784.48 635.495C1771.31 724.349 1788.83 863.805 1722.06 876.79C1654.28 889.972 1609.12 743.946 1545.11 682.045C1494.31 632.933 1425.47 628.526 1391.96 557.6C1353.56 476.316 1330.31 365.161 1365.39 301.648C1399.5 239.901 1484.13 303.605 1542.25 285.526Z"
            fill="#F6C4EC"
          />
        </g>
        <g opacity="0.5" filter="url(#filter3_f_10_2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1162.74 1053.72C1179.54 1112.85 1286.65 1151.2 1246.48 1212.54C1206.62 1273.4 1091.71 1280.04 1004.85 1294.8C934.199 1306.81 871.635 1298.47 806.897 1287.24C718.395 1271.88 578.549 1285.95 567.216 1218.88C555.711 1150.8 702.807 1109.26 766.269 1046.79C816.619 997.225 822.724 928.506 894.456 896.759C976.663 860.375 1088.36 839.876 1150.99 876.517C1211.87 912.138 1146.1 995.167 1162.74 1053.72Z"
            fill="#028090"
            fillOpacity="0.55"
          />
        </g>
        <g filter="url(#filter4_b_10_2)">
          <rect width={width} height={height} fill="#9AECEB" fillOpacity="0.1" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_b_10_2"
          x="-400"
          y="-400"
          width="2528"
          height="1917"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="200" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_10_2" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_10_2" result="shape" />
        </filter>
        <filter
          id="filter1_f_10_2"
          x="-342.304"
          y="-545.105"
          width="1307.12"
          height="1339.25"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_10_2" />
        </filter>
        <filter
          id="filter2_f_10_2"
          x="1098.14"
          y="-60.3969"
          width="946.788"
          height="1188.02"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="125" result="effect1_foregroundBlur_10_2" />
        </filter>
        <filter
          id="filter3_f_10_2"
          x="166.578"
          y="457.223"
          width="1488.85"
          height="1243.45"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_10_2" />
        </filter>
        <filter
          id="filter4_b_10_2"
          x="-250"
          y="-250"
          width="2228"
          height="1617"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="125" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_10_2" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_10_2" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
