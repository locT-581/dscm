"use client";

import * as GiIcons from "react-icons/gi";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Assessment from "@/types/assessment";
import { useWeb3Store } from "@/stores/storeProvider";
import { CLIFormType } from "@/types/document";

const AssessList = ({ assessments }: { assessments: Assessment[] }) =>
  assessments.map((a) => (
    <tr key={a.id}>
      <th>
        <table className="LCI-table">
          <caption>
            Kiểm kê vòng đời của {a.process?.name ?? ""} của {(a.document as CLIFormType)?.product?.name}
          </caption>
          <caption className="captwo">
            {"Cho kỳ tháng " + a.month + " năm " + a.year + " bởi "}
            {a.account.name}
          </caption>
          <thead>
            <tr>
              <th>Thể loại</th>
              <th>Các chỉ số</th>
              <th>Số đo</th>
              <th>Giá trị</th>
              <th>Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th rowSpan={9} className="category">
                Tài nguyên thiên nhiên
              </th>
              <th rowSpan={1}>
                Tiêu thụ năng lượng <GiIcons.GiElectric />
              </th>
              <th>Lượng năng lượng sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).energy / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).energy / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).energy / +(a.document as CLIFormType).batch}
              </td>
              <td>kWh/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Năng lượng tái tạo <GiIcons.GiWindTurbine />
              </th>
              <th>Lượng năng lượng tái tạo được sử dụng trong tiêu thụ năng lượng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).renewenergy / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).renewenergy / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).renewenergy / +(a.document as CLIFormType).batch}
              </td>
              <td>kWh/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Tỷ lệ năng lượng tái tạo được sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {((+(a.document as CLIFormType).renewenergy * 100) / +(a.document as CLIFormType).energy) % 1 !== 0
                  ? ((+(a.document as CLIFormType).renewenergy * 100) / +(a.document as CLIFormType).energy).toFixed(2)
                  : (+(a.document as CLIFormType).renewenergy * 100) / +(a.document as CLIFormType).energy}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Tiêu thụ nước <GiIcons.GiWaterDrop />
              </th>
              <th>Lượng nước sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).water / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).water / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).water / +(a.document as CLIFormType).batch}
              </td>
              <td>m3/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Nước tái chế hoặc tái sử dụng <GiIcons.GiWaterRecycling />
              </th>
              <th>
                Lượng nước tái chế hoặc tái sử dụng được sử dụng trong lượng nước tiêu thụ trên một đơn vị sản phẩm
              </th>
              <td>
                {(+(a.document as CLIFormType).waterrec / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).waterrec / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).waterrec / +(a.document as CLIFormType).batch}
              </td>
              <td>m3/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Tỷ lệ nước tái chế hoặc tái sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {((+(a.document as CLIFormType).waterrec * 100) / +(a.document as CLIFormType).water) % 1 !== 0
                  ? ((+(a.document as CLIFormType).waterrec * 100) / +(a.document as CLIFormType).water).toFixed(2)
                  : (+(a.document as CLIFormType).waterrec * 100) / +(a.document as CLIFormType).water}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Tiêu thụ vật liệu
                <AiIcons.AiFillGold />
                <AiIcons.AiFillGold />
              </th>
              <th>Lượng nguyên liệu không phải nước được sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).material / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).material / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).material / +(a.document as CLIFormType).batch}
              </td>
              <td>kg/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Vật liệu tái chế hoặc tái sử dụng <BiIcons.BiRecycle />
              </th>
              <th>
                Lượng vật liệu tái chế hoặc tái sử dụng được sử dụng trong tiêu hao nguyên liệu trên một đơn vị sản phẩm
              </th>
              <td>
                {(+(a.document as CLIFormType).materialrec / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).materialrec / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).materialrec / +(a.document as CLIFormType).batch}
              </td>
              <td>kg/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Tỷ lệ vật liệu tái chế hoặc tái sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {((+(a.document as CLIFormType).materialrec * 100) / +(a.document as CLIFormType).material) % 1 !== 0
                  ? ((+(a.document as CLIFormType).materialrec * 100) / +(a.document as CLIFormType).material).toFixed(
                      2
                    )
                  : (+(a.document as CLIFormType).materialrec * 100) / +(a.document as CLIFormType).material}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={18} className="category">
                Quản lý ô nhiễm và chất thải
              </th>
              <th rowSpan={1}>
                Phát thải khí nhà kính
                <GiIcons.GiGreenhouse />
              </th>
              <th>Lượng phát thải khí nhà kính trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).ghg / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).ghg / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).ghg / +(a.document as CLIFormType).batch}
              </td>
              <td>tấn CO2e/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Ô nhiễm không khí
                <GiIcons.GiGasMask />
              </th>
              <th>Lượng khí thải phát sinh trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).air / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).air / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).air / +(a.document as CLIFormType).batch}
              </td>
              <td>tấn/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Ô nhiễm nước
                <GiIcons.GiChemicalDrop />
              </th>
              <th>Lượng ô nhiễm nước tạo ra trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).waterpol / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).waterpol / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).waterpol / +(a.document as CLIFormType).batch}
              </td>
              <td>m3/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Loại ô nhiễm nước</th>
              <td>{(+(a.document as CLIFormType).waterpoltype + " ").replace(/,/g, ", ")}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={2}>
                ô nhiễm đất
                <GiIcons.GiChemicalDrop />
              </th>
              <th>Lượng ô nhiễm đất phát sinh trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).landpol / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).landpol / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).landpol / +(a.document as CLIFormType).batch}
              </td>
              <td>m2/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Loại ô nhiễm đất</th>
              <td>{(+(a.document as CLIFormType).landpoltype + " ").replace(/,/g, ", ")}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Sử dụng vật liệu nguy hiểm
                <GiIcons.GiPoisonBottle />
              </th>
              <th>Lượng vật liệu nguy hiểm được sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).hazmat / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).hazmat / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).hazmat / +(a.document as CLIFormType).batch}
              </td>
              <td>kg/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Chất thải nguy hại
                <GiIcons.GiNuclearWaste />
              </th>
              <th>Lượng chất thải nguy hại phát sinh trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).hazwaste / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).hazwaste / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).hazwaste / +(a.document as CLIFormType).batch}
              </td>
              <td>kg/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th rowSpan={4}>
                Chất thải rắn
                <GiIcons.GiTrashCan />
              </th>
              <th>Lượng chất thải rắn phát sinh trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).solidwaste / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).solidwaste / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).solidwaste / +(a.document as CLIFormType).batch}
              </td>
              <td>kg/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Lượng chất thải rắn được tái chế hoặc tái sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).solidwasterec / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).solidwasterec / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).solidwasterec / +(a.document as CLIFormType).batch}
              </td>
              <td>kg/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Tỷ lệ chất thải rắn được tái chế hoặc tái sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).solidwasterec / +(a.document as CLIFormType).solidwaste) % 1 !== 0
                  ? (+(a.document as CLIFormType).solidwasterec / +(a.document as CLIFormType).solidwaste).toFixed(2)
                  : +(a.document as CLIFormType).solidwasterec / +(a.document as CLIFormType).solidwaste}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Loại điểm đến chất thải rắn </th>
              <td>{(+(a.document as CLIFormType).solidwastedes + " ").replace(/,/g, ", ")}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={4}>
                Nước thải
                <GiIcons.GiTrashCan />
              </th>
              <th>Lượng nước thải phát sinh trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).waterwaste / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).waterwaste / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).waterwaste / +(a.document as CLIFormType).batch}
              </td>
              <td>m3/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Lượng nước thải được tái chế hoặc tái sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).waterwasterec / +(a.document as CLIFormType).batch) % 1 !== 0
                  ? (+(a.document as CLIFormType).waterwasterec / +(a.document as CLIFormType).batch).toFixed(2)
                  : +(a.document as CLIFormType).waterwasterec / +(a.document as CLIFormType).batch}
              </td>
              <td>m3/đơn vị sản phẩm</td>
            </tr>
            <tr>
              <th>Tỷ lệ nước thải được tái chế hoặc tái sử dụng trên một đơn vị sản phẩm</th>
              <td>
                {(+(a.document as CLIFormType).waterwasterec / +(a.document as CLIFormType).waterwaste) % 1 !== 0
                  ? (+(a.document as CLIFormType).waterwasterec / +(a.document as CLIFormType).waterwaste).toFixed(2)
                  : +(a.document as CLIFormType).waterwasterec / +(a.document as CLIFormType).waterwaste}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Loại nơi xử lý nước thải</th>
              <td>{(+(a.document as CLIFormType).waterwastedes + " ").replace(/,/g, ", ")}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Pkhả năng tái chế sản phẩm
                <RiIcons.RiRecycleFill />
              </th>
              <th>Sản phẩm được sản xuất có thể tái chế hoặc tái sử dụng được hay không</th>
              <td>{+(a.document as CLIFormType).productrec}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Bao bì và ghi nhãn xanh
                <BiIcons.BiPackage />
              </th>
              <th>Sản phẩm có bao bì và nhãn mác thân thiện với môi trường hay không</th>
              <td>{+(a.document as CLIFormType).ecolabel}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </th>
    </tr>
  ));

export default function LCIAssess() {
  const { LCIs } = useWeb3Store((state) => state);

  const [date, setDate] = useState<string | null>(null);
  const [process, setProcess] = useState<string | null>(null);
  const [product, setProduct] = useState<string | null>(null);

  const params = useSearchParams();
  const dateState = params.get("date");
  const processParams = params.get("process");
  const productParams = params.get("productId");

  useEffect(() => {
    setDate(dateState);
    setProcess(processParams);
    setProduct(productParams);
  }, [dateState, productParams, processParams]);

  const lci =
    process != null && product != null
      ? LCIs?.filter((obj) => obj.process?.id == process)
          .filter((obj) => (obj.document as CLIFormType).product.id == product)
          .map((obj) => obj) ?? []
      : LCIs?.filter((obj) => obj.date.includes(date ?? "")).map((obj) => obj);

  return (
    <>
      <div className="margin">
        <table className="assess-table">
          <tbody>
            <AssessList assessments={lci ?? []} />
          </tbody>
        </table>
        {lci?.length == 0 && <h2> Không tìm thấy dữ liệu</h2>}
      </div>
    </>
  );
}
