"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Title, Tooltip, Legend);

import Button from "../Button";

interface AssessChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
  options?: {
    responsive: boolean;
    maintainAspectRatio: boolean;
  };
}
export default function Report({
  enviroCount,
  socialCount,
  LCICount,
}: {
  enviroCount: number;
  socialCount: number;
  LCICount: number;
}) {
  const router = useRouter();

  const [assessChartData, setAssessChartData] = useState<AssessChartData | undefined>();

  useEffect(() => {
    setAssessChartData({
      labels: ["Môi trường", "Xã hội", "LCI"],
      datasets: [
        {
          label: "Đánh giá",
          data: [enviroCount, socialCount, LCICount],
          backgroundColor: ["#279b48", "orange", "#03a0dd"],
        },
      ],
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }, [enviroCount, socialCount, LCICount]);

  const routeLCI = () => {
    router.push("bao-cao/lci");
  };
  const routeS = () => {
    router.push("bao-cao/xa-hoi");
  };
  const routeE = () => {
    router.push("bao-cao/moi-truong");
  };
  return (
    <div className="w-full h-full flex pr-[5%] justify-center pt-4">
      <div className="flex h-fit items-center w-[70%] justify-between">
        <div className="flex flex-col justify-between w-[35%] gap-3">
          <Button className="btn" onClick={routeE} text="Báo cáo đánh giá môi trường" />
          <Button className="btn" onClick={routeS} text="Báo cáo đánh giá xã hội" />
          <Button className="btn" onClick={routeLCI} text="Báo cáo tồn kho vòng đời" />
        </div>
        <div className="w-[45%]">{assessChartData && <Pie data={assessChartData} />}</div>
      </div>
    </div>
  );
}
