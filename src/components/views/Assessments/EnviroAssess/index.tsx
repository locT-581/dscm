"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import Assessment from "@/types/assessment";
import { EnviroFormType } from "@/types/document";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import * as GiIcons from "react-icons/gi";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as GrIcons from "react-icons/gr";
import * as FaIcons from "react-icons/fa";

export const AssessList = ({
  assessments,
  energy,
  material,
}: {
  assessments: Assessment[];
  energy: string[];
  material: string[];
}) =>
  assessments.map((a) => (
    <tr key={a.id}>
      <table className="LCI-table">
        <caption>
          Đánh giá bền vững môi trường cho
          {" " + a.account?.name}
        </caption>
        <caption className="captwo">{"Cho kỳ tháng " + a.month + " năm " + a.year}</caption>
        <thead>
          <th>Thể loại</th>
          <th>Các chỉ số</th>
          <th>Số đo</th>
          <th>Giá trị</th>
          <th>Đơn vị</th>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={16} className="category">
              Tài nguyên thiên nhiên
            </th>
            <th rowSpan={1}>
              Tiêu thụ năng lượng <GiIcons.GiElectric />
            </th>
            <th>Lượng năng lượng sử dụng mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).energy}</td>
            <td>kWh/tháng</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Hiệu quả năng lượng <MdIcons.MdPowerOff />
            </th>
            <th>Lượng năng lượng giảm mỗi tháng</th>
            <td>
              {+(a.document as EnviroFormType).id > 1 &&
              +energy[+(a.document as EnviroFormType).id - 2] > 0 &&
              +energy[+(a.document as EnviroFormType).id - 1] > 0
                ? +energy[+(a.document as EnviroFormType).id - 2] - +energy[+(a.document as EnviroFormType).id - 1]
                : null}
            </td>
            <td>kWh/tháng</td>
          </tr>
          <tr>
            <th>Phần trăm năng lượng giảm mỗi tháng</th>
            <td>
              {+(a.document as EnviroFormType).id > 1 &&
              +energy[+(a.document as EnviroFormType).id - 2] > 0 &&
              +energy[+(a.document as EnviroFormType).id - 1] > 0
                ? ((+energy[+(a.document as EnviroFormType).id - 2] - +energy[+(a.document as EnviroFormType).id - 1]) *
                    100) /
                  +energy[+(a.document as EnviroFormType).id - 2]
                : 0 % 1 !== 0
                ? (+(a.document as EnviroFormType).id > 1 &&
                  +energy[+(a.document as EnviroFormType).id - 2] > 0 &&
                  +energy[+(a.document as EnviroFormType).id - 1] > 0
                    ? ((+energy[+(a.document as EnviroFormType).id - 2] -
                        +energy[+(a.document as EnviroFormType).id - 1]) *
                        100) /
                      +energy[+(a.document as EnviroFormType).id - 2]
                    : 0
                  ).toFixed(1)
                : +(a.document as EnviroFormType).id > 1 &&
                  +energy[+(a.document as EnviroFormType).id - 2] > 0 &&
                  +energy[+(a.document as EnviroFormType).id - 1] > 0
                ? ((+energy[+(a.document as EnviroFormType).id - 2] - +energy[+(a.document as EnviroFormType).id - 1]) *
                    100) /
                  +energy[+(a.document as EnviroFormType).id - 2]
                : 0}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Năng lượng tái tạo <GiIcons.GiWindTurbine />
            </th>
            <th>Lượng năng lượng tái tạo sử dụng mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).renewenergy}</td>
            <td>kWh/tháng</td>
          </tr>
          <tr>
            <th>Tỷ lệ năng lượng tái tạo được sử dụng mỗi tháng</th>
            <td>
              {((+(a.document as EnviroFormType).renewenergy * 100) / +(a.document as EnviroFormType).energy) % 1 !== 0
                ? (
                    (+(a.document as EnviroFormType).renewenergy * 100) /
                    +(a.document as EnviroFormType).energy
                  ).toFixed(1)
                : (+(a.document as EnviroFormType).renewenergy * 100) / +(a.document as EnviroFormType).energy}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Tiêu thụ nước <GiIcons.GiWaterDrop />
            </th>
            <th>Lượng nước sử dụng mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).water}</td>
            <td>m3/tháng</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Nước tái chế hoặc tái sử dụng <GiIcons.GiWaterRecycling />
            </th>
            <th>Lượng nước tái chế hoặc tái sử dụng sử dụng mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).waterrec}</td>
            <td>m3/tháng</td>
          </tr>
          <tr>
            <th>Tỷ lệ nước tái chế hoặc tái sử dụng mỗi tháng</th>
            <td>
              {((+(a.document as EnviroFormType).waterrec * 100) / +(a.document as EnviroFormType).water) % 1 !== 0
                ? ((+(a.document as EnviroFormType).waterrec * 100) / +(a.document as EnviroFormType).water).toFixed(1)
                : (+(a.document as EnviroFormType).waterrec * 100) / +(a.document as EnviroFormType).water}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Tiêu thụ vật liệu <AiIcons.AiFillGold />
              <AiIcons.AiFillGold />
            </th>
            <th>Lượng vật liệu khác ngoài nước sử dụng trong tháng</th>
            <td>{+(a.document as EnviroFormType).material}</td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Hiệu quả vật liệu <AiIcons.AiFillGold />
            </th>
            <th>Số lượng vật liệu giảm mỗi tháng</th>
            <td>
              {+(a.document as EnviroFormType).id > 1 &&
              +material[+(a.document as EnviroFormType).id - 2] > 0 &&
              +material[+(a.document as EnviroFormType).id - 1] > 0
                ? +material[+(a.document as EnviroFormType).id - 2] - +material[+(a.document as EnviroFormType).id - 1]
                : null}
            </td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th>Tỷ lệ vật liệu giảm mỗi tháng </th>
            <td>
              {((+(a.document as EnviroFormType).id > 1 &&
              +material[+(a.document as EnviroFormType).id - 2] > 0 &&
              +material[+(a.document as EnviroFormType).id - 1] > 0
                ? ((+material[+(a.document as EnviroFormType).id - 2] -
                    +material[+(a.document as EnviroFormType).id - 1]) *
                    100) /
                  +material[+(a.document as EnviroFormType).id - 2]
                : null) ?? 0) %
                1 !==
              0
                ? (
                    (+(a.document as EnviroFormType).id > 1 &&
                    +material[+(a.document as EnviroFormType).id - 2] > 0 &&
                    +material[+(a.document as EnviroFormType).id - 1] > 0
                      ? ((+material[+(a.document as EnviroFormType).id - 2] -
                          +material[+(a.document as EnviroFormType).id - 1]) *
                          100) /
                        +material[+(a.document as EnviroFormType).id - 2]
                      : null) ?? 0
                  ).toFixed(1)
                : +(a.document as EnviroFormType).id > 1 &&
                  +material[+(a.document as EnviroFormType).id - 2] > 0 &&
                  +material[+(a.document as EnviroFormType).id - 1] > 0
                ? ((+material[+(a.document as EnviroFormType).id - 2] -
                    +material[+(a.document as EnviroFormType).id - 1]) *
                    100) /
                  +material[+(a.document as EnviroFormType).id - 2]
                : null}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Vật liệu tái chế hoặc tái sử dụng
              <BiIcons.BiRecycle />
            </th>
            <th>Lượng vật liệu tái chế hoặc tái sử dụng mỗi tháng </th>
            <td>{+(a.document as EnviroFormType).materialrec}</td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th>Tỷ lệ vật liệu tái chế hoặc tái sử dụng mỗi tháng </th>
            <td>
              {((+(a.document as EnviroFormType).materialrec * 100) / +(a.document as EnviroFormType).material) % 1 !==
              0
                ? (
                    (+(a.document as EnviroFormType).materialrec * 100) /
                    +(a.document as EnviroFormType).material
                  ).toFixed(1)
                : (+(a.document as EnviroFormType).materialrec * 100) / +(a.document as EnviroFormType).material}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Sử dụng đất
              <GiIcons.GiFactory />
            </th>
            <th>Số lượng đất sở hữu, cho thuê, quản lý để sử dụng cho hoạt động sản xuất, khai thác</th>
            <td>{+(a.document as EnviroFormType).land}</td>
            <td>m2</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Sự đa dạng sinh học
              <GiIcons.GiCircleForest />
            </th>
            <th>Sự tồn tại của chính sách đa dạng sinh học</th>
            <td>{+(a.document as EnviroFormType).bio}</td>
            <td></td>
          </tr>
          <tr>
            <th>
              Sự tồn tại của các hoạt động và hoạt động trên các khu vực được bảo vệ và nhạy cảm (ví dụ: khu vực được
              bảo vệ của IUCN loại 1–4, di sản thế giới và khu dự trữ sinh quyển)
            </th>
            <td>{+(a.document as EnviroFormType).sensitive}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={18} className="category">
              Quản lý ô nhiễm và chất thải
            </th>
            <th rowSpan={1}>
              Phát thải khí nhà kính <GiIcons.GiGreenhouse />
            </th>
            <th>Lượng phát thải khí nhà kính mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).ghg}</td>
            <td>tấn CO2e</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Ô nhiễm không khí
              <GiIcons.GiGasMask />
            </th>
            <th>Lượng khí thải phát sinh mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).air}</td>
            <td>Tấn</td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Ô nhiễm nước
              <GiIcons.GiChemicalDrop />
            </th>
            <th>Lượng nước ô nhiễm phát sinh mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).waterpol}</td>
            <td>m3/tháng</td>
          </tr>
          <tr>
            <th>Loại ô nhiễm nước </th>
            <td>{(+(a.document as EnviroFormType).waterpoltype + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={2}>
              Ô nhiễm đất
              <GiIcons.GiChemicalDrop />
            </th>
            <th>Lượng ô nhiễm đất phát sinh mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).landpol}</td>
            <td>m2</td>
          </tr>
          <tr>
            <th>Loại ô nhiễm đất</th>
            <td>{(+(a.document as EnviroFormType).landpoltype + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Sử dụng vật liệu nguy hiểm
              <GiIcons.GiPoisonBottle />
            </th>
            <th>Lượng vật liệu nguy hiểm được sử dụng mỗi tháng </th>
            <td>{+(a.document as EnviroFormType).hazmat}</td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Chất thải nguy hại
              <GiIcons.GiNuclearWaste />
            </th>
            <th>Lượng chất thải nguy hại phát sinh mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).hazwaste}</td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th rowSpan={4}>
              Chất thải rắn
              <GiIcons.GiTrashCan />
            </th>
            <th>Lượng chất thải rắn phát sinh mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).solidwaste}</td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th>Lượng chất thải rắn được tái chế hoặc tái sử dụng mỗi tháng</th>
            <td>{+(a.document as EnviroFormType).solidwasterec}</td>
            <td>kg/tháng</td>
          </tr>
          <tr>
            <th>Tỷ lệ chất thải rắn được tái chế hoặc tái sử dụng mỗi tháng</th>
            <td>
              {((+(a.document as EnviroFormType).solidwasterec * 100) / +(a.document as EnviroFormType).solidwaste) %
                1 !==
              0
                ? (
                    (+(a.document as EnviroFormType).solidwasterec * 100) /
                    +(a.document as EnviroFormType).solidwaste
                  ).toFixed(1)
                : (+(a.document as EnviroFormType).solidwasterec * 100) / +(a.document as EnviroFormType).solidwaste}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th>Loại điểm đến chất thải rắn </th>
            <td>{(+(a.document as EnviroFormType).solidwastedes + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={4}>
              Nước thải
              <GiIcons.GiTrashCan />
            </th>
            <th>Lượng nước thải phát sinh mỗi tháng </th>
            <td>{+(a.document as EnviroFormType).waterwaste}</td>
            <td>m3/tháng</td>
          </tr>
          <tr>
            <th>Lượng nước thải được tái chế hoặc tái sử dụng mỗi tháng </th>
            <td>{+(a.document as EnviroFormType).waterwasterec}</td>
            <td>m3/tháng</td>
          </tr>
          <tr>
            <th>Tỷ lệ nước thải được tái chế hoặc tái sử dụng mỗi tháng </th>
            <td>
              {((+(a.document as EnviroFormType).waterwasterec * 100) / +(a.document as EnviroFormType).waterwaste) %
                1 !==
              0
                ? (
                    (+(a.document as EnviroFormType).waterwasterec * 100) /
                    +(a.document as EnviroFormType).waterwaste
                  ).toFixed(1)
                : (+(a.document as EnviroFormType).waterwasterec * 100) / +(a.document as EnviroFormType).waterwaste}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th>Loại nơi xử lý nước thải</th>
            <td>{(+(a.document as EnviroFormType).waterwastedes + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Khả năng tái chế sản phẩm
              <RiIcons.RiRecycleFill />
            </th>
            <th>Tỷ lệ sản phẩm có thể tái chế hoặc tái sử dụng được sản xuất mỗi tháng</th>
            <td>
              {((+(a.document as EnviroFormType).productrec * 100) / +(a.document as EnviroFormType).products) % 1 !== 0
                ? (
                    (+(a.document as EnviroFormType).productrec * 100) /
                    +(a.document as EnviroFormType).products
                  ).toFixed(1)
                : (+(a.document as EnviroFormType).productrec * 100) / +(a.document as EnviroFormType).products}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Bao bì và ghi nhãn xanh
              <BiIcons.BiPackage />
            </th>
            <th>Tỷ lệ sản phẩm được đóng gói và dán nhãn thân thiện với môi trường mỗi tháng</th>
            <td>
              {((+(a.document as EnviroFormType).ecolabel * 100) / +(a.document as EnviroFormType).products) % 1 !== 0
                ? ((+(a.document as EnviroFormType).ecolabel * 100) / +(a.document as EnviroFormType).products).toFixed(
                    1
                  )
                : (+(a.document as EnviroFormType).ecolabel * 100) / +(a.document as EnviroFormType).products}
            </td>
            <td>%</td>
          </tr>
          <tr>
            <th rowSpan={3} className="category">
              Quản lý hoạt động và đo lường hiệu suất
            </th>
            <th rowSpan={1}>
              Hệ thống quản lý môi trường
              <GrIcons.GrCertificate />
            </th>
            <th>Sự tồn tại của các chứng nhận bên ngoài về tiêu chuẩn môi trường</th>
            <td>{+(a.document as EnviroFormType).envirostand}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Công nghệ sạch hơn
              <FaIcons.FaSeedling />
            </th>
            <th>Loại công nghệ sạch được sử dụng</th>
            <td>{(+(a.document as EnviroFormType).clean + " ").replace(/,/g, ", ")}</td>
            <td></td>
          </tr>
          <tr>
            <th rowSpan={1}>
              Đánh giá tính bền vững của nhà cung cấp
              <MdIcons.MdOutlineAssessment />
            </th>
            <th>Tỷ lệ nhà cung cấp được giám sát về tính bền vững môi trường mỗi năm</th>
            <td>
              {((+(a.document as EnviroFormType).envirosus * 100) / +(a.document as EnviroFormType).suppliers) % 1 !== 0
                ? (
                    (+(a.document as EnviroFormType).envirosus * 100) /
                    +(a.document as EnviroFormType).suppliers
                  ).toFixed(1)
                : (+(a.document as EnviroFormType).envirosus * 100) / +(a.document as EnviroFormType).suppliers}
            </td>
            <td>%</td>
          </tr>
        </tbody>
      </table>
    </tr>
  ));

export default function EnviroAssess() {
  const { enviros } = useWeb3Store((state) => state);

  useEffect(() => {
    if (!!enviros) {
      enviros.map((enviro) => {
        setMaterial((material) => [...material, (enviro.document as EnviroFormType).material]);
      });
    }
  }, [enviros]);

  const [material, setMaterial] = useState<string[]>([]);

  const params = useSearchParams();
  const date = params.get("date");
  const account = params.get("account");

  const env = enviros?.filter((obj) => obj.date.includes(date ?? "")).map((obj) => obj);

  const energy = enviros
    ?.filter((obj) => obj.account.id.includes(account ?? ""))
    .map((obj) => (obj.document as EnviroFormType).energy);

  return (
    <>
      <div className="margin">
        <table className="assess-table">
          <AssessList assessments={env ?? []} energy={energy ?? []} material={material} />
          {!!!env && <h2>Không tìm thấy đánh giá nào</h2>}
        </table>
      </div>
    </>
  );
}
