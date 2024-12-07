"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import getDate from "@/utils/getDate";
import { monthNumber, months } from "@/utils/const";

import Product from "@/types/product";
import { useWeb3Store } from "@/stores/storeProvider";
import Process from "@/types/process";
import Button from "@/UI/Button";
import useToast from "@/hook/useToast";

export default function LCIForm() {
  const animatedComponents = makeAnimated();
  const { account, LCIs, getCLIs, products, assessmentContract } = useWeb3Store((state) => state);

  const [date, setDate] = useState("");
  const [d, setD] = useState("");
  const [product, setProduct] = useState<Product | undefined>();

  const [process, setProcess] = useState<Process | undefined>(undefined);

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
    if (!!!LCIs || !!!process) return;

    const LCIForm = {
      id: LCIs.length + 1,
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
    addLCI({ date, document, month, year, process: process?.id });
  };

  const { notify, update } = useToast();

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
    notify("Đang thêm...");
    assessmentContract?.methods
      .addLCI(date, document, month, year, process)
      .send({ from: account })
      .once("receipt", async () => {
        await getCLIs();
        update(true, "Thêm thành công");
        // router.push("/danh-gia");
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
      <div className="LCI-container ">
        <form className="LCI-form" onSubmit={onSubmit}>
          <div>
            <h3 className="text-2xl font-semibold mb-6">Biểu mẫu đánh giá Vòng đời sản phẩm</h3>

            <div className="center w-full flex justify-between mb-6 items-start">
              <div className="w-1/2 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <label className="!text-base font-semibold ">Sản phẩm</label>
                  <Select
                    placeholder="Chọn sản phẩm"
                    className="!z-[999] w-3/4"
                    required
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    onChange={(e) => {
                      setProduct(products?.find((p) => p.id === (e as { value: string; label: string })?.value));
                    }}
                    options={products?.map((p) => ({ value: p.id, label: p.name })).filter(Boolean)}
                  />
                </div>
                {product && (
                  <div>
                    <label className="!text-base font-semibold">Quy trình sản xuất</label>
                    <Select
                      placeholder="Chọn quy trình sản xuất"
                      className="!z-[99] w-3/4"
                      required
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      onChange={(e) => {
                        setProcess(
                          product?.process?.find((p) => p.id === (e as { value: string; label: string })?.value)
                        );
                      }}
                      options={product.process?.map((p) => ({ value: p.id, label: p.name })).filter(Boolean)}
                    />
                  </div>
                )}
              </div>

              <div className="w-1/2 flex items-center gap-2">
                <label className="!text-base font-semibold">Tháng/năm</label>
                <input required type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} />
              </div>
            </div>

            <fieldset className="monthly-kpi">
              <legend>Cập nhật thông tin vòng đời sản phẩm</legend>
              <div className="">
                <label>1 - Tổng số sản phẩm trong một lô sản phẩm</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                />
                <label className="wrap_text">{product?.unit.name}</label>
                <div className="w-full my-2"></div>
                <label>2 - Tổng số năng lượng sử dụng cho mỗi lô sản phẩm</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                />
                <label className="wrap_text"> kWh/Lô</label>
                <div className="w-full my-2"></div>
                <label>
                  3 - Công suất năng lượng tái tạo được sử dụng trong tiêu thụ năng lượng cho mỗi lô sản phẩm.
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={renewenergy}
                  onChange={(e) => setRenewenergy(e.target.value)}
                />{" "}
                <label className="wrap_text"> kWh/Lô</label>
                <div className="w-full my-2"></div>
                <label>4 - Tổng lượng nước đã sử dụng cho mỗi lô sản phẩm. </label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/Lô</label>
                <div className="w-full my-2"></div>
                <label>
                  5 - Tổng lượng nước tái chế hoặc tái sử dụng được sử dụng trong lượng nước tiêu thụ mỗi lô sản phẩm
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterrec}
                  onChange={(e) => setWaterrec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/Lô</label>
                <div className="w-full my-2"></div>
                <label>6 - Tổng lượng vật liệu không phải nước sử dụng cho mỗi lô sản phẩm.</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ lô</label>
                <div className="w-full my-2"></div>
                <label>7 - Tổng lượng vật liệu tái chế hoặc tái sử dụng được sử dụng trong mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={materialrec}
                  onChange={(e) => setMaterialrec(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ lô</label>
                <div className="w-full my-2"></div>
                <label>8 - Tổng lượng phát thải khí nhà kính (CO2, CH4, N2O, HFC, PFC, SF6) được tạo ra mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={ghg}
                  onChange={(e) => setGhg(e.target.value)}
                />{" "}
                <label className="wrap_text"> tấn CO2e/ lô</label>
                <div className="w-full my-2"></div>
                <label>9 - Tổng lượng ô nhiễm nước phát sinh mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterpol}
                  onChange={(e) => setWaterpol(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">10 - Chọn (các) loại ô nhiễm nước cho mỗi lô</label>
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
                  name="Rác thải"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Rác thải</label>
                <input
                  type="checkbox"
                  name="Hóa chất"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterpoltype)}
                />
                <label className="wrap_text"> Hoá chất</label>
                <div className="w-full my-2"></div>
                <label>11 - Tổng lượng ô nhiễm đất phát sinh mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={landpol}
                  onChange={(e) => setLandpol(e.target.value)}
                />
                <label className="wrap_text"> m2/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">12 - Chọn (các) loại ô nhiễm đất cho mỗi lô</label>
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
                <div className="w-full my-2"></div>
                <label>13 - Tổng lượng khí thải (NOx, SOx) phát sinh mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={air}
                  onChange={(e) => setAir(e.target.value)}
                />{" "}
                <label className="wrap_text"> tấn/ lô</label>
                <div className="w-full my-2"></div>
                <label>14 - Tổng lượng vật liệu nguy hiểm được sử dụng mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazmat}
                  onChange={(e) => setHazmat(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">15 - Tổng lượng chất thải nguy hại phát sinh mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={hazwaste}
                  onChange={(e) => setHazwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ lô</label>
                <div className="w-full my-2"></div>
                <label>16 - Tổng lượng chất thải rắn phát sinh mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwaste}
                  onChange={(e) => setSolidwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> kg/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">17 - Tổng lượng chất thải rắn tái chế hoặc tái sử dụng mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={solidwasterec}
                  onChange={(e) => setSolidwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text">kg/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">18 - Chọn (các) loại điểm đến của chất thải rắn</label>
                <div className="w-full my-2"></div>
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
                  name="Phục hồi"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Phục hồi</label>
                <input
                  type="checkbox"
                  name="Đốt cháy"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setSolidwastedes)}
                />
                <label className="wrap_text"> Đốt cháy</label>
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
                <div className="w-full my-2"></div>
                <label className="form-label">19 - Tổng lượng nước thải phát sinh mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwaste}
                  onChange={(e) => setWaterwaste(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">20 - Tổng lượng nước thải tái chế hoặc tái sử dụng mỗi lô</label>
                <input
                  required
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={waterwasterec}
                  onChange={(e) => setWaterwasterec(e.target.value)}
                />{" "}
                <label className="wrap_text"> m3/ lô</label>
                <div className="w-full my-2"></div>
                <label className="form-label">21 - Chọn (các) loại nơi xử lý nước thải</label>
                <div className="w-full my-2"></div>
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
                  name="Hồi phục"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Hồi phục</label>
                <input
                  type="checkbox"
                  name="Đốt cháy"
                  onChange={(e) => handleChange(e.target.name, e.target.checked, setWaterwastedes)}
                />
                <label className="wrap_text"> Đốt cháy</label>
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
                <div className="w-full my-2"></div>
                <label className="form-label">22 - Sản phẩm có thể tái chế hoặc tái sử dụng được không?</label>
                <input
                  required
                  type="radio"
                  value="Có"
                  checked={productrec === "Có"}
                  onChange={(e) => setProductrec(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  required
                  type="radio"
                  value="Không"
                  checked={productrec === "Không"}
                  onChange={(e) => setProductrec(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="w-full my-2"></div>
                <label className="form-label">
                  23 - Sản phẩm có bao bì và nhãn mác thân thiện với môi trường không?
                </label>
                <input
                  required
                  type="radio"
                  value="Có"
                  checked={ecolabel === "Có"}
                  onChange={(e) => setEcolabel(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  required
                  type="radio"
                  value="Không"
                  checked={ecolabel === "Không"}
                  onChange={(e) => setEcolabel(e.target.value)}
                />
                <label className="wrap_text"> không</label>
                <div className="w-full my-2"></div>
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
