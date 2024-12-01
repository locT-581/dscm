"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import { Bar, Line } from "react-chartjs-2";
import {
  ChartData,
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  BarController,
  BarElement,
} from "chart.js";
import { useWeb3Store } from "@/stores/storeProvider";
import Supplier from "@/types/supplier";
import Assessment from "@/types/assessment";
import { SocialFormType } from "@/types/document";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement
);

export default function SocialReport() {
  const { socials, suppliers } = useWeb3Store((state) => state);

  const [socialform, setSocialForm] = useState<SocialFormType[]>([]);
  const [month, setMonth] = useState<string[]>([]);
  const [year, setYear] = useState<string[]>([]);

  const [formAccount, setFormAccount] = useState<Supplier[]>([]);

  const [formMonth, setFormMonth] = useState("");
  const [formYear, setFormYear] = useState("");
  const [company, setCompany] = useState<Supplier | undefined>();

  const [data, setData] = useState<Assessment[]>([]);

  const [optionsH, setOptionsH] = useState<ChartOptions<"line">>({});
  const [optionsM, setOptionsM] = useState<ChartOptions<"bar" | "line">>({});

  const [empChartData, setEmpChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [wageChartData, setWageChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [donationChartData, setDonationChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [trainChartData, setTrainChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [genderChartData, setGenderChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [divChartData, setDivChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [hiredChartData, setHiredChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [hoursChartData, setHoursChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [humanChartData, setHumanChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [incidentsChartData, setIncidentsChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [customerChartData, setCustomerChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [productChartData, setProductChartData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [unionChartData, setUnionChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });
  const [supplierChartData, setSupplierChartData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const dataE = useMemo(() => {
    return socials?.map((t1) => ({ ...t1, ...socialform.find((t2) => t2.id === t1.id) }));
  }, [socialform, socials]);

  useEffect(() => {
    if (!!socials) {
      socials.forEach((social) => {
        setFormAccount((accounts) => [...accounts, social.account]);
        setMonth((socials) => [...socials, social.month]);
        setYear((socials) => [...socials, social.year]);
        setSocialForm((socials) => [...socials, social.document as SocialFormType]);
      });
    }
  }, [socials]);

  const unique = [...new Set(formAccount.map((item) => item))];
  const uniqueMonth = [...new Set(month.map((item) => item))];
  const uniqueYear = [...new Set(year.map((item) => item))];

  useEffect(() => {
    const filter = () => {
      if (formMonth === "All") {
        const data = dataE
          ?.filter((obj) => obj.account?.id?.includes(company?.id ?? ""))
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
          ?.filter((obj) => obj.account?.id?.includes(company?.id ?? ""))
          .filter((obj) => obj.month.includes(formMonth))
          .filter((obj) => obj.year.includes(formYear))
          .map((p) => p);
        setData(data ?? []);
      }
      if (formMonth === "All" && formYear === "All") {
        const data = dataE?.filter((obj) => obj.account?.id?.includes(company?.id ?? "")).map((p) => p);
        setData(data ?? []);
      }
    };
    filter();
  }, [company, formMonth, formYear]);

  useEffect(() => {
    const charts = async () => {
      const id = data.map((a) => a.month + " " + a.year);
      const emp = data.map((a) => parseInt((a.document as SocialFormType).emp));
      const trainh = data.map(
        (a) => parseInt((a.document as SocialFormType).trainh) / parseInt((a.document as SocialFormType).trainemp)
      );
      const trainemp = data.map((a) => parseInt((a.document as SocialFormType).trainemp));
      const resemp = data.map((a) => parseInt((a.document as SocialFormType).resemp));
      const hiredemp = data.map((a) => parseInt((a.document as SocialFormType).hiredemp));
      const fullemp = data.map((a) => parseInt((a.document as SocialFormType).fullemp));
      const partemp = data.map(
        (a) => parseInt((a.document as SocialFormType).emp) - parseInt((a.document as SocialFormType).fullemp)
      );
      const workh = data.map((a) => parseInt((a.document as SocialFormType).workh));
      const overtimeh = data.map((a) => parseInt((a.document as SocialFormType).overtimeh));
      const empwage = data.map((a) => parseInt((a.document as SocialFormType).empwage));
      const minwage = data.map((a) => parseInt((a.document as SocialFormType).minwage));
      const insurance = data.map((a) => parseInt((a.document as SocialFormType).insurance));
      const femwage = data.map((a) => parseInt((a.document as SocialFormType).femwage));
      const malwage = data.map((a) => parseInt((a.document as SocialFormType).malwage));
      const fem = data.map((a) => parseInt((a.document as SocialFormType).fem));
      const male = data.map((a) => parseInt((a.document as SocialFormType).male));
      const femboard = data.map((a) => parseInt((a.document as SocialFormType).femboard));
      const empboard = data.map((a) => parseInt((a.document as SocialFormType).empboard));
      const disabled = data.map((a) => parseInt((a.document as SocialFormType).disabled));
      const minority = data.map((a) => parseInt((a.document as SocialFormType).minority));
      const older = data.map((a) => parseInt((a.document as SocialFormType).older));
      const workacc = data.map((a) => parseInt((a.document as SocialFormType).minority));
      const empunion = data.map((a) => parseInt((a.document as SocialFormType).empunion));
      const bargain = data.map((a) => parseInt((a.document as SocialFormType).bargain));
      const discri = data.map((a) => parseInt((a.document as SocialFormType).discri));
      const child = data.map((a) => parseInt((a.document as SocialFormType).child));
      const forced = data.map((a) => parseInt((a.document as SocialFormType).forced));
      const indig = data.map((a) => parseInt((a.document as SocialFormType).indig));
      const localemp = data.map((a) => parseInt((a.document as SocialFormType).localemp));
      const localsup = data.map((a) => parseInt((a.document as SocialFormType).localsup));
      const donation = data.map((a) => parseInt((a.document as SocialFormType).donation));
      const earning = data.map((a) => parseInt((a.document as SocialFormType).earning));
      const corrup = data.map((a) => parseInt((a.document as SocialFormType).corrup));
      const anticomp = data.map((a) => parseInt((a.document as SocialFormType).anticomp));
      const socialsus = data.map((a) => parseInt((a.document as SocialFormType).socialsus));
      const productassess = data.map((a) => parseInt((a.document as SocialFormType).productassess));
      const product = data.map((a) => parseInt((a.document as SocialFormType).product.id));
      const productincident = data.map((a) => parseInt((a.document as SocialFormType).productincident));
      const privacy = data.map((a) => parseInt((a.document as SocialFormType).privacy));
      const leaks = data.map((a) => parseInt((a.document as SocialFormType).leaks));
      const cuscomp = data.map((a) => parseInt((a.document as SocialFormType).cuscomp));
      const suppliers = data.map((a) => parseInt((a.document as SocialFormType).suppliers));

      setDonationChartData({
        labels: id,
        datasets: [
          {
            label: "Đóng góp cho tổ chức từ thiện",
            data: donation,
            borderColor: "rgb(252, 217, 0)",
            backgroundColor: "rgba(252, 217, 0)",
          },
          {
            label: "Thu nhập trước thuế của công ty",
            data: earning,
            borderColor: "rgb(184,225,133)",
            backgroundColor: "rgba(184,225,133)",
          },
        ],
      });

      setOptionsM({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Tiền bạc (TL)",
            },
          },
        },
      });

      setTrainChartData({
        labels: id,
        datasets: [
          {
            label: "Số giờ đào tạo trung bình cho mỗi nhân viên mỗi năm",
            data: trainh,
            borderColor: "rgb(233, 196, 106)",
            backgroundColor: "rgba(233, 196, 106)",
          },
        ],
      });

      setIncidentsChartData({
        labels: id,
        datasets: [
          {
            label: "Tai nạn lao động",
            data: workacc,
            borderColor: "rgb(34, 34, 59)",
            backgroundColor: "rgba(34, 34, 59)",
          },
          {
            label: "Vi phạm quyền của người bản địa",
            data: indig,
            borderColor: "rgb(74, 78, 105)",
            backgroundColor: "rgba(74, 78, 105)",
          },
          {
            label: "Sự cố phân biệt đối xử",
            data: discri,
            borderColor: "rgb(108, 117, 125)",
            backgroundColor: "rgba(108, 117, 125)",
          },
          {
            label: "Sự cố tham nhũng",
            data: corrup,
            borderColor: "rgb(154, 140, 152)",
            backgroundColor: "rgba(154, 140, 152)",
          },
          {
            label: "Hành động pháp lý liên quan đến hành vi phản cạnh tranh",
            data: anticomp,
            borderColor: "rgb(201, 173, 167)",
            backgroundColor: "rgba(201, 173, 167)",
          },
        ],
      });

      setUnionChartData({
        labels: id,
        datasets: [
          {
            label: "Người lao động gia nhập Công đoàn",
            data: empunion,
            borderColor: "rgb(64, 121, 140)",
            backgroundColor: "rgba(64, 121, 140)",
          },
          {
            label: "Nhân viên được bảo vệ bởi các thỏa thuận thương lượng tập thể",
            data: bargain,
            borderColor: "rgb(112, 169, 161)",
            backgroundColor: "rgba(112, 169, 161)",
          },
          {
            label: "Người lao động",
            data: emp,
            borderColor: "rgb(158, 193, 163)",
            backgroundColor: "rgba(158, 193, 163)",
          },
        ],
      });

      setDivChartData({
        labels: id,
        datasets: [
          {
            label: "Nhân viên khuyết tật",
            data: disabled,
            borderColor: "rgb(248, 150, 30)",
            backgroundColor: "rgba(248, 150, 30)",
          },
          {
            label: "Nhân viên thiểu số",
            data: minority,
            borderColor: "rgb(67, 170, 139)",
            backgroundColor: "rgba(67, 170, 139)",
          },
          {
            label: "Nhân viên có độ tuổi trên 65",
            data: older,
            borderColor: "rgb(144, 190, 109)",
            backgroundColor: "rgba(144, 190, 109)",
          },
          {
            label: "Nhân viên địa phương",
            data: localemp,
            borderColor: "rgb(215, 185, 213)",
            backgroundColor: "rgba(215, 185, 213)",
          },
          {
            label: "Người lao động",
            data: emp,
            borderColor: "rgb(243, 114, 44)",
            backgroundColor: "rgba(243, 114, 44)",
          },
        ],
      });

      setEmpChartData({
        labels: id,
        datasets: [
          {
            label: "Nhân viên toàn thời gian",
            data: fullemp,
            borderColor: "rgb(0, 119, 182)",
            backgroundColor: "rgba(0, 119, 182)",
          },
          {
            label: "Nhân viên bán thời gian",
            data: partemp,
            borderColor: "rgb(118,111,178)",
            backgroundColor: "rgba(118,111,178)",
          },
          {
            label: "Nhân viên được đào tạo mỗi năm",
            data: trainemp,
            borderColor: "rgb(144, 190, 109)",
            backgroundColor: "rgba(144, 190, 109)",
          },
          {
            label: "Nhân viên được hưởng Bảo hiểm",
            data: insurance,
            borderColor: "rgb(136, 204, 241)",
            backgroundColor: "rgba(136, 204, 241)",
          },
          {
            label: "Nhân viên có thu nhập dưới mức lương tối thiểu",
            data: minwage,
            borderColor: "rgb(187, 62, 3)",
            backgroundColor: "rgba(187, 62, 3)",
          },
          {
            label: "Người lao động",
            data: emp,
            borderColor: "rgb(45, 106, 79)",
            backgroundColor: "rgba(45, 106, 79)",
          },
        ],
      });

      setWageChartData({
        labels: id,
        datasets: [
          {
            label: "Mức lương trung bình của nhân viên",
            data: empwage,
            borderColor: "rgb(142, 202, 230)",
            backgroundColor: "rgba(142, 202, 230)",
          },
          {
            label: "Mức lương trung bình của nhân viên nữ",
            data: femwage,
            borderColor: "rgb(144, 190, 109)",
            backgroundColor: "rgba(144, 190, 109)",
          },
          {
            label: "Mức lương trung bình của nhân viên nam",
            data: malwage,
            borderColor: "rgb(45, 106, 79)",
            backgroundColor: "rgba(45, 106, 79)",
          },
        ],
      });

      setGenderChartData({
        labels: id,
        datasets: [
          {
            label: "Nhân viên nữ",
            data: fem,
            borderColor: "rgb(171,217,233)",
            backgroundColor: "rgba(171,217,233)",
          },
          {
            label: "Nhân viên nam",
            data: male,
            borderColor: "rgb(98,195,165)",
            backgroundColor: "rgba(98,195,165)",
          },
          {
            label: "Thành viên HĐQT nữ",
            data: femboard,
            borderColor: "rgb(252, 217, 0)",
            backgroundColor: "rgba(252, 217, 0)",
          },
          {
            label: "Thành viên Hội đồng quản trị",
            data: empboard,
            borderColor: "rgb(184,225,133)",
            backgroundColor: "rgba(184,225,133)",
          },
        ],
      });

      setHoursChartData({
        labels: id,
        datasets: [
          {
            label: "Giờ làm việc hàng tuầns",
            data: workh,
            borderColor: "rgb(236,113,20)",
            backgroundColor: "rgba(236,113,20)",
          },
          {
            label: "Số giờ làm thêm hàng tuần",
            data: overtimeh,
            borderColor: "rgb(226,117,174)",
            backgroundColor: "rgba(226,117,174)",
          },
        ],
      });

      setOptionsH({
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "Giờ",
            },
          },
        },
      });

      setHiredChartData({
        labels: id,
        datasets: [
          {
            label: "Nhân viên được thuê",
            data: hiredemp,
            borderColor: "rgb(33, 158, 188)",
            backgroundColor: "rgba(33, 158, 188)",
          },
          {
            label: "Nhân viên đã từ chức hoặc bị sa thải",
            data: resemp,
            borderColor: "rgb(2, 48, 71)",
            backgroundColor: "rgba(2, 48, 71)",
          },
        ],
      });

      setHumanChartData({
        labels: id,
        datasets: [
          {
            label: "Lao động trẻ em",
            data: child,
            borderColor: "rgb(88, 49, 1)",
            backgroundColor: "rgba(88, 49, 1)",
          },
          {
            label: "Lao động cưỡng bức",
            data: forced,
            borderColor: "rgb(190, 140, 99)",
            backgroundColor: "rgba(190, 140, 99)",
          },
        ],
      });

      setCustomerChartData({
        labels: id,
        datasets: [
          {
            label: "Khiếu nại của khách hàng",
            data: cuscomp,
            borderColor: "rgb(49,135,189)",
            backgroundColor: "rgba(49,135,189)",
          },
          {
            label: "Khiếu nại về quyền riêng tư của khách hàng",
            data: privacy,
            borderColor: "rgb(217, 237, 146)",
            backgroundColor: "rgba(217, 237, 146)",
          },
          {
            label: "Rò rỉ, trộm cắp hoặc mất dữ liệu khách hàng",
            data: leaks,
            borderColor: "rgb(120, 147, 138)",
            backgroundColor: "rgba(120, 147, 138)",
          },
        ],
      });

      setProductChartData({
        labels: id,
        datasets: [
          {
            label: "Các sản phẩm",
            data: product,
            borderColor: "rgb(142, 202, 230)",
            backgroundColor: "rgba(142, 202, 230)",
          },
          {
            label: "Sản phẩm có Đánh giá tác động về sức khỏe và an toàn",
            data: productassess,
            borderColor: "rgb(144, 190, 109)",
            backgroundColor: "rgba(144, 190, 109)",
          },
          {
            label: "Sự cố về sức khỏe và an toàn sản phẩm",
            data: productincident,
            borderColor: "rgb(45, 106, 79)",
            backgroundColor: "rgba(45, 106, 79)",
          },
        ],
      });

      setSupplierChartData({
        labels: id,
        datasets: [
          {
            label: "Các nhà cung cấp được giám sát về tính bền vững xã hội",
            data: socialsus,
            borderColor: "rgb(249, 132, 74)",
            backgroundColor: "rgba(249, 132, 74)",
          },
          {
            label: "Nhà cung cấp địa phương",
            data: localsup,
            borderColor: "rgb(190, 140, 99)",
            backgroundColor: "rgba(190, 140, 99)",
          },
          {
            label: "Nhà cung cấp",
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
    <div>
      <div className="charts-header">
        <h2>Báo cáo bền vững xã hội</h2>
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
          <Bar className="line" data={empChartData} />
        </div>
        <div>
          <Line className="line" data={trainChartData} options={optionsH} />
        </div>
        <div>
          <Line className="line" data={hoursChartData} options={optionsH} />
        </div>
        <div>
          <Bar className="line" data={wageChartData} options={optionsM} />
        </div>
        <div>
          <Bar className="line" data={genderChartData} />
        </div>
        <div>
          <Bar className="line" data={divChartData} />
        </div>
        <div>
          <Bar className="line" data={unionChartData} />
        </div>
        <div>
          <Line className="line" data={hiredChartData} />
        </div>
        <div>
          <Line className="line" data={humanChartData} />
        </div>
        <div>
          <Bar className="line" data={incidentsChartData} />
        </div>
        <div>
          <Line className="line" data={donationChartData} options={optionsM} />
        </div>
        <div>
          <Line className="line" data={supplierChartData} />
        </div>
        <div>
          <Line className="line" data={productChartData} />
        </div>
        <div>
          <Line className="line" data={customerChartData} />
        </div>
      </div>
    </div>
  );
}
