"use client";

import { useEffect, useRef, useState } from "react";
import Web3 from "web3";

import Assessment from "../../../../build/contracts/Assessments.json";
import Origin from "../../../../build/contracts/Origin.json";
import getDate from "@/utils/getDate";
import { monthNumber, months } from "@/utils/const";

import { Contract } from "web3-eth-contract"; // Import kiểu Contract từ Web3.js
import { OriginAbi } from "@/types/common";
import Sidebar from "@/components/Sidebar";
import Product, { ProductBlockChain } from "@/types/product";
import LCI, { LCIBlockchain } from "@/types/LCI";

export default function LCIForm() {
  const web3instance = useRef<Web3 | null>(null);

  const [contract, setContract] = useState<Contract<OriginAbi> | undefined>();
  const [form, setForm] = useState<LCI[]>([]);
  const [LCIs, setLCIs] = useState<LCI[]>([]);
  const [account, setAccount] = useState<string>("");
  const [LCICount, setLCICount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [d, setD] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>();
  const [process, setProcess] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [energy, setEnergy] = useState("");
  const [batch, setBatch] = useState("");
  const [renewenergy, setRenewenergy] = useState("");
  const [water, setWater] = useState("");
  const [waterrec, setWaterrec] = useState("");
  const [material, setMaterial] = useState("");
  const [materialrec, setMaterialrec] = useState("");
  const [ghg, setGhg] = useState("");
  const [waterpol, setWaterpol] = useState("");
  const [waterpoltype, setWaterpoltype] = useState<string[]>([]);
  const [landpol, setLandpol] = useState("");
  const [landpoltype, setLandpoltype] = useState<string[]>([]);
  const [air, setAir] = useState("");
  const [hazmat, setHazmat] = useState("");
  const [hazwaste, setHazwaste] = useState("");
  const [solidwaste, setSolidwaste] = useState("");
  const [solidwasterec, setSolidwasterec] = useState("");
  const [solidwastedes, setSolidwastedes] = useState<string[]>([]);
  const [waterwaste, setWaterwaste] = useState("");
  const [waterwasterec, setWaterwasterec] = useState("");
  const [waterwastedes, setWaterwastedes] = useState<string[]>([]);
  const [productrec, setProductrec] = useState("");
  const [ecolabel, setEcolabel] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      web3instance.current = new Web3(window.ethereum);
      window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3instance.current) return;
      const accounts = await web3instance.current.eth.getAccounts();
      setAccount(accounts[0]);
      const networkId = await web3instance.current.eth.net.getId();
      const networkData = Assessment.networks[networkId as unknown as keyof typeof Assessment.networks];
      const networkDataO = Origin.networks[networkId as unknown as keyof typeof Origin.networks];

      if (networkData) {
        //Fetch contract
        const contract = new web3instance.current.eth.Contract(Assessment.abi, networkData.address);
        setContract(contract);
        const LCICount: number = await contract.methods.LCICount().call();
        setLCICount(LCICount);
        const contractO = new web3instance.current.eth.Contract(Origin.abi, networkDataO.address);
        const productCount: number = await contractO.methods.productCount().call();
        //Load LCIs
        for (let i = 1; i <= LCICount; i++) {
          const newLCI = await contract.methods.LCIs(i).call();
          setLCIs((LCIs) => [...LCIs, newLCI as unknown as LCI]);
        }
        for (let i = 1; i <= LCICount; i++) {
          const newLCI: LCIBlockchain = await contract.methods.LCIs(i).call();
          setForm((LCIs) => [...LCIs, JSON.parse(newLCI.document)]);
        }
        //Load products
        for (let i = 1; i <= productCount; i++) {
          const newProduct: ProductBlockChain = await contractO.methods.products(i).call();
          setProducts((products) => [
            ...products,
            {
              ...newProduct,
              id: Number(newProduct.id).toString(),
              process: JSON.parse(newProduct.process),
            } as Product,
          ]);
        }
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  useEffect(() => {
    const date = getDate();
    setDate(date);
    getMonth();
  }, [d, monthYear]);

  const getMonth = () => {
    const month = monthYear.toString().substr(-2);
    const year = monthYear.toString().substr(0, 4);
    setYear(year);
    for (let i = 0; i <= 11; i++) {
      if (month === monthNumber[i]) {
        setMonth(months[i]);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const LCIForm = {
      id: (parseInt((Number(LCICount) ?? 0).toString()) + 1).toString(),
      product: product?.id,
      batch: batch,
      energy: energy,
      renewenergy: renewenergy,
      water: water,
      waterrec: waterrec,
      material: material,
      materialrec: materialrec,
      ghg: ghg,
      waterpol: waterpol,
      waterpoltype: waterpoltype,
      landpol: landpol,
      landpoltype: landpoltype,
      air: air,
      hazmat: hazmat,
      hazwaste: hazwaste,
      solidwaste: solidwaste,
      solidwasterec: solidwasterec,
      solidwastedes: solidwastedes,
      waterwaste: waterwaste,
      waterwasterec: waterwasterec,
      waterwastedes: waterwastedes,
      productrec: productrec,
      ecolabel: ecolabel,
    };
    const document = JSON.stringify(LCIForm);
    setD("now");
    addLCI({ date, document, month, year, process });
  };

  const addLCI = ({
    date,
    document,
    month,
    year,
    process,
  }: {
    date: string;
    document: string;
    month: string;
    year: string;
    process: string;
  }) => {
    contract?.methods
      .addLCI(date, document, month, year, process)
      .send({ from: account })
      .once("receipt", () => {
        window.location.assign("http://localhost:3000/assessments");
      });
  };

  const handleChange = (name: string, checked: boolean, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (checked) {
      set((prev) => [...prev, name]);
    } else {
      console.log("");
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="LCI-container text-black">
        <form className="LCI-form" onSubmit={onSubmit}>
          <div>
            <h3>Chu kì hàng tồn kho</h3>
            <div className="center">
              <div>
                <label>Lựa chọn tháng/năm</label>
                <input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} />
              </div>
              <div>
                <label>Lựa chọn sản phẩm</label>
                <select
                  value={product?.name ?? ""}
                  onChange={(e) => setProduct(products.find((p) => p.id == e.target.value))}
                >
                  <option value="" disabled selected hidden></option>
                  {products.map((product, key) => {
                    return (
                      <option key={key} value={product.id}>
                        {product.name}{" "}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label>Lựa chọn quy trình sản xuất</label>
                <select value={process} onChange={(e) => setProcess(e.target.value)}>
                  <option value="" disabled selected hidden></option>
                  {!!product
                    ? product.process.map((process, i) => (
                        <option key={i} value={process}>
                          {product.process}{" "}
                        </option>
                      ))
                    : null}
                </select>
              </div>
            </div>
            <fieldset className="monthly-kpi">
              <legend>Cập nhật thông tin vòng đời sản phẩm</legend>
              <div className="center-form-input">
                <label>1 - Tổng số sản phẩm trong một lô sản phẩm</label>
                <input
                  type="number"
                  required
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                />
                <div></div>
                <label>2 - Tổng số năng lượng sử dụng cho mỗi lô sản phẩm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                />
                <label className="wrap_text"> kWh/Lô</label>
                <div></div>
                {/* <label>
                4- Choose the type(s) of renewable energy used in the product production
                </label>
                <div></div> 
                    <input 
                        name = "Solar energy" onChange={(e) => handleChange(e.target.name, e.target.checked)}
                        type="checkbox" /><label className="wrap_text"> Solar energy</label> 
                    <input 
                        name = "Hydropower" onChange={(e) => handleChange(e.target.name, e.target.checked)}
                        type="checkbox"/><label className="wrap_text"> Hydropower</label> 
                    <input 
                        name = "Wind energy" onChange={(e) => handleChange(e.target.name, e.target.checked)}
                        type="checkbox"/><label className="wrap_text"> Wind energy</label>
                    <input 
                        name = "Biomass" onChange={(e) => handleChange(e.target.name, e.target.checked)}
                        type="checkbox"/><label className="wrap_text"> Biomass</label> 
                    <input 
                        name = "Geothermal energy" onChange={(e) => handleChange(e.target.name, e.target.checked)}
                        type="checkbox"/><label className="wrap_text"> Geothermal energy</label> 
            <div></div>  */}
                <label>
                  3 - Công suất năng lượng tái tạo được sử dụng trong tiêu thụ năng lượng cho mỗi lô sản phẩm.
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={renewenergy}
                  onChange={(e) => setRenewenergy(e.target.value)}
                />{" "}
                <label className="wrap_text"> kWh/Lô</label>
                <div></div>
                <label>4 - Tổng lượng nước đã sử dụng cho mỗi lô sản phẩm. </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/Lô</label>
                <div></div>
                <label>
                  5 - Tổng lượng nước tái chế hoặc tái sử dụng được sử dụng trong lượng nước tiêu thụ mỗi lô sản phẩm
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterrec}
                  onChange={(e) => setWaterrec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/Lô</label>
                <div></div>
                <label>6 - Tổng lượng vật liệu không phải nước sử dụng cho mỗi lô sản phẩm.</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ batch</label>
                <div></div>
                <label>7 - Tổng lượng vật liệu tái chế hoặc tái sử dụng được sử dụng trong mỗi lô</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={materialrec}
                  onChange={(e) => setMaterialrec(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ batch</label>
                <div></div>
                <label>8 - Tổng lượng phát thải khí nhà kính (CO2, CH4, N2O, HFC, PFC, SF6) được tạo ra mỗi mẻ</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={ghg}
                  onChange={(e) => setGhg(e.target.value)}
                />{" "}
                <label className="wrap_text"> tonnes of CO2e/ batch</label>
                <div></div>
                <label>9 - Tổng lượng ô nhiễm nước phát sinh mỗi mẻ</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterpol}
                  onChange={(e) => setWaterpol(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ batch</label>
                <div></div>
                <label className="form-label">10 - Chọn (các) loại ô nhiễm nước cho mỗi mẻ</label>
                <input
                  type="checkbox"
                  name="Oil"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Dầu</label>
                <input
                  type="checkbox"
                  name="Fuel"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Nhiên liệu</label>
                <input
                  type="checkbox"
                  name="Wastes"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Rác thải</label>
                <input
                  type="checkbox"
                  name="Chemical"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Hoá chất</label>
                <div></div>
                <label>11 - Total amount of land pollution generated per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={landpol}
                  onChange={(e) => setLandpol(e.target.value)}
                />
                <label className="wrap_text"> m2/ batch</label>
                <div></div>
                <label className="form-label">12 - Choose the type(s) of land pollution per batch</label>
                <input
                  type="checkbox"
                  name="Oil"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Oil</label>
                <input
                  type="checkbox"
                  name="Fuel"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Fuel</label>
                <input
                  type="checkbox"
                  name="Wastes"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Wastes</label>
                <input
                  type="checkbox"
                  name="Chemical"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Chemical</label>
                <div></div>
                <label>13 - Total amount of air emission (NOx, SOx) generated per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={air}
                  onChange={(e) => setAir(e.target.value)}
                />{" "}
                <label className="wrap_text"> tonnes/ batch</label>
                <div></div>
                <label>14 - Total amount of hazardous materials used per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazmat}
                  onChange={(e) => setHazmat(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ batch</label>
                <div></div>
                <label className="form-label">15 - Total amount of hazardous waste generated per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazwaste}
                  onChange={(e) => setHazwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ batch</label>
                <div></div>
                <label>16 - Total amount of solid waste generated per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwaste}
                  onChange={(e) => setSolidwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ batch</label>
                <div></div>
                <label className="form-label">17 - Total amount of solid waste recycled or reused per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwasterec}
                  onChange={(e) => setSolidwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ batch</label>
                <div></div>
                <label className="form-label">18 - Choose the type(s) of solid waste destination</label>
                <div></div>
                <input
                  type="checkbox"
                  name="Recycling"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Recycling</label>
                <input
                  type="checkbox"
                  name="Reuse"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Reuse</label>
                <input
                  type="checkbox"
                  name="Recovery"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Recovery</label>
                <input
                  type="checkbox"
                  name="Incineration"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Incineration</label>
                <input
                  type="checkbox"
                  name="Landfilling"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Landfilling</label>
                <input
                  type="checkbox"
                  name="Composting"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Composting</label>
                <div></div>
                <label className="form-label">19 - Total amount of wastewater generated per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwaste}
                  onChange={(e) => setWaterwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ batch</label>
                <div></div>
                <label className="form-label">20 - Total amount of wastewater recycled or reused per batch</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwasterec}
                  onChange={(e) => setWaterwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ batch</label>
                <div></div>
                <label className="form-label">21 - Choose the type(s) of wastewater destination</label>
                <div></div>
                <input
                  type="checkbox"
                  name="Recycling"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Recycling</label>
                <input
                  type="checkbox"
                  name="Reuse"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Reuse</label>
                <input
                  type="checkbox"
                  name="Recovery"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Recovery</label>
                <input
                  type="checkbox"
                  name="Incineration"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Incineration</label>
                <input
                  type="checkbox"
                  name="Landfilling"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Landfilling</label>
                <input
                  type="checkbox"
                  name="Composting"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Composting</label>
                <div></div>
                <label className="form-label">22 - Is the product recyclable or reusable?</label>
                <input
                  type="radio"
                  value="Yes"
                  checked={productrec === "Yes"}
                  onChange={(e) => setProductrec(e.target.value)}
                />
                <label className="wrap_text"> Yes</label>
                <input
                  type="radio"
                  value="No"
                  checked={productrec === "No"}
                  onChange={(e) => setProductrec(e.target.value)}
                />
                <label className="wrap_text"> No</label>
                <div></div>
                <label className="form-label">23 - Does the product has eco-friendly packaging and labeling?</label>
                <input
                  type="radio"
                  value="Yes"
                  checked={ecolabel === "Yes"}
                  onChange={(e) => setEcolabel(e.target.value)}
                />
                <label className="wrap_text"> Yes</label>
                <input
                  type="radio"
                  value="No"
                  checked={ecolabel === "No"}
                  onChange={(e) => setEcolabel(e.target.value)}
                />
                <label className="wrap_text"> No</label>
                <div></div>
              </div>
            </fieldset>
            <div className="center-btn">
              <button className="btn form-input-LCI" type="submit">
                Calculate LCI
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
