"use client";

import Select from "react-select";
import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";

import {
  Chart,
  BarElement,
  PointElement,
  BarController,
  LineController,
  PieController,
  ChartData,
  ChartOptions,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useWeb3Store } from "@/stores/storeProvider";
import { CLIFormType } from "@/types/document";
import Assessment from "@/types/assessment";
import Product from "@/types/product";

Chart.register(
  BarElement,
  PointElement,
  BarController,
  LineController,
  PieController,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default function LciReports() {
  const { products, LCIs } = useWeb3Store((state) => state);

  const [month, setMonth] = useState<string[]>([]);
  const [year, setYear] = useState<string[]>([]);

  const [formProduct, setFormProduct] = useState<Product | undefined>();
  const [formMonth, setFormMonth] = useState("All");
  const [formYear, setFormYear] = useState("All");
  const [data, setData] = useState<Assessment[]>([]);

  // const chart = ["energyChartData", "waterChartData", "materialChartData"];

  const [energyChartData, setEnergyChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [waterChartData, setWaterChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [materialChartData, setMaterialChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [ghgChartData, setGhgChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [pollutionChartData, setPollutionChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [wasteChartData, setWasteChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [landChartData, setLandChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  const [optionsE, setOptionsE] = useState<ChartOptions<"bar">>({});
  const [optionsW, setOptionsW] = useState<ChartOptions<"bar">>({});
  const [optionsWa, setOptionsWa] = useState<ChartOptions<"bar">>({});
  const [optionsG, setOptionsG] = useState<ChartOptions<"bar">>({
    responsive: true,
    maintainAspectRatio: false,
  });
  const [optionsM, setOptionsM] = useState<ChartOptions<"bar">>({});
  const [optionsL, setOptionsL] = useState<ChartOptions<"bar">>({});

  /**
   * @description: Get data from LCIs and merge with document
   */
  const dataE = useMemo(() => {
    return LCIs?.map((lci) => lci.document).map((item, i) => Object.assign({}, item, LCIs[i]));
  }, [LCIs]);

  const unique = [...new Set(LCIs?.map((lci) => (lci.document as CLIFormType).product).map((item) => item))].filter(
    Boolean
  );
  const uniqueMonth = [...new Set(month.map((item) => item))];
  const uniqueYear = [...new Set(year.map((item) => item))];

  useEffect(() => {
    if (!!LCIs) {
      LCIs.map((lci) => {
        setMonth((month) => [...month, lci.month]);
        setYear((year) => [...year, lci.year]);
      });
    }
  }, [LCIs]);

  useEffect(() => {
    const filter = () => {
      if (formMonth === "All") {
        const data = dataE
          ?.filter((obj) => (obj as CLIFormType).product?.id?.includes(formProduct?.id ?? ""))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);
        setData(data ?? []);
      }
      if (formYear === "All") {
        const data = dataE
          ?.filter((obj) => (obj as CLIFormType).product?.id?.includes(formProduct?.id ?? ""))
          .filter((obj) => obj.month.includes(formMonth))
          .map((p) => p);
        setData(data ?? []);
      }
      if (formMonth !== "All" && formYear !== "All") {
        const data = dataE
          ?.filter((obj) => (obj as CLIFormType).product?.id?.includes(formProduct?.id ?? ""))
          .filter((obj) => obj.month.includes(formMonth))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);
        setData(data ?? []);
      }
      if (formMonth === "All" && formYear === "All") {
        const data = dataE
          ?.filter((obj) => (obj as CLIFormType).product?.id?.includes(formProduct?.id ?? ""))
          .map((p) => p);
        setData(data ?? []);
      }
    };

    filter();
  }, [formProduct, formMonth, formYear, dataE]);

  useEffect(() => {
    const charts = async () => {
      const energy = data.map((a) => parseInt((a.document as CLIFormType).energy));
      const renewenergy = data.map((a) => parseInt((a.document as CLIFormType).renewenergy));
      const id = data.map(
        (a) =>
          (a.process != undefined ? a.process?.name : "Chưa có dữ liệu quy trình") + " (" + a.month + " " + a.year + ")"
      );
      const water = data.map((a) => parseInt((a.document as CLIFormType).water));
      const waterrec = data.map((a) => parseInt((a.document as CLIFormType).waterrec));
      const material = data.map((a) => parseInt((a.document as CLIFormType).material));
      const materialrec = data.map((a) => parseInt((a.document as CLIFormType).materialrec));
      const ghg = data.map((a) => parseFloat((a.document as CLIFormType).ghg));
      const waterpol = data.map((a) => parseInt((a.document as CLIFormType).waterpol));
      const landpol = data.map((a) => parseInt((a.document as CLIFormType).landpol));
      const air = data.map((a) => parseFloat((a.document as CLIFormType).air));
      const hazmat = data.map((a) => parseInt((a.document as CLIFormType).hazmat));
      const solidwaste = data.map((a) => parseInt((a.document as CLIFormType).solidwaste));
      const waterwaste = data.map((a) => parseInt((a.document as CLIFormType).waterwaste));
      const hazwaste = data.map((a) => parseInt((a.document as CLIFormType).hazwaste));
      const solidwasterec = data.map((a) => parseInt((a.document as CLIFormType).solidwasterec));
      const waterwasterec = data.map((a) => parseInt((a.document as CLIFormType).waterwasterec));

      setEnergyChartData({
        labels: id,
        datasets: [
          {
            label: "Tiêu thụ năng lượng",
            data: energy,
            borderColor: "rgb(252, 217, 0)",
            backgroundColor: "rgb(252, 217, 0)",
          },
          {
            label: "Tiêu thụ năng lượng tái tạo",
            data: renewenergy,
            borderColor: "rgb(184,225,133)",
            backgroundColor: "rgb(184,225,133)",
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
    };

    charts();
  }, [data]);

  return (
    <>
      <div className="charts-header">
        <h2 className="text-2xl font-semibold mb-6 text-center">Báo cáo vòng đời sản phẩm</h2>
      </div>

      <div className="flex justify-end gap-5 px-8">
        <div className="label-sel flex flex-col gap-2">
          <label>Chọn sản phẩm</label>
          <Select
            placeholder="Chọn sản phẩm"
            className="!z-[999 w-full max-w-[350px]"
            required
            closeMenuOnSelect={true}
            onChange={(e) => {
              setFormProduct(products?.find((order) => order.id === (e as { value: string; label: string })?.value));
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
          <Bar className="line" data={energyChartData} options={optionsE} />
        </div>
        <div>
          <Bar className="line" data={waterChartData} options={optionsW} />
        </div>
        <div>
          <Bar className="line" data={materialChartData} options={optionsM} />
        </div>
        <div>
          <Bar className="line" data={ghgChartData} options={optionsG} />
        </div>
        <div>
          <Bar className="line" data={pollutionChartData} options={optionsWa} />
        </div>
        <div>
          <Bar className="line" data={landChartData} options={optionsL} />
        </div>
        <div>
          <Bar className="line" data={wasteChartData} options={optionsW} />
        </div>
      </div>
    </>
  );
}
