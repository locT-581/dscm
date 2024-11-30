"use client";

import { useState, useEffect, useRef } from "react";
import Web3 from "web3";

import * as GiIcons from "react-icons/gi";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";
import { Assessment } from "@/lib/abis";
import Sidebar from "@/components/Sidebar";
import LCI, { LCIBlockchain } from "@/types/LCI";
import { useSearchParams } from "next/navigation";
import Product from "@/types/product";
import { CLIFormType } from "@/types/document";

const AssessList = ({ assessments }: { assessments: LCI[] }) =>
  assessments.map((a) => (
    <tr key={a.id}>
      <table className="LCI-table">
        <caption>
          Life Cycle Inventory of {a.process} of a {a.product.name}
        </caption>
        <caption className="captwo">
          {"For period " + a.month + " " + a.year + " by "}
          {a.account === "0xf00EbF44706A84d73698D51390a6801215fF338c"
            ? " Supplier#1"
            : a.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
            ? " Supplier#2"
            : a.account === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619"
            ? " Supplier#3"
            : a.account === "0x5e66410a4C6443d035E05162C9bb59708cB0596F"
            ? " Supplier#4"
            : a.account === "0x3421668462324bFB48EA07D0B12243091CD09759"
            ? " Company"
            : a.account}
        </caption>
        <thead>
          <th>Categories</th>
          <th>Indicators</th>
          <th>Measurements</th>
          <th>Values</th>
          <th>Units</th>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={11} className="category">
              Natural Resources
            </th>
            <th rowSpan={1}>
              Energy consumption <GiIcons.GiElectric />
            </th>
            <th>Amount of energy used per unit of product</th>
            <td>
              {(+a.document.energy / +a.document.batch) % 1 !== 0
                ? (+a.document.energy / +a.document.batch).toFixed(2)
                : +a.document.energy / +a.document.batch}
            </td>
            <td>kWh/ unit of product</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Renewable energy <GiIcons.GiWindTurbine />
            </th>
            <th>Amount of renewable energy used in energy consumption per unit of product</th>
            <td>
              {(+a.document.renewenergy / +a.document.batch) % 1 !== 0
                ? (+a.document.renewenergy / +a.document.batch).toFixed(2)
                : +a.document.renewenergy / +a.document.batch}
            </td>
            <td>kWh/ unit of product</td>
          </tr>
          <tr>
            <th>Percentage of renewable energy used per unit of product</th>
            <td>
              {((+a.document.renewenergy * 100) / +a.document.energy) % 1 !== 0
                ? ((+a.document.renewenergy * 100) / +a.document.energy).toFixed(2)
                : (+a.document.renewenergy * 100) / +a.document.energy}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Water consumption <GiIcons.GiWaterDrop />
            </th>
            <th>Amount of water used per unit of product</th>
            <td>
              {(+a.document.water / +a.document.batch) % 1 !== 0
                ? (+a.document.water / +a.document.batch).toFixed(2)
                : +a.document.water / +a.document.batch}
            </td>
            <td>m3/ unit of product</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Recycled or reused water <GiIcons.GiWaterRecycling />
            </th>
            <th>Amount of recycled or reused water used in water consumption per unit of product</th>
            <td>
              {(+a.document.waterrec / +a.document.batch) % 1 !== 0
                ? (+a.document.waterrec / +a.document.batch).toFixed(2)
                : +a.document.waterrec / +a.document.batch}
            </td>
            <td>m3/ unit of product</td>
          </tr>
          <tr>
            <th>Percentage of recycled or reused water per unit of product</th>
            <td>
              {((+a.document.waterrec * 100) / +a.document.water) % 1 !== 0
                ? ((+a.document.waterrec * 100) / +a.document.water).toFixed(2)
                : (+a.document.waterrec * 100) / +a.document.water}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Material consumption <AiIcons.AiFillGold />
              <AiIcons.AiFillGold />
            </th>
            <th>Amount of materials other than water used per unit of product</th>
            <td>
              {(+a.document.material / +a.document.batch) % 1 !== 0
                ? (+a.document.material / +a.document.batch).toFixed(2)
                : +a.document.material / +a.document.batch}
            </td>
            <td>kg/ unit of product</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Recycled or reused materials <BiIcons.BiRecycle />
            </th>
            <th>Amount of recycled or reused materials used in material consumption per unit of product</th>
            <td>
              {(+a.document.materialrec / +a.document.batch) % 1 !== 0
                ? (+a.document.materialrec / +a.document.batch).toFixed(2)
                : +a.document.materialrec / +a.document.batch}
            </td>
            <td>kg/ unit of product</td>
          </tr>
          <tr>
            <th>Percentage of recycled or reused materials per unit of product</th>
            <td>
              {((+a.document.materialrec * 100) / +a.document.material) % 1 !== 0
                ? ((+a.document.materialrec * 100) / +a.document.material).toFixed(2)
                : (+a.document.materialrec * 100) / +a.document.material}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Product recyclability
              <RiIcons.RiRecycleFill />
            </th>
            <th>Whether the product produced is recyclable or reusable</th>
            <td>{+a.document.productrec}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Green packaging and labeling
              <BiIcons.BiPackage />
            </th>
            <th>Whether the product has eco-friendly packaging and labeling</th>
            <td>{+a.document.ecolabel}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={16} className="category">
              Pollution and Waste Management
            </th>
            <th rowSpan={1}>
              Greenhouse gas emission <GiIcons.GiGreenhouse />
            </th>
            <th>Amount of greenhouse gas emission generated per unit of product</th>
            <td>
              {(+a.document.ghg / +a.document.batch) % 1 !== 0
                ? (+a.document.ghg / +a.document.batch).toFixed(2)
                : +a.document.ghg / +a.document.batch}
            </td>
            <td>tonnes of CO2e/ unit of product</td>
          </tr>
          <tr>
            <th rowSpan={5}>
              Pollution management <GiIcons.GiChemicalDrop />
            </th>
            <th>Amount of water pollution generated per unit of product</th>
            <td>
              {(+a.document.waterpol / +a.document.batch) % 1 !== 0
                ? (+a.document.waterpol / +a.document.batch).toFixed(2)
                : +a.document.waterpol / +a.document.batch}
            </td>
            <td>m3/ unit of product</td>
          </tr>
          <tr>
            <th>Type of water pollution</th>
            <td>{(+a.document.waterpoltype + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th>Amount of land pollution generated per unit of product</th>
            <td>
              {(+a.document.landpol / +a.document.batch) % 1 !== 0
                ? (+a.document.landpol / +a.document.batch).toFixed(2)
                : +a.document.landpol / +a.document.batch}
            </td>
            <td>m2/ unit of product</td>
          </tr>
          <tr>
            <th>Type of land pollution</th>
            <td>{(+a.document.landpoltype + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th>Amount of air emission generated per unit of product</th>
            <td>
              {(+a.document.air / +a.document.batch) % 1 !== 0
                ? (+a.document.air / +a.document.batch).toFixed(2)
                : +a.document.air / +a.document.batch}
            </td>
            <td>tonnes/ unit of product</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Use and release of hazardous materials <GiIcons.GiNuclearWaste />
            </th>
            <th>Amount of hazardous materials used per unit of product</th>
            <td>
              {(+a.document.hazmat / +a.document.batch) % 1 !== 0
                ? (+a.document.hazmat / +a.document.batch).toFixed(2)
                : +a.document.hazmat / +a.document.batch}
            </td>
            <td>kg/ unit of product</td>
          </tr>
          <tr>
            <th rowSpan={9}>
              Waste management <GiIcons.GiTrashCan />
            </th>
            <th>Amount of hazardous waste generated per unit of product</th>
            <td>
              {(+a.document.hazwaste / +a.document.batch) % 1 !== 0
                ? (+a.document.hazwaste / +a.document.batch).toFixed(2)
                : +a.document.hazwaste / +a.document.batch}
            </td>
            <td>kg/ unit of product</td>
          </tr>
          <tr>
            <th>Amount of solid waste generated per unit of product</th>
            <td>
              {(+a.document.solidwaste / +a.document.batch) % 1 !== 0
                ? (+a.document.solidwaste / +a.document.batch).toFixed(2)
                : +a.document.solidwaste / +a.document.batch}
            </td>
            <td>kg/ unit of product</td>
          </tr>
          <tr>
            <th>Amount of solid waste recycled or reused per unit of product</th>
            <td>
              {(+a.document.solidwasterec / +a.document.batch) % 1 !== 0
                ? (+a.document.solidwasterec / +a.document.batch).toFixed(2)
                : +a.document.solidwasterec / +a.document.batch}
            </td>
            <td>kg/ unit of product</td>
          </tr>
          <tr>
            <th>Percentage of solid waste recycled or reused per unit of product</th>
            <td>
              {(+a.document.solidwasterec / +a.document.solidwaste) % 1 !== 0
                ? (+a.document.solidwasterec / +a.document.solidwaste).toFixed(2)
                : +a.document.solidwasterec / +a.document.solidwaste}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th>Type of solid waste destination </th>
            <td>{(+a.document.solidwastedes + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th>Amount of waste water generated per unit of product</th>
            <td>
              {(+a.document.waterwaste / +a.document.batch) % 1 !== 0
                ? (+a.document.waterwaste / +a.document.batch).toFixed(2)
                : +a.document.waterwaste / +a.document.batch}
            </td>
            <td>m3/ unit of product</td>
          </tr>
          <tr>
            <th>Amount of waste water recycled or reused per unit of product</th>
            <td>
              {(+a.document.waterwasterec / +a.document.batch) % 1 !== 0
                ? (+a.document.waterwasterec / +a.document.batch).toFixed(2)
                : +a.document.waterwasterec / +a.document.batch}
            </td>
            <td>m3/ unit of product</td>
          </tr>
          <tr>
            <th>Percentage of waste water recycled or reused per unit of product</th>
            <td>
              {(+a.document.waterwasterec / +a.document.waterwaste) % 1 !== 0
                ? (+a.document.waterwasterec / +a.document.waterwaste).toFixed(2)
                : +a.document.waterwasterec / +a.document.waterwaste}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th>Type of waste water destination </th>
            <td>{(+a.document.waterwastedes + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </tr>
  ));

const LCIJourney = () => {
  const web3Instance = useRef<Web3 | null>(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        web3Instance.current = new Web3(window.ethereum);
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
      if (!web3Instance.current) return;

      const networkId = await web3Instance.current.eth.net.getId();
      const networkData = Assessment.networks[networkId as unknown as keyof typeof Assessment.networks];
      if (networkData) {
        //Fetch contract
        const contract = new web3Instance.current.eth.Contract(Assessment.abi, networkData.address);
        const LCICount = Number(await contract.methods.LCICount().call());
        //Load LCIs
        for (let i = 1; i <= LCICount; i++) {
          const newLCI: LCIBlockchain = await contract.methods.LCIs(i).call();
          setLCIs((LCIs) => [
            ...LCIs,
            {
              ...newLCI,
              id: newLCI.id.toString(),
              document: JSON.parse(newLCI.document),
              product: product ? JSON.parse(newLCI.product) : undefined,
            },
          ]);
          setForm((LCIs) => [...LCIs, JSON.parse(newLCI.document)]);
        }
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  const [LCIs, setLCIs] = useState<LCI[]>([]);
  const [form, setForm] = useState<CLIFormType[]>([]);
  const [process, setProcess] = useState<string>("");
  const [product, setProduct] = useState<Product | undefined>();

  // Merge the LCI data with the form data
  const merge = LCIs.map((t1) => ({ ...t1, ...form.find((t2) => t2.id === t1.id) }));
  const assess = merge
    .filter((obj) => obj.process.includes(process))
    .map((obj) => obj)
    .filter((obj) => obj.id.includes(product?.id))
    .map((obj) => obj);
  const lastAssess = assess.slice(-1);

  const params = useSearchParams();
  const processData = params.get("process");
  const productData = params.get("product");

  useEffect(() => {
    setProcess(processData ?? "");
    setProduct(productData ?? undefined);
    console.log(processData);
    console.log(productData);
  }, [processData, productData]);

  return (
    <>
      <Sidebar />
      <div className="margin">
        <table className="assess-table">
          <AssessList assessments={lastAssess} process={process} />
          {lastAssess.length === 0 ? <h3> No Assessment Found</h3> : null}
        </table>
      </div>
    </>
  );
};

export default LCIJourney;
