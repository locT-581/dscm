"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

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
      labels: ["Environmental", "Social", "LCI"],
      datasets: [
        {
          label: "Assessments",
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
    <div>
      <header className="report-dashheader">
        <div className="report">
          <Button className="btn" onClick={routeE} text="Báo cáo đánh giá môi trường" />
          <Button className="btn" onClick={routeS} text="Báo cáo đánh giá xã hội" />
          <Button className="btn" onClick={routeLCI} text="Báo cáo tồn kho vòng đời" />
        </div>
      </header>
      <div className="assessChart">{assessChartData && <Pie data={assessChartData} />}</div>
    </div>
  );
}
