"use client";

import { Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import {
  Chart,
  LineElement,
  BarElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartData,
  ChartOptions,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Select from "react-select";

import { useWeb3Store } from "@/stores/storeProvider";
import Supplier from "@/types/supplier";
import Assessment from "@/types/assessment";
import { EnviroFormType } from "@/types/document";

Chart.register(
  LineElement,
  BarElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function EnviroReport() {
  const { enviros, suppliers } = useWeb3Store((state) => state);

  const [month, setMonth] = useState<string[]>([]);
  const [year, setYear] = useState<string[]>([]);
  const [formAccount, setFormAccount] = useState<Supplier[]>([]);
  const [formMonth, setFormMonth] = useState("");
  const [formYear, setFormYear] = useState("");
  const [company, setCompany] = useState<Supplier | undefined>();

  const [data, setData] = useState<Assessment[]>([]);

  const [energyChartData, setEnergyChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [waterChartData, setWaterChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [materialChartData, setMaterialChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [ghgChartData, setGhgChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [pollutionChartData, setPollutionChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [wasteChartData, setWasteChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [landChartData, setLandChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [productChartData, setProductChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [supplierChartData, setSupplierChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const [optionsE, setOptionsE] = useState<ChartOptions<"line">>({});
  const [optionsW, setOptionsW] = useState<ChartOptions<"line">>({});
  const [optionsWa, setOptionsWa] = useState<ChartOptions<"line">>({});
  const [optionsG, setOptionsG] = useState<ChartOptions<"line">>({
    responsive: true,
    maintainAspectRatio: false,
  });
  const [optionsM, setOptionsM] = useState<ChartOptions<"line">>({});
  const [optionsL, setOptionsL] = useState<ChartOptions<"line">>({});

  const dataE = useMemo(() => {
    return enviros?.map((t1) => {
      return { ...t1, ...t1.document };
    });
  }, [enviros]);

  const unique = [...new Set(formAccount.map((item) => item))];
  const uniqueMonth = [...new Set(month.map((item) => item))];
  const uniqueYear = [...new Set(year.map((item) => item))];

  useEffect(() => {
    if (!!enviros) {
      enviros.forEach((newEnviro) => {
        setFormAccount((enviros) => [...enviros, newEnviro?.account]);
        setMonth((enviros) => [...enviros, newEnviro.month]);
        setYear((enviros) => [...enviros, newEnviro.year]);
      });
    }
  }, [enviros]);

  useEffect(() => {
    const filter = () => {
      if (formMonth === "All") {
        const data = dataE
          ?.filter((obj) => obj.account?.id.includes(company?.id ?? ""))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);
        setData(data ?? []);
      }
      if (formYear === "All") {
        const data = dataE
          ?.filter((obj) => obj.account?.id?.includes(company?.id ?? ""))
          .filter((obj) => obj.month.includes(formMonth))
          .map((p) => p);
        setData(data ?? []);
      }
      if (formMonth !== "All" && formYear !== "All") {
        const data = dataE
          ?.filter((obj) => obj.account?.id.includes(company?.id ?? ""))
          .filter((obj) => obj.month.includes(formMonth))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);

        setData(data ?? []);
      }
      if (formMonth === "All" && formYear === "All") {
        const data = dataE?.filter((obj) => obj.account?.id.includes(company?.id ?? "")).map((p) => p);
        setData(data ?? []);
      }
    };
    filter();
  }, [company, formMonth, formYear, dataE]);

  useEffect(() => {
    const charts = async () => {
      const energy = data.map((a) => parseInt((a.document as EnviroFormType).energy));
      const renewenergy = data.map((a) => parseInt((a.document as EnviroFormType).renewenergy));
      const id = data.map((a) => a.month + " " + a.year);

      const water = data.map((a) => parseInt((a.document as EnviroFormType).water));
      const waterrec = data.map((a) => parseInt((a.document as EnviroFormType).waterrec));
      const material = data.map((a) => parseInt((a.document as EnviroFormType).material));
      const materialrec = data.map((a) => parseInt((a.document as EnviroFormType).materialrec));
      const ghg = data.map((a) => parseFloat((a.document as EnviroFormType).ghg));
      const waterpol = data.map((a) => parseInt((a.document as EnviroFormType).waterpol));
      const landpol = data.map((a) => parseInt((a.document as EnviroFormType).landpol));
      const air = data.map((a) => parseFloat((a.document as EnviroFormType).air));
      const hazmat = data.map((a) => parseInt((a.document as EnviroFormType).hazmat));
      const solidwaste = data.map((a) => parseInt((a.document as EnviroFormType).solidwaste));
      const solidwasterec = data.map((a) => parseInt((a.document as EnviroFormType).solidwasterec));
      const waterwaste = data.map((a) => parseInt((a.document as EnviroFormType).waterwaste));
      const waterwasterec = data.map((a) => parseInt((a.document as EnviroFormType).waterwasterec));
      const hazwaste = data.map((a) => parseInt((a.document as EnviroFormType).hazwaste));
      const productrec = data.map((a) => parseInt((a.document as EnviroFormType).productrec));
      const products = data.map((a) => parseInt((a.document as EnviroFormType).products));
      const ecolabel = data.map((a) => parseInt((a.document as EnviroFormType).ecolabel));
      const envirosus = data.map((a) => parseInt((a.document as EnviroFormType).envirosus));
      const suppliers = data.map((a) => parseInt((a.document as EnviroFormType).suppliers));

      setEnergyChartData({
        labels: id,
        datasets: [
          {
            label: "Tiêu thụ năng lượng",
            data: energy,
            borderColor: "rgb(252, 217, 0)",
            backgroundColor: "rgba(252, 217, 0)",
          },
          {
            label: "Tiêu thụ năng lượng tái tạo",
            data: renewenergy,
            borderColor: "rgb(184,225,133)",
            backgroundColor: "rgba(184,225,133)",
          },
        ],
      });

      setOptionsE({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Năng lượng (kWh)",
            },
          },
        },
      });

      setWaterChartData({
        labels: id,
        datasets: [
          {
            label: "Tiêu thụ nước",
            data: water,
            borderColor: "rgb(171,217,233)",
            backgroundColor: "rgba(171,217,233)",
          },
          {
            label: "Tiêu thụ nước tái chế hoặc tái sử dụng",
            data: waterrec,
            borderColor: "rgb(98,195,165)",
            backgroundColor: "rgba(98,195,165)",
          },
        ],
      });

      setOptionsW({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Nước (m3)",
            },
          },
        },
      });

      setMaterialChartData({
        labels: id,
        datasets: [
          {
            label: "Tiêu thụ vật liệu",
            data: material,
            borderColor: "rgb(253,174,97)",
            backgroundColor: "rgba(253,174,97)",
          },
          {
            label: "Tiêu thụ vật liệu tái chế hoặc tái sử dụng",
            data: materialrec,
            borderColor: "rgb(226,117,174)",
            backgroundColor: "rgba(226,117,174)",
          },
          {
            label: "Tiêu thụ vật liệu nguy hiểm",
            data: hazmat,
            borderColor: "rgb(118,111,178)",
            backgroundColor: "rgba(118,111,178)",
          },
        ],
      });
      setOptionsM({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Vật liệu (kg)",
            },
          },
        },
      });

      setGhgChartData({
        labels: id,
        datasets: [
          {
            label: "Phát thải khí nhà kính",
            data: ghg,
            borderColor: "rgb(213,49,36)",
            backgroundColor: "rgba(213,49,36)",
          },
          {
            label: "Ô nhiễm không khí",
            data: air,
            borderColor: "rgb(108, 117, 125)",
            backgroundColor: "rgba(108, 117, 125)",
          },
        ],
      });

      setOptionsG({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Phát thải (tấn)",
            },
          },
        },
      });

      setLandChartData({
        labels: id,
        datasets: [
          {
            label: "Ô nhiễm đất",
            data: landpol,
            borderColor: "rgb(236,113,20)",
            backgroundColor: "rgba(236,113,20)",
          },
        ],
      });

      setOptionsL({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Diện tích đất (m2)",
            },
          },
        },
      });

      setPollutionChartData({
        labels: id,
        datasets: [
          {
            label: "Chất thải rắn",
            data: solidwaste,
            borderColor: "rgb(88, 49, 1)",
            backgroundColor: "rgba(88, 49, 1)",
          },
          {
            label: "Chất thải rắn tái chế hoặc tái sử dụng",
            data: solidwasterec,
            borderColor: "rgb(190, 140, 99)",
            backgroundColor: "rgba(190, 140, 99)",
          },
          {
            label: "Chất thải nguy hại",
            data: hazwaste,
            borderColor: "rgb(201, 24, 74)",
            backgroundColor: "rgba(201, 24, 74)",
          },
        ],
      });

      setOptionsWa({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Rác thải (kg)",
            },
          },
        },
      });

      setWasteChartData({
        labels: id,
        datasets: [
          {
            label: "Ô nhiễm nước",
            data: waterpol,
            borderColor: "rgb(217, 237, 146)",
            backgroundColor: "rgba(217, 237, 146)",
          },
          {
            label: "Nước thải",
            data: waterwaste,
            borderColor: "rgb(120, 147, 138)",
            backgroundColor: "rgba(120, 147, 138)",
          },
          {
            label: "Nước thải tái chế hoặc tái sử dụng",
            data: waterwasterec,
            borderColor: "rgb(49,135,189)",
            backgroundColor: "rgba(49,135,189)",
          },
        ],
      });

      setProductChartData({
        labels: id,
        datasets: [
          {
            label: "Các sản phẩm",
            data: products,
            borderColor: "rgb(142, 202, 230)",
            backgroundColor: "rgba(142, 202, 230)",
          },
          {
            label: "Sản phẩm có thể tái chế hoặc tái sử dụng",
            data: productrec,
            borderColor: "rgb(144, 190, 109)",
            backgroundColor: "rgba(144, 190, 109)",
          },
          {
            label: "Sản phẩm được đóng gói và dán nhãn thân thiện với môi trường",
            data: ecolabel,
            borderColor: "rgb(45, 106, 79)",
            backgroundColor: "rgba(45, 106, 79)",
          },
        ],
      });

      setSupplierChartData({
        labels: id,
        datasets: [
          {
            label: "Nhà cung cấp được giám sát về tính bền vững môi trường",
            data: envirosus,
            borderColor: "rgb(249, 132, 74)",
            backgroundColor: "rgba(249, 132, 74)",
          },
          {
            label: "nhà cung cấp",
            data: suppliers,
            borderColor: "rgb(249, 199, 79)",
            backgroundColor: "rgba(249, 199, 79)",
          },
        ],
      });
    };

    charts();
  }, [data]);

  return (
    <>
      <div className="charts-header">
        <h2>Báo cáo bền vững môi trường</h2>
      </div>

      <div className="flex justify-end gap-5 px-8">
        <div className="label-sel flex flex-col gap-2">
          <label>Chọn nhà cung cấp</label>
          <Select
            placeholder="Chọn sản phẩm"
            className="!z-[999 w-full max-w-[350px]"
            required
            closeMenuOnSelect={true}
            onChange={(e) => {
              setCompany(suppliers?.find((a) => a.id === e?.value));
            }}
            options={unique?.map((a) => ({ value: a.id, label: a.name })).filter(Boolean)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Lọc theo ngày</label>
          <div className=" flex items-center gap-2">
            <Select
              placeholder="Chọn tháng"
              className="!z-[999]"
              required
              closeMenuOnSelect={true}
              onChange={(e) => {
                setFormMonth(e?.value ?? "");
              }}
              options={[{ value: "All", label: "All" }, ...uniqueMonth?.map((a) => ({ value: a, label: a }))]}
            />
            <Select
              placeholder="Chọn năm"
              className="!z-[999]"
              required
              closeMenuOnSelect={true}
              onChange={(e) => {
                setFormYear(e?.value ?? "");
              }}
              options={[{ value: "All", label: "All" }, ...uniqueYear?.map((a) => ({ value: a, label: a }))]}
            />
          </div>
        </div>
      </div>

      <div className="charts">
        <div>
          <Line className="line" data={energyChartData} options={optionsE} />
        </div>
        <div>
          <Line className="line" data={waterChartData} options={optionsW} />
        </div>
        <div>
          <Line className="line" data={materialChartData} options={optionsM} />
        </div>
        <div>
          <Line className="line" data={ghgChartData} options={optionsG} />
        </div>
        <div>
          <Line className="line" data={pollutionChartData} options={optionsWa} />
        </div>
        <div>
          <Line className="line" data={landChartData} options={optionsL} />
        </div>
        <div>
          <Line className="line" data={wasteChartData} options={optionsW} />
        </div>
        <div>
          <Line className="line" data={productChartData} />
        </div>
        <div>
          <Line className="line" data={supplierChartData} />
        </div>
      </div>
    </>
  );
}
