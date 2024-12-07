"use client";

import { useEffect, useState } from "react";

import { ContractDocument } from "@/types/enviro";
import getDate from "@/utils/getDate";
import Button from "@/UI/Button";
import { useWeb3Store } from "@/stores/storeProvider";
import { monthNumber, months } from "@/utils/const";
import { useRouter } from "next/navigation";
import useToast from "@/hook/useToast";

export default function EnviroForm() {
  const router = useRouter();
  const { assessmentContract, account, enviros, getEnviros } = useWeb3Store((state) => state);

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
    if (!account || !!!enviros) return;

    const enviroForm: ContractDocument = {
      id: (enviros.length + 1).toString(),
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

  const { notify, update } = useToast();
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
    notify("Đang thêm...");
    assessmentContract?.methods
      .addEnviro(date, document, month, year)
      .send({ from: account })
      .once("receipt", async () => {
        update(true, "Thêm thành công");
        await getEnviros();
        router.push("/danh-gia");
      });
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
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-2xl font-semibold mb-6">Biểu mẫu đánh giá Tính bền vững môi trường</h3>
              <div className="flex justify-end gap-2 items-center pr-4">
                <label>Chọn Tháng/Năm</label>
                <input
                  type="month"
                  lang="vi"
                  required
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                />
              </div>
            </div>

            <fieldset className="monthly-kpi-env">
              <legend>Cập nhật KPI hàng tháng</legend>
              <div className="center-form-input">
                <label className="form-label">1 - Tổng lượng năng lượng sử dụng mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                />
                <label className="wrap_text"> kWh/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  2 - Tổng lượng năng lượng tái tạo sử dụng trong năng lượng tiêu thụ mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={renewenergy}
                  onChange={(e) => setRenewenergy(e.target.value)}
                />
                <label className="wrap_text"> kWh/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">3 - Tổng lượng nước sử dụng mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  4 - Tổng lượng nước tái chế hoặc tái sử dụng được sử dụng trong lượng nước tiêu thụ mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterrec}
                  onChange={(e) => setWaterrec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">5 - Tổng lượng vật liệu ngoài nước sử dụng trong tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  6 - Tổng lượng vật liệu tái chế hoặc tái sử dụng được sử dụng trong tiêu hao vật liệu mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={materialrec}
                  onChange={(e) => setMaterialrec(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  7 - Tổng lượng phát thải khí nhà kính (CO2, CH4, N2O, HFC, PFC, SF6) phát sinh mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={ghg}
                  onChange={(e) => setGhg(e.target.value)}
                />
                <label className="wrap_text"> tấn CO2/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">8 - Tổng lượng ô nhiễm nước phát sinh mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterpol}
                  onChange={(e) => setWaterpol(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">9 - Chọn (các) loại ô nhiễm nước</label>
                <input
                  type="checkbox"
                  name="Dầu"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Dầu</label>
                <input
                  type="checkbox"
                  name="Nhiên liệu"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Nhiên liệu</label>
                <input
                  type="checkbox"
                  name="Chất thải"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Chất thải</label>
                <input
                  type="checkbox"
                  name="Hóa chất"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Hóa chất</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">10 - Tổng lượng ô nhiễm đất phát sinh mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={landpol}
                  onChange={(e) => setLandpol(e.target.value)}
                />{" "}
                <label className="wrap_text"> m²/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">11 - Chọn (các) loại ô nhiễm đất</label>
                <input
                  type="checkbox"
                  name="Dầu"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Dầu</label>
                <input
                  type="checkbox"
                  name="Nhiên liệu"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Nhiên liệu</label>
                <input
                  type="checkbox"
                  name="Chất thải"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Chất thải</label>
                <input
                  type="checkbox"
                  name="Hóa chất"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setLandpoltype)}
                />
                <label className="wrap_text"> Hóa chất</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">12 -Tổng lượng khí thải (NOx, SOx) phát sinh mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={air}
                  onChange={(e) => setAir(e.target.value)}
                />{" "}
                <label className="wrap_text"> tấn/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  13 - Tổng lượng vật liệu nguy hiểm được sử dụng mỗi tháng
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
                <label className="wrap_text">kg/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">14 - Tổng lượng chất thải nguy hại phát sinh mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazwaste}
                  onChange={(e) => setHazwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">15 - Tổng lượng chất thải rắn phát sinh/tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwaste}
                  onChange={(e) => setSolidwaste(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">16 - Tổng lượng chất thải rắn tái chế, tái sử dụng/tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwasterec}
                  onChange={(e) => setSolidwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">17 - Chọn (các) loại điểm đến của chất thải rắn</label>
                <div className="py-2 w-full"></div>
                <input
                  type="checkbox"
                  name="Tái chế"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Tái chế</label>
                <input
                  type="checkbox"
                  name="Tái sử dụng"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Tái sử dụng</label>
                <input
                  type="checkbox"
                  name="Sự hồi phục"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Sự hồi phục</label>
                <input
                  type="checkbox"
                  name="Thiêu đốt"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Thiêu đốt</label>
                <input
                  type="checkbox"
                  name="Chôn lấp"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Chôn lấp</label>
                <input
                  type="checkbox"
                  name="Ủ phân"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Ủ phân</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">18 - Tổng lượng nước thải phát sinh/tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwaste}
                  onChange={(e) => setWaterwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">19 - Tổng lượng nước thải tái chế hoặc tái sử dụng/tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwasterec}
                  onChange={(e) => setWaterwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ tháng</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">20 - Chọn (các) loại nơi xử lý nước thải</label>
                <div className="py-2 w-full"></div>
                <input
                  type="checkbox"
                  name="Tái chế"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Tái chế</label>
                <input
                  type="checkbox"
                  name="Tái sử dụng"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Tái sử dụng</label>
                <input
                  type="checkbox"
                  name="Sự hồi phục"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Sự hồi phục</label>
                <input
                  type="checkbox"
                  name="Thiêu đốt"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Thiêu đốt</label>
                <input
                  type="checkbox"
                  name="Chôn lấp"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Chôn lấp</label>
                <input
                  type="checkbox"
                  name="Ủ phân"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Ủ phân</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">21 - Tổng số sản phẩm sản xuất mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={product.join(", ")}
                  onChange={(e) => setProduct(e.target.value.split(", ").map((item) => item.trim()))}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  22 -Tổng số sản phẩm được sản xuất có thể tái chế hoặc tái sử dụng mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={productrec}
                  onChange={(e) => setProductrec(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  23 - Tổng số sản phẩm được sản xuất bằng bao bì và nhãn mác thân thiện với môi trường mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={ecolabel}
                  onChange={(e) => setEcolabel(e.target.value)}
                />
                <div className="py-2 w-full"></div>
              </div>
            </fieldset>
            <fieldset className="annual-kpi">
              <legend>Cập nhật KPI hàng năm</legend>
              <div>
                <label className="form-label">
                  1 - Tổng diện tích đất sở hữu, cho thuê, quản lý để sử dụng cho hoạt động sản xuất, khai thác
                </label>
                <div className="py-2 w-full"></div>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={land}
                  onChange={(e) => setLand(e.target.value)}
                />
                <label className="wrap_text"> m2</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">2 - Có chính sách đa dạng sinh học không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="bio"
                  checked={bio === "Có"}
                  onChange={(e) => setBio(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="bio"
                  checked={bio === "Không"}
                  onChange={(e) => setBio(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  3 - Có các hoạt động và hoạt động trên các khu vực được bảo vệ và nhạy cảm không? (ví dụ: khu vực được
                  bảo vệ của IUCN loại 1–4, di sản thế giới và khu dự trữ sinh quyển)
                  {/* <AiIcons.AiOutlineQuestionCircle style={{fontSize: "15px", color:"#2F4050"}} /> */}
                </label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="sensitive"
                  checked={sensitive === "Có"}
                  onChange={(e) => setSensitive(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="sensitive"
                  checked={sensitive === "Không"}
                  onChange={(e) => setSensitive(e.target.value)}
                />
                <label className="wrap_text"> không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">4 - Có chứng nhận ISO 14000 về tiêu chuẩn môi trường không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="envirostand"
                  checked={envirostand === "Có"}
                  onChange={(e) => setEnvirostand(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="envirostand"
                  checked={envirostand === "Không"}
                  onChange={(e) => setEnvirostand(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">5 -Chọn (các) loại công nghệ sạch được sử dụng</label>
                <div className="py-2 w-full"></div>
                <input
                  type="checkbox"
                  name="Tái chế"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Tái chế</label>
                <input
                  type="checkbox"
                  name="Năng lượng tái tạo"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Năng lượng tái tạo</label>
                <input
                  type="checkbox"
                  name="Giao thông xanh"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Giao thông xanh</label>
                <input
                  type="checkbox"
                  name="Động cơ điện"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Động cơ điện</label>
                <div className="py-2 w-full"></div>
                <input
                  type="checkbox"
                  name="Hóa học xanh"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text">Hóa học xanh</label>
                <input
                  type="checkbox"
                  name="Chiếu sáng xanh"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Chiếu sáng xanh</label>
                <input
                  type="checkbox"
                  name="Nước xám"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setClean)}
                />
                <label className="wrap_text"> Nước xám</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  6 - Tổng số nhà cung cấp được giám sát về tính bền vững môi trường mỗi năm
                </label>
                <div className="py-2 w-full"></div>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={envirosus}
                  onChange={(e) => setEnvirosus(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">7 - Tổng số nhà cung cấp mỗi năm</label>
                <div className="py-2 w-full"></div>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={suppliers}
                  onChange={(e) => setSuppliers(e.target.value)}
                />
              </div>
            </fieldset>
            <div className="flex items-end justify-end">
              <Button className="btn form-input-LCI !w-[20%] !self-end" type="submit">
                Gửi
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
