"use client";

import React, { useState, useEffect } from "react";

import getDate from "@/utils/getDate";
import { monthNumber, months } from "@/utils/const";
import { useWeb3Store } from "@/stores/storeProvider";
import { useRouter } from "next/navigation";
import Button from "@/UI/Button";
import useToast from "@/hook/useToast";

const SocialForm = () => {
  const { assessmentContract, account, socials, getSocials } = useWeb3Store((state) => state);

  const [date, setDate] = useState("");
  const [d, setD] = useState("");

  const [monthYear, setMonthYear] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [trainh, setTrainh] = useState("");
  const [trainemp, setTrainemp] = useState("");
  const [emp, setEmp] = useState("");
  const [resemp, setResemp] = useState("");
  const [hiredemp, setHiredemp] = useState("");
  const [fullemp, setFullemp] = useState("");
  const [workh, setWorkh] = useState("");
  const [overtimeh, setOvertimeh] = useState("");
  const [empwage, setEmpwage] = useState("");
  const [minwage, setMinwage] = useState("");
  const [insurance, setInsurance] = useState("");
  const [femwage, setFemwage] = useState("");
  const [malwage, setMalwage] = useState("");
  const [fem, setFem] = useState("");
  const [male, setMale] = useState("");
  const [femboard, setFemboard] = useState("");
  const [empboard, setEmpboard] = useState("");
  const [disabled, setDisabled] = useState("");
  const [minority, setMinority] = useState("");
  const [older, setOlder] = useState("");
  const [socialstand, setSocialstand] = useState("");
  const [ilo, setIlo] = useState("");
  const [fire, setFire] = useState("");
  const [medical, setMedical] = useState("");
  const [sanitation, setSanitation] = useState("");
  const [gear, setGear] = useState("");
  const [workacc, setWorkacc] = useState("");
  const [union, setUnion] = useState("");
  const [empunion, setEmpunion] = useState("");
  const [bargain, setBargain] = useState("");
  const [discri, setDiscri] = useState("");
  const [child, setChild] = useState("");
  const [forced, setForced] = useState("");
  const [indig, setIndig] = useState("");
  const [localemp, setLocalemp] = useState("");
  const [localsup, setLocalsup] = useState("");
  const [donation, setDonation] = useState("");
  const [earning, setEarning] = useState("");
  const [corrup, setCorrup] = useState("");
  const [anticomp, setAnticomp] = useState("");
  const [socialsus, setSocialsus] = useState("");
  const [suppliers, setSuppliers] = useState("");
  const [productassess, setProductassess] = useState("");
  const [product, setProduct] = useState("");
  const [productincident, setProductincident] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [leaks, setLeaks] = useState("");
  const [cuscomp, setCuscomp] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!!!socials || !account) return;

    e.preventDefault();
    const socialForm = {
      id: (+1).toString(),
      trainh: trainh,
      trainemp: trainemp,
      emp: emp,
      resemp: resemp,
      hiredemp: hiredemp,
      fullemp: fullemp,
      workh: workh,
      overtimeh: overtimeh,
      empwage: empwage,
      minwage: minwage,
      insurance: insurance,
      femwage: femwage,
      malwage: malwage,
      fem: fem,
      male: male,
      femboard: femboard,
      empboard: empboard,
      disabled: disabled,
      minority: minority,
      older: older,
      socialstand: socialstand,
      ilo: ilo,
      fire: fire,
      medical: medical,
      sanitation: sanitation,
      gear: gear,
      workacc: workacc,
      union: union,
      empunion: empunion,
      bargain: bargain,
      discri: discri,
      child: child,
      forced: forced,
      indig: indig,
      localemp: localemp,
      localsup: localsup,
      donation: donation,
      earning: earning,
      corrup: corrup,
      anticomp: anticomp,
      socialsus: socialsus,
      suppliers: suppliers,
      productassess: productassess,
      product: product,
      productincident: productincident,
      privacy: privacy,
      leaks: leaks,
      cuscomp: cuscomp,
    };
    const document = JSON.stringify(socialForm);
    setD("now");
    addSocial({ date, document, month, year });
  };

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

  const { notify, update } = useToast();
  const router = useRouter();
  const addSocial = ({
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
      .addSocial(date, document, month, year)
      .send({ from: account })
      .once("receipt", async () => {
        update(true, "Thêm thành công");
        await getSocials();
        router.push("/danh-gia");
      });
  };

  const handleChange = (name: string, checked: boolean) => {
    if (checked) {
      setSocialstand((prev) => `${prev},${name}`);
    } else {
      setSocialstand((prev) => prev.replace(new RegExp(`,?${name}`), ""));
    }
  };

  return (
    <div>
      <div className="LCI-container">
        <form className="LCI-form" onSubmit={onSubmit}>
          <div>
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-2xl font-semibold mb-6">Biểu mẫu đánh giá Tính bền vững xã hội</h3>
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

            <fieldset className="monthly-kpi">
              <legend>Cập nhật KPI hàng tháng</legend>
              <div className="center-form-input">
                <label className="form-label">1 - Tổng số nhân viên</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={emp}
                  onChange={(e) => setEmp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">2 - Tổng số nhân viên toàn thời gian</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={fullemp}
                  onChange={(e) => setFullemp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  3 - Số giờ làm việc theo hợp đồng trung bình hàng tuần của mỗi nhân viên toàn thời gian mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={workh}
                  onChange={(e) => setWorkh(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  4 - Số giờ làm thêm trung bình hàng tuần của mỗi nhân viên mỗi tháng
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={overtimeh}
                  onChange={(e) => setOvertimeh(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">5 - Lương trung bình của nhân viên</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={empwage}
                  onChange={(e) => setEmpwage(e.target.value)}
                />{" "}
                <label className="wrap_text"> ₫</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  6 - Tổng số nhân viên toàn thời gian có thu nhập dưới mức lương tối thiểu
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={minwage}
                  onChange={(e) => setMinwage(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  7 -Tổng số lao động được hưởng bảo hiểm y tế, nghỉ thai sản, thất nghiệp, tàn tật và bảo hiểm tàn tật,
                  điều khoản hưu trí
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">8 - Mức lương trung bình của lao động nữ</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={femwage}
                  onChange={(e) => setFemwage(e.target.value)}
                />{" "}
                <label className="wrap_text"> ₫</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">9 - Mức lương trung bình của nhân viên nam</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={malwage}
                  onChange={(e) => setMalwage(e.target.value)}
                />{" "}
                <label className="wrap_text"> ₫</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">10 - Tổng số lao động nữ</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={fem}
                  onChange={(e) => setFem(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">11 - Tổng số nhân viên nam</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={male}
                  onChange={(e) => setMale(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">12 - Tổng số nhân viên khuyết tật</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={disabled}
                  onChange={(e) => setDisabled(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">13 - Tổng số lao động thiểu số</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={minority}
                  onChange={(e) => setMinority(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">14 - Tổng số nhân viên lớn tuổi</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={older}
                  onChange={(e) => setOlder(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">15- Tổng số lao động địa phương</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={localemp}
                  onChange={(e) => setLocalemp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">16 - Tổng số nhà cung cấp địa phương</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={localsup}
                  onChange={(e) => setLocalsup(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">17 - Tổng số nhà cung cấp</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={suppliers}
                  onChange={(e) => setSuppliers(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">18 - Tổng số sản phẩm và dịch vụ</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">19 - Tổng số khiếu nại của khách hàng mỗi tháng</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={cuscomp}
                  onChange={(e) => setCuscomp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
              </div>
            </fieldset>
            <fieldset className="annual-kpi">
              <legend>Cập nhật KPI hàng năm</legend>
              <div className="center-form-input">
                <label className="form-label">1 - Tổng số giờ đào tạo cho nhân viên mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={trainh}
                  onChange={(e) => setTrainh(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">2 - Total number of trained employees per year</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={trainemp}
                  onChange={(e) => setTrainemp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  3 - Total number of employees who resigned or have been made redundant per year
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={resemp}
                  onChange={(e) => setResemp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">4 - Tổng số lao động được tuyển dụng/năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={hiredemp}
                  onChange={(e) => setHiredemp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">5 -Tổng số lao động nữ giữ các chức vụ trong HĐQT và quản lý</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={femboard}
                  onChange={(e) => setFemboard(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">6 - Tổng số nhân sự trong HĐQT và các chức vụ quản lý</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={empboard}
                  onChange={(e) => setEmpboard(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  {"7 - Chọn (các) chứng nhận bên ngoài về tiêu chuẩn xã hội và quy tắc ứng xử của nhà cung cấp"}
                </label>
                <div className="py-2 w-full"></div>
                <input
                  name="ISO26000"
                  onChange={(e) => handleChange(e.target.name, e.target.checked)}
                  type="checkbox"
                />
                <label className="wrap_text"> ISO26000</label>
                <input name="SA8000" onChange={(e) => handleChange(e.target.name, e.target.checked)} type="checkbox" />
                <label className="wrap_text"> SA8000</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  8 -Có tuân thủ Hướng dẫn của ILO về Hệ thống Quản lý Sức khỏe Nghề nghiệp không?
                </label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="ilo"
                  checked={ilo === "Có"}
                  onChange={(e) => setIlo(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="ilo"
                  checked={ilo === "Không"}
                  onChange={(e) => setIlo(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">9 - Có thiết bị chữa cháy và lối thoát hiểm không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="fire"
                  checked={fire === "Có"}
                  onChange={(e) => setFire(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="fire"
                  checked={fire === "Không"}
                  onChange={(e) => setFire(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">10 - Có cung cấp hỗ trợ y tế và sơ cứu không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="medical"
                  checked={medical === "Có"}
                  onChange={(e) => setMedical(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="medical"
                  checked={medical === "Không"}
                  onChange={(e) => setMedical(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">11 - Có được tiếp cận với nước và vệ sinh không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="sanitation"
                  checked={sanitation === "Có"}
                  onChange={(e) => setSanitation(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="sanitation"
                  checked={sanitation === "Không"}
                  onChange={(e) => setSanitation(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">12 - Có cung cấp đồ bảo hộ không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Có"
                  name="gear"
                  checked={gear === "Có"}
                  onChange={(e) => setGear(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="gear"
                  checked={gear === "Không"}
                  onChange={(e) => setGear(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">13 -Tổng số vụ tai nạn lao động mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={workacc}
                  onChange={(e) => setWorkacc(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">14 - Có (các) công đoàn trong tổ chức không?</label>
                <div className="py-2 w-full"></div>
                <input
                  type="radio"
                  value="Yes"
                  name="union"
                  checked={union === "Yes"}
                  onChange={(e) => setUnion(e.target.value)}
                />
                <label className="wrap_text"> Có</label>
                <input
                  type="radio"
                  value="Không"
                  name="union"
                  checked={union === "Không"}
                  onChange={(e) => setUnion(e.target.value)}
                />
                <label className="wrap_text"> Không</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">15 -Tổng số lao động tham gia công đoàn</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={empunion}
                  onChange={(e) => setEmpunion(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  16 - Tổng số nhân viên được bảo vệ bởi các thỏa thuận thương lượng tập thể
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={bargain}
                  onChange={(e) => setBargain(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  17 - Tổng số vụ việc phân biệt đối xử về chủng tộc, giới tính, khuynh hướng tình dục, tôn giáo, khuyết
                  tật và tuổi mỗi năm
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={discri}
                  onChange={(e) => setDiscri(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">18 -Tổng số lao động trẻ em</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">19 -Tổng số lao động cưỡng bức</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={forced}
                  onChange={(e) => setForced(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">20 -Tổng số vụ vi phạm quyền lợi của người bản địa mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={indig}
                  onChange={(e) => setIndig(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">21 - Tổng số tiền quyên góp từ thiện mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={donation}
                  onChange={(e) => setDonation(e.target.value)}
                />{" "}
                <label className="wrap_text"> ₫</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">22 -Tổng thu nhập trước thuế mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  step=".001"
                  value={earning}
                  onChange={(e) => setEarning(e.target.value)}
                />{" "}
                <label className="wrap_text"> ₫</label>
                <div className="py-2 w-full"></div>
                <label className="form-label">23 - Tổng số vụ tham nhũng mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={corrup}
                  onChange={(e) => setCorrup(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  24 - Tổng số vụ kiện đang chờ xử lý hoặc đã hoàn thành liên quan đến hành vi phản cạnh tranh mỗi năm
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={anticomp}
                  onChange={(e) => setAnticomp(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  25 -Tổng số nhà cung cấp được theo dõi về tính bền vững xã hội mỗi năm
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={socialsus}
                  onChange={(e) => setSocialsus(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  26 - Tổng số sản phẩm và dịch vụ được đánh giá tác động đến sức khỏe và an toàn
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={productassess}
                  onChange={(e) => setProductassess(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  27 - Tổng số sự cố về sức khỏe và an toàn liên quan đến sản phẩm và dịch vụ mỗi năm
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={productincident}
                  onChange={(e) => setProductincident(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">28 - Tổng số khiếu nại về quyền riêng tư của khách hàng mỗi năm</label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                />
                <div className="py-2 w-full"></div>
                <label className="form-label">
                  29 - Tổng số lần rò rỉ, đánh cắp hoặc mất dữ liệu khách hàng mỗi năm
                </label>
                <input
                  type="number"
                  min="0"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={leaks}
                  onChange={(e) => setLeaks(e.target.value)}
                />
                <div className="py-2 w-full"></div>
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
};

export default SocialForm;
