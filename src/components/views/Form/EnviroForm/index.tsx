"use client";

import Web3 from "web3";
import { useEffect, useRef, useState } from "react";
import { Contract } from "web3-eth-contract"; // Import kiểu Contract từ Web3.js

import { OriginAbi } from "@/types/common";
import { ContractDocument } from "@/types/enviro";
import getDate from "@/utils/getDate";
import { Assessment } from "@/lib/abis";

export default function EnviroForm() {
  const web3instance = useRef<Web3 | null>(null);

  // const {register} = useForm();
  const [contract, setContract] = useState<Contract<OriginAbi> | undefined>(undefined);
  const [account, setAccount] = useState<string>();
  const [enviroCount, setEnviroCount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [d, setD] = useState("");

  const [monthYear, setMonthYear] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [energy, setEnergy] = useState("");
  const [renewenergy, setRenewenergy] = useState("");
  const [water, setWater] = useState("");
  const [waterrec, setWaterrec] = useState("");
  const [material, setMaterial] = useState("");
  const [materialrec, setMaterialrec] = useState("");
  const [land, setLand] = useState("");
  const [bio, setBio] = useState("");
  const [sensitive, setSensitive] = useState("");
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
  const [product, setProduct] = useState<string[]>([]);
  const [envirostand, setEnvirostand] = useState("");
  const [clean, setClean] = useState<string[]>([]);
  const [envirosus, setEnvirosus] = useState("");
  const [suppliers, setSuppliers] = useState("");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const monthNumber = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

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
      if (networkData) {
        //Fetch contract
        const contract = new web3instance.current.eth.Contract(Assessment.abi, networkData.address);
        setContract(contract);
        const enviroCount: number = Number(await contract.methods.enviroCount().call());
        setEnviroCount(enviroCount as unknown as number);
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
    const enviroForm: ContractDocument = {
      id: (parseInt(enviroCount.toString()) + 1).toString(), // id is the next number of the last id
      energy: energy,
      renewenergy: renewenergy,
      water: water,
      waterrec: waterrec,
      material: material,
      materialrec: materialrec,
      land: land,
      bio: bio,
      sensitive: sensitive,
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
      products: product,
      envirostand: envirostand,
      clean: clean,
      envirosus: envirosus,
      suppliers: suppliers,
    };
    const document = JSON.stringify(enviroForm);
    setD("now");
    addEnviro({ date, document, month, year });
  };

  const addEnviro = ({
    date,
    document,
    month,
    year,
  }: {
    date: string;
    document: string;
    month: string;
    year: string;
  }) => {
    contract?.methods.addEnviro(date, document, month, year).send({ from: account });
    // .once("receipt", () => {
    //   window.location.assign("http://localhost:3000/assessments");
    // });
  };

  const handleChange = (name: string, checked: boolean, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (checked) {
      set((prev) => [...prev, name]);
    } else {
      console.log("not checked");
    }
  };

  return (
    <div>
      <div className="LCI-container">
        <form className="LCI-form" onSubmit={onSubmit}>
          <div>
            <h3>Enviromental Sustainability Assessment</h3>
            <div className="center">
              <div>
                <label>Select Month/ Year</label>
                <input type="month" required value={monthYear} onChange={(e) => setMonthYear(e.target.value)} />
              </div>
            </div>
            <fieldset className="monthly-kpi-env">
              <legend>Monthly KPI Update</legend>
              <div className="center-form-input">
                <label className="form-label">1 - Total amount of energy used per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                />
                <label className="wrap_text"> kWh/ month</label>
                <div></div>
                <label className="form-label">
                  2 - Total amount of renewable energy used in energy consumption per month
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={renewenergy}
                  onChange={(e) => setRenewenergy(e.target.value)}
                />
                <label className="wrap_text"> kWh/ month</label>
                <div></div>
                <label className="form-label">3 - Total amount of water used per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ month</label>
                <div></div>
                <label className="form-label">
                  4 - Total amount of recycled or reused water used in water consumption per month
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterrec}
                  onChange={(e) => setWaterrec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ month</label>
                <div></div>
                <label className="form-label">5 - Total amount of materials other than water used per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ month</label>
                <div></div>
                <label className="form-label">
                  6 - Total amount of recycled or reused materials used in material consumption per month
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={materialrec}
                  onChange={(e) => setMaterialrec(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ month</label>
                <div></div>
                <label className="form-label">
                  7 - Total amount of greenhouse gas emission (CO2, CH4, N2O, HFCs, PFCs, SF6) generated per month
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={ghg}
                  onChange={(e) => setGhg(e.target.value)}
                />
                <label className="wrap_text"> tonnes of CO2e/ month</label>
                <div></div>
                <label className="form-label">8 - Total amount of water pollution generated per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterpol}
                  onChange={(e) => setWaterpol(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ month</label>
                <div></div>
                <label className="form-label">9 - Choose the type(s) of water pollution</label>
                <input
                  type="checkbox"
                  name="Oil"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Oil</label>
                <input
                  type="checkbox"
                  name="Fuel"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Fuel</label>
                <input
                  type="checkbox"
                  name="Wastes"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Wastes</label>
                <input
                  type="checkbox"
                  name="Chemical"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Chemical</label>
                <div></div>
                <label className="form-label">10 - Total amount of land pollution generated per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={landpol}
                  onChange={(e) => setLandpol(e.target.value)}
                />{" "}
                <label className="wrap_text"> m²/ month</label>
                <div></div>
                <label className="form-label">11 - Choose the type(s) of land pollution</label>
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
                <label className="form-label">12 - Total amount of air emission (NOx, SOx) generated per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={air}
                  onChange={(e) => setAir(e.target.value)}
                />{" "}
                <label className="wrap_text"> tonnes/ month</label>
                <div></div>
                <label className="form-label">
                  13 - Total amount of hazardous materials used per month
                  {/* <AiIcons.AiOutlineQuestionCircle style={{fontSize: "15px", color:"#2F4050"}} /> */}
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazmat}
                  onChange={(e) => setHazmat(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ month</label>
                <div></div>
                <label className="form-label">14 - Total amount of hazardous waste generated per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazwaste}
                  onChange={(e) => setHazwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ month</label>
                <div></div>
                <label className="form-label">15 - Total amount of solid waste generated per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwaste}
                  onChange={(e) => setSolidwaste(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ month</label>
                <div></div>
                <label className="form-label">16 - Total amount of solid waste recycled or reused per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwasterec}
                  onChange={(e) => setSolidwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ month</label>
                <div></div>
                <label className="form-label">17 - Choose the type(s) of solid waste destination</label>
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
                <label className="form-label">18 - Total amount of wastewater generated per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwaste}
                  onChange={(e) => setWaterwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ month</label>
                <div></div>
                <label className="form-label">19 - Total amount of wastewater recycled or reused per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwasterec}
                  onChange={(e) => setWaterwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ month</label>
                <div></div>
                <label className="form-label">20 - Choose the type(s) of wastewater destination</label>
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
                <label className="form-label">21 - Total number of products produced per month</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={product.join(", ")}
                  onChange={(e) => setProduct(e.target.value.split(", ").map((item) => item.trim()))}
                />
                <div></div>
                <label className="form-label">
                  22 - Total number of products produced that are recyclable or reusable per month
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={productrec}
                  onChange={(e) => setProductrec(e.target.value)}
                />
                <div></div>
                <label className="form-label">
                  23 - Total number of products produced with eco-friendly packaging and labeling per month
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={ecolabel}
                  onChange={(e) => setEcolabel(e.target.value)}
                />
                <div></div>
              </div>
            </fieldset>
            <fieldset className="annual-kpi">
              <legend>Annual KPI Update</legend>
              <div>
                <label className="form-label">
                  1 - Total amount of land owned, leased, or managed for production activities or extractive use
                </label>
                <div></div>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={land}
                  onChange={(e) => setLand(e.target.value)}
                />
                <label className="wrap_text"> m2</label>
                <div></div>
                <label className="form-label">2 - Is there a biodiversity policy?</label>
                <div></div>
                <input
                  type="radio"
                  value="Yes"
                  name="bio"
                  checked={bio === "Yes"}
                  onChange={(e) => setBio(e.target.value)}
                />
                <label className="wrap_text"> Yes</label>
                <input
                  type="radio"
                  value="No"
                  name="bio"
                  checked={bio === "No"}
                  onChange={(e) => setBio(e.target.value)}
                />
                <label className="wrap_text"> No</label>
                <div></div>
                <label className="form-label">
                  3 - Are there activities and operations on protected and sensitive areas? (e.g., IUCN protected area
                  categories 1–4, world heritage sites, and biosphere reserves)
                  {/* <AiIcons.AiOutlineQuestionCircle style={{fontSize: "15px", color:"#2F4050"}} /> */}
                </label>
                <div></div>
                <input
                  type="radio"
                  value="Yes"
                  name="sensitive"
                  checked={sensitive === "Yes"}
                  onChange={(e) => setSensitive(e.target.value)}
                />
                <label className="wrap_text"> Yes</label>
                <input
                  type="radio"
                  value="No"
                  name="sensitive"
                  checked={sensitive === "No"}
                  onChange={(e) => setSensitive(e.target.value)}
                />
                <label className="wrap_text"> No</label>
                <div></div>
                <label className="form-label">
                  4 - Is there ISO 14000 certification regarding environmental standards?
                </label>
                <div></div>
                <input
                  type="radio"
                  value="Yes"
                  name="envirostand"
                  checked={envirostand === "Yes"}
                  onChange={(e) => setEnvirostand(e.target.value)}
                />
                <label className="wrap_text"> Yes</label>
                <input
                  type="radio"
                  value="No"
                  name="envirostand"
                  checked={envirostand === "No"}
                  onChange={(e) => setEnvirostand(e.target.value)}
                />
                <label className="wrap_text"> No</label>
                <div></div>
                <label className="form-label">5 - Choose the type(s) of clean technology used</label>
                <div></div>
                <input
                  type="checkbox"
                  name="Recycling"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Recycling</label>
                <input
                  type="checkbox"
                  name="Renewable energy"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Renewable energy</label>
                <input
                  type="checkbox"
                  name="Green transportation"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Green transportation</label>
                <input
                  type="checkbox"
                  name="Electric motors"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Electric motors</label>
                <div></div>
                <input
                  type="checkbox"
                  name="Green chemistry"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Green chemistry</label>
                <input
                  type="checkbox"
                  name="Green lighting"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Green lighting</label>
                <input
                  type="checkbox"
                  name="Grey water"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Grey water</label>
                <div></div>
                <label className="form-label">
                  6 - Total number of suppliers monitored on environmental sustainability per year
                </label>
                <div></div>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={envirosus}
                  onChange={(e) => setEnvirosus(e.target.value)}
                />
                <div></div>
                <label className="form-label">7 - Total number of suppliers per year</label>
                <div></div>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={suppliers}
                  onChange={(e) => setSuppliers(e.target.value)}
                />
              </div>
            </fieldset>
            <div className="center-btn">
              <button className="btn form-input-LCI" type="submit">
                Calculate Assessment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
