"use client";

import Web3 from "web3";
import { Line } from "react-chartjs-2";
import { Assessment } from "@/lib/abis";
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "chart.js";

import Enviro, { EnviroBlockchainType } from "@/types/enviro";

Chart.register(LineElement, BarElement, BarController, LineController, CategoryScale, LinearScale, PointElement);

interface Data {
  energy: string;
  renewenergy: string;
  water: string;
  waterrec: string;
  material: string;
  materialrec: string;
  ghg: string;
  waterpol: string;
  landpol: string;
  air: string;
  hazmat: string;
  solidwaste: string;
  solidwasterec: string;
  waterwaste: string;
  waterwasterec: string;
  hazwaste: string;
  productrec: string;
  products: string;
  ecolabel: string;
  envirosus: string;
  suppliers: string;
  month: string;
  year: string;
}

export default function EnviroReport() {
  const web3instance = useRef<Web3 | null>(null);

  const [enviros, setEnviros] = useState<(Enviro & Data)[]>([]);
  const [enviroform, setEnviroForm] = useState<Enviro[]>([]);
  const [month, setMonth] = useState<string[]>([]);
  const [year, setYear] = useState<string[]>([]);
  const [formAccount, setFormAccount] = useState<string[]>([]);
  const [formMonth, setFormMonth] = useState("");
  const [formYear, setFormYear] = useState("");
  const [company, setCompany] = useState("");

  const [data, setData] = useState<Data[]>([]);

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
    return enviros.map((t1) => {
      const enviro = enviroform.find((t2) => t2.id === t1.id);
      return { ...t1, ...(enviro || {}) };
    });
  }, [enviros, enviroform]);

  const unique = [...new Set(formAccount.map((item) => item))];
  const uniqueMonth = [...new Set(month.map((item) => item))];
  const uniqueYear = [...new Set(year.map((item) => item))];

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        web3instance.current = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" });
      }
      if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Please use Metamask!");
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3instance.current === null) return;

      const networkId = await web3instance.current.eth.net.getId();
      const networkData = Assessment.networks[networkId as unknown as keyof typeof Assessment.networks];
      if (networkData) {
        //Fetch contract
        const contract = new web3instance.current.eth.Contract(Assessment.abi, networkData.address);
        const enviroCount = Number(await contract.methods.enviroCount().call());
        //Load Enviros
        for (let i = 1; i <= enviroCount; i++) {
          const newEnviro: EnviroBlockchainType = await contract.methods.enviros(i).call();

          setEnviros((enviros) => [
            ...enviros,
            { ...newEnviro, id: Number(newEnviro.id).toString() } as unknown as Enviro & Data,
          ]);
          setFormAccount((enviros) => [...enviros, newEnviro.account]);
          setMonth((enviros) => [...enviros, newEnviro.month]);
          setYear((enviros) => [...enviros, newEnviro.year]);

          const parse = JSON.parse(newEnviro.document);
          setEnviroForm((enviros) => [...enviros, parse]);
        }
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, [web3instance]);

  useEffect(() => {
    const filter = () => {
      if (formMonth === "All") {
        const data = dataE
          .filter((obj) => obj.account.includes(company))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);
        setData(data);
      }
      if (formYear === "All") {
        const data = dataE
          .filter((obj) => obj.account.includes(company))
          .filter((obj) => obj.month.includes(formMonth))
          .map((p) => p);
        setData(data);
      }
      if (formMonth !== "All" && formYear !== "All") {
        const data = dataE
          .filter((obj) => obj.account.includes(company))
          .filter((obj) => obj.month.includes(formMonth))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);

        setData(data);
      }
      if (formMonth === "All" && formYear === "All") {
        const data = dataE.filter((obj) => obj.account.includes(company)).map((p) => p);
        setData(data);
      }
    };
    filter();
  }, [company, formMonth, formYear, dataE]);

  useEffect(() => {
    const charts = async () => {
      const energy = data.map((a) => parseInt(a.energy));
      const renewenergy = data.map((a) => parseInt(a.renewenergy));
      const id = data.map((a) => a.month + " " + a.year);
      const water = data.map((a) => parseInt(a.water));
      const waterrec = data.map((a) => parseInt(a.waterrec));
      const material = data.map((a) => parseInt(a.material));
      const materialrec = data.map((a) => parseInt(a.materialrec));
      const ghg = data.map((a) => parseFloat(a.ghg));
      const waterpol = data.map((a) => parseInt(a.waterpol));
      const landpol = data.map((a) => parseInt(a.landpol));
      const air = data.map((a) => parseFloat(a.air));
      const hazmat = data.map((a) => parseInt(a.hazmat));
      const solidwaste = data.map((a) => parseInt(a.solidwaste));
      const solidwasterec = data.map((a) => parseInt(a.solidwasterec));
      const waterwaste = data.map((a) => parseInt(a.waterwaste));
      const waterwasterec = data.map((a) => parseInt(a.waterwasterec));
      const hazwaste = data.map((a) => parseInt(a.hazwaste));
      const productrec = data.map((a) => parseInt(a.productrec));
      const products = data.map((a) => parseInt(a.products));
      const ecolabel = data.map((a) => parseInt(a.ecolabel));
      const envirosus = data.map((a) => parseInt(a.envirosus));
      const suppliers = data.map((a) => parseInt(a.suppliers));

      setEnergyChartData({
        labels: id,
        datasets: [
          {
            label: "Energy Consumption",
            data: energy,
            borderColor: "rgb(252, 217, 0)",
            backgroundColor: "rgba(252, 217, 0)",
          },
          {
            label: "Renewable energy Consumption",
            data: renewenergy,
            borderColor: "rgb(184,225,133)",
            backgroundColor: "rgba(184,225,133)",
          },
          // {
          //   label: "Product Produced",
          //   data: products,
          //   yAxisID: 'A',
          //   borderColor: "purple",
          //   backgroundColor: "purple",
          // },
        ],
      });

      setOptionsE({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Energy (kWh)",
            },
          },
        },
      });

      setWaterChartData({
        labels: id,
        datasets: [
          {
            label: "Water Consumption",
            data: water,
            borderColor: "rgb(171,217,233)",
            backgroundColor: "rgba(171,217,233)",
          },
          {
            label: "Recycled or Reused Water Consumption",
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
              text: "Water (m3)",
            },
          },
        },
      });

      setMaterialChartData({
        labels: id,
        datasets: [
          {
            label: "Material Consumption",
            data: material,
            borderColor: "rgb(253,174,97)",
            backgroundColor: "rgba(253,174,97)",
          },
          {
            label: "Recycled or Reused Material Consumption",
            data: materialrec,
            borderColor: "rgb(226,117,174)",
            backgroundColor: "rgba(226,117,174)",
          },
          {
            label: "Hazardous Material Consumption",
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
              text: "Material (kg)",
            },
          },
        },
      });

      setGhgChartData({
        labels: id,
        datasets: [
          {
            label: "Greenhouse Gas Emission",
            data: ghg,
            borderColor: "rgb(213,49,36)",
            backgroundColor: "rgba(213,49,36)",
          },
          {
            label: "Air Pollution",
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
              text: "Emmision (tonnes)",
            },
          },
        },
      });

      setLandChartData({
        labels: id,
        datasets: [
          {
            label: "Land Pollution",
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
              text: "Land area (m2)",
            },
          },
        },
      });

      setPollutionChartData({
        labels: id,
        datasets: [
          {
            label: "Solid Waste",
            data: solidwaste,
            borderColor: "rgb(88, 49, 1)",
            backgroundColor: "rgba(88, 49, 1)",
          },
          {
            label: "Recycled or Reused Solid Waste",
            data: solidwasterec,
            borderColor: "rgb(190, 140, 99)",
            backgroundColor: "rgba(190, 140, 99)",
          },
          {
            label: "Hazardous Waste",
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
              text: "Waste (kg)",
            },
          },
        },
      });

      setWasteChartData({
        labels: id,
        datasets: [
          {
            label: "Water Pollution",
            data: waterpol,
            borderColor: "rgb(217, 237, 146)",
            backgroundColor: "rgba(217, 237, 146)",
          },
          {
            label: "Water Waste",
            data: waterwaste,
            borderColor: "rgb(120, 147, 138)",
            backgroundColor: "rgba(120, 147, 138)",
          },
          {
            label: "Recycled or Reused Water Waste",
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
            label: "Products",
            data: products,
            borderColor: "rgb(142, 202, 230)",
            backgroundColor: "rgba(142, 202, 230)",
          },
          {
            label: "Recyclable or Reusable Products",
            data: productrec,
            borderColor: "rgb(144, 190, 109)",
            backgroundColor: "rgba(144, 190, 109)",
          },
          {
            label: "Eco-friendly Packaged and Labeled Products",
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
            label: "Suppliers Monitored on Environmental Sustainability",
            data: envirosus,
            borderColor: "rgb(249, 132, 74)",
            backgroundColor: "rgba(249, 132, 74)",
          },
          {
            label: "Suppliers",
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
        <h2>Environmental Sustainability Report</h2>
      </div>
      <div className="center-chart">
        <div className="label-sel">
          <label>Select Company</label>
          <select defaultValue={unique[0]} value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="" disabled hidden></option>
            {unique.map((a, i) => {
              return (
                <option key={i} value={a}>
                  {a === "0xf00EbF44706A84d73698D51390a6801215fF338c"
                    ? "Supplier#1"
                    : a === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
                    ? "Supplier#2"
                    : a === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619"
                    ? "Supplier#3"
                    : a === "0x5e66410a4C6443d035E05162C9bb59708cB0596F"
                    ? "Supplier#4"
                    : a === "0x3421668462324bFB48EA07D0B12243091CD09759"
                    ? "Company"
                    : null}{" "}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Filter by Date</label>
          <select value={formMonth} onChange={(e) => setFormMonth(e.target.value)}>
            <option value="" disabled hidden></option>
            <option value="All">All</option>
            {uniqueMonth.map((a, i) => {
              return (
                <option key={i} value={a}>
                  {a}{" "}
                </option>
              );
            })}
          </select>
          <select value={formYear} onChange={(e) => setFormYear(e.target.value)}>
            <option value="" disabled hidden></option>
            <option value="All">All</option>
            {uniqueYear.map((a, i) => {
              return (
                <option key={i} value={a}>
                  {a}{" "}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div></div>
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
