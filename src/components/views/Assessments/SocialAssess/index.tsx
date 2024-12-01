"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as GrIcons from "react-icons/gr";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi";
import * as IoIcons from "react-icons/io";
import { useWeb3Store } from "@/stores/storeProvider";
import Assessment from "@/types/assessment";
import { SocialFormType } from "@/types/document";

const SocialList = ({ assessments }: { assessments: Assessment[] }) =>
  assessments.map((a) => (
    <tr key={a.id}>
      <td>
        <table className="LCI-table">
          <caption>
            Đánh giá tính bền vững xã hội cho
            {(a.document as SocialFormType)?.suppliers?.name}
          </caption>
          <caption className="captwo">{"Kỳ tháng " + a.month + " năm " + a.year}</caption>
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
              <th rowSpan={17} className="category">
                Thực hành lao động
              </th>
              <th rowSpan={2}>
                Đào tạo và phát triển nhân viên <MdIcons.MdOutlineSchool />
              </th>
              <th>Số giờ đào tạo trung bình mỗi nhân viên mỗi năm</th>
              <td>
                {(+(a.document as SocialFormType).trainh / +(a.document as SocialFormType).trainemp) % 1 !== 0
                  ? (+(a.document as SocialFormType).trainh / +(a.document as SocialFormType).trainemp).toFixed(1)
                  : +(a.document as SocialFormType).trainh / +(a.document as SocialFormType).trainemp}
              </td>
              <td>hours/ year</td>
            </tr>
            <tr>
              <th>Tỷ lệ nhân viên được đào tạo mỗi năm</th>
              <td>
                {((+(a.document as SocialFormType).trainemp * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).trainemp * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).trainemp * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Doanh thu nhân viên
                <GrIcons.GrPowerCycle />
              </th>
              <th>Doanh thu nhân viên mỗi năm</th>
              <td>
                {(+(a.document as SocialFormType).resemp / +(a.document as SocialFormType).hiredemp) % 1 !== 0
                  ? (+(a.document as SocialFormType).resemp / +(a.document as SocialFormType).hiredemp).toFixed(1)
                  : +(a.document as SocialFormType).resemp / +(a.document as SocialFormType).hiredemp}
              </td>
              <td>doanh thu/năm</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Nhân viên toàn thời gian và bán thời gian
                <GrIcons.GrUserWorker />
              </th>
              <th>Tỷ lệ nhân viên toàn thời gian</th>
              <td>
                {((+(a.document as SocialFormType).fullemp * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).fullemp * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).fullemp * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Tỷ lệ nhân viên bán thời gian</th>
              <td>
                {(((+(a.document as SocialFormType).emp - +(a.document as SocialFormType).fullemp) * 100) /
                  +(a.document as SocialFormType).emp) %
                  1 !==
                0
                  ? (
                      ((+(a.document as SocialFormType).emp - +(a.document as SocialFormType).fullemp) * 100) /
                      +(a.document as SocialFormType).emp
                    ).toFixed(1)
                  : ((+(a.document as SocialFormType).emp - +(a.document as SocialFormType).fullemp) * 100) /
                    +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Giờ làm việc
                <AiIcons.AiOutlineClockCircle />
              </th>
              <th>Số giờ làm việc theo hợp đồng trung bình hàng tuần của mỗi nhân viên mỗi tháng</th>
              <td>{+(a.document as SocialFormType).workh}</td>
              <td>giờ/tháng</td>
            </tr>
            <tr>
              <th>Average weekly overtime hours per employee per month</th>
              <td>{+(a.document as SocialFormType).overtimeh}</td>
              <td>giờ/tháng</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Lương công bằng
                <MdIcons.MdAttachMoney />
              </th>
              <th>Tỷ lệ lương của người lao động trên mức lương tối thiểu</th>
              <td>
                {((+(a.document as SocialFormType).empwage * 100) / 4250) % 1 !== 0
                  ? ((+(a.document as SocialFormType).empwage * 100) / 4250).toFixed(1)
                  : (+(a.document as SocialFormType).empwage * 100) / 4250}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Tỷ lệ nhân viên toàn thời gian có thu nhập dưới mức lương tối thiểu</th>
              <td>
                {((+(a.document as SocialFormType).minwage * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).minwage * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).minwage * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Phúc lợi và an ninh xã hội
                <MdIcons.MdSecurity />
              </th>
              <th>
                Tỷ lệ người lao động được hưởng bảo hiểm y tế, nghỉ thai sản, thất nghiệp, khuyết tật và bảo hiểm tàn
                tật, cung cấp hưu trí
              </th>
              <td>
                {((+(a.document as SocialFormType).insurance * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).insurance * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).insurance * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={3}>
                Đa dạng giới tính
                <BsIcons.BsGenderAmbiguous />
              </th>
              <th>Mức lương đa dạng theo giới tính</th>
              <td>
                {(+(a.document as SocialFormType).femwage / +(a.document as SocialFormType).malwage) % 1 !== 0
                  ? (+(a.document as SocialFormType).femwage / +(a.document as SocialFormType).malwage).toFixed(1)
                  : +(a.document as SocialFormType).femwage / +(a.document as SocialFormType).malwage}
              </td>
              <td>lương nữ/lương nam</td>
            </tr>
            <tr>
              <th>Đa dạng giới tính của nhân viên</th>
              <td>
                {(+(a.document as SocialFormType).fem / +(a.document as SocialFormType).male) % 1 !== 0
                  ? (+(a.document as SocialFormType).fem / +(a.document as SocialFormType).male).toFixed(1)
                  : +(a.document as SocialFormType).fem / +(a.document as SocialFormType).male}
              </td>
              <td>nhân viên nữ/nhân viên nam</td>
            </tr>
            <tr>
              <th>Tỷ lệ lao động nữ trong HĐQT và các vị trí quản lý</th>
              <td>
                {((+(a.document as SocialFormType).femboard * 100) / +(a.document as SocialFormType).empboard) % 1 !== 0
                  ? (
                      (+(a.document as SocialFormType).femboard * 100) /
                      +(a.document as SocialFormType).empboard
                    ).toFixed(1)
                  : (+(a.document as SocialFormType).femboard * 100) / +(a.document as SocialFormType).empboard}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={3}>
                Sự đa dạng trong lực lượng lao động
                <MdIcons.MdGroups />
              </th>
              <th>Tỷ lệ nhân viên khuyết tật</th>
              <td>
                {((+(a.document as SocialFormType).disabled * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).disabled * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).disabled * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Tỷ lệ lao động thiểu số</th>
              <td>
                {((+(a.document as SocialFormType).minority * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).minority * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).minority * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Tỷ lệ lao động có độ tuổi trên 65</th>
              <td>
                {((+(a.document as SocialFormType).older * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).older * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).older * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Chuẩn mực xã hội <GrIcons.GrCertificate />
              </th>
              <th>Sự tồn tại của các chứng nhận bên ngoài về tiêu chuẩn xã hội</th>
              <td>{(+(a.document as SocialFormType).socialstand + " ").replace(/,/g, ", ")}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={6} className="category">
                Sức khỏe và An toàn lao động
              </th>
              <th rowSpan={5}>
                Sức khỏe và an toàn nghề nghiệp
                <GiIcons.GiHealthNormal />
              </th>
              <th>Tuân thủ an toàn và sức khỏe nghề nghiệp</th>
              <td>{+(a.document as SocialFormType).ilo}</td>
              <td></td>
            </tr>
            <tr>
              <th>Có thiết bị chữa cháy và lối thoát hiểm</th>
              <td>{+(a.document as SocialFormType).fire}</td>
              <td></td>
            </tr>
            <tr>
              <th>Cung cấp hỗ trợ y tế và sơ cứu</th>
              <td>{+(a.document as SocialFormType).medical}</td>
              <td></td>
            </tr>
            <tr>
              <th>Tiếp cận nước uống và vệ sinh</th>
              <td>{+(a.document as SocialFormType).sanitation}</td>
              <td></td>
            </tr>
            <tr>
              <th>Cung cấp đồ bảo hộ</th>
              <td>{+(a.document as SocialFormType).gear}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Tai nạn
                <MdIcons.MdOutlinePersonalInjury />
              </th>
              <th>Tai nạn lao động mỗi năm</th>
              <td>{+(a.document as SocialFormType).workacc}</td>
              <td>tai nạn/năm</td>
            </tr>
            <tr>
              <th rowSpan={7} className="category">
                Nhân Quyền
              </th>
              <th rowSpan={2}>
                Tự do hiệp hội
                <GiIcons.GiThreeFriends />
              </th>
              <th>Sự hiện diện của các công đoàn trong tổ chức</th>
              <td>{+(a.document as SocialFormType).union}</td>
              <td></td>
            </tr>
            <tr>
              <th>Tỷ lệ người lao động tham gia công đoàn</th>
              <td>
                {((+(a.document as SocialFormType).empunion * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).empunion * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).empunion * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Thỏa ước thương lượng tập thể
                <FaIcons.FaRegHandshake />
              </th>
              <th>Tỷ lệ người lao động được thỏa ước lao động tập thể</th>
              <td>
                {((+(a.document as SocialFormType).bargain * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).bargain * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).bargain * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Phân biệt
                <GiIcons.GiInjustice />
              </th>
              <th>Sự cố phân biệt đối xử mỗi năm</th>
              <td>{+(a.document as SocialFormType).discri}</td>
              <td>Sự cố</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Trẻ em và lao động cưỡng bức
                <GiIcons.GiCrossedChains />
              </th>
              <th>Lao động trẻ em</th>
              <td>{+(a.document as SocialFormType).child}</td>
              <td>Người lao động</td>
            </tr>
            <tr>
              <th>Lao động cưỡng bức</th>
              <td>{+(a.document as SocialFormType).forced}</td>
              <td>Người lao động</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Quyền của người bản địa
                <FaIcons.FaFeatherAlt />
              </th>
              <th>Vi phạm quyền lợi của người bản địa mỗi năm</th>
              <td>{+(a.document as SocialFormType).indig}</td>
              <td>sự cố/năm</td>
            </tr>
            <tr>
              <th rowSpan={6} className="category">
                Xã hội
              </th>
              <th rowSpan={1}>
                Bản địa hóa công việc
                <AiIcons.AiOutlineHome />
                <GrIcons.GrUserWorker />
              </th>
              <th>Tỷ lệ lao động địa phương</th>
              <td>
                {((+(a.document as SocialFormType).localemp * 100) / +(a.document as SocialFormType).emp) % 1 !== 0
                  ? ((+(a.document as SocialFormType).localemp * 100) / +(a.document as SocialFormType).emp).toFixed(1)
                  : (+(a.document as SocialFormType).localemp * 100) / +(a.document as SocialFormType).emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Bản địa hóa nguồn
                <AiIcons.AiOutlineHome />
                <FiIcons.FiMapPin />
              </th>
              <th>Tỷ lệ nhà cung cấp địa phương</th>
              <td>
                {((+(a.document as SocialFormType).localsup * 100) / +(a.document as SocialFormType).suppliers) % 1 !==
                0
                  ? (
                      (+(a.document as SocialFormType).localsup * 100) /
                      +(a.document as SocialFormType).suppliers
                    ).toFixed(1)
                  : (+(a.document as SocialFormType).localsup * 100) / +(a.document as SocialFormType).suppliers}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Phát triển cộng đồng
                <FaIcons.FaSchool />
                <IoIcons.IoIosConstruct />
              </th>
              <th>Tỷ lệ quyên góp từ thiện trên thu nhập mỗi năm</th>
              <td>
                {((+(a.document as SocialFormType).donation * 100) / +(a.document as SocialFormType).earning) % 1 !== 0
                  ? (
                      (+(a.document as SocialFormType).donation * 100) /
                      +(a.document as SocialFormType).earning
                    ).toFixed(1)
                  : (+(a.document as SocialFormType).donation * 100) / +(a.document as SocialFormType).earning}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Chống tham nhũng
                <GiIcons.GiPrisoner />
              </th>
              <th>Số vụ tham nhũng mỗi năm</th>
              <td>{+(a.document as SocialFormType).corrup}</td>
              <td>incidents/ year</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Hành vi phản cạnh tranh
                <GiIcons.GiPodiumWinner />
              </th>
              <th>
                Các hành động pháp lý đang chờ xử lý hoặc đã hoàn thành liên quan đến hành vi phản cạnh tranh mỗi năm
              </th>
              <td>{+(a.document as SocialFormType).anticomp}</td>
              <td>hành động pháp lý/năm</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Đánh giá tính bền vững của nhà cung cấp
                <MdIcons.MdOutlineAssessment />
              </th>
              <th>Tỷ lệ nhà cung cấp được giám sát về tính bền vững xã hội mỗi năm</th>
              <td>
                {((+(a.document as SocialFormType).socialsus * 100) / +(a.document as SocialFormType).suppliers) % 1 !==
                0
                  ? (
                      (+(a.document as SocialFormType).socialsus * 100) /
                      +(a.document as SocialFormType).suppliers
                    ).toFixed(1)
                  : (+(a.document as SocialFormType).socialsus * 100) / +(a.document as SocialFormType).suppliers}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={5} className="category">
                Trách nhiệm của khách hàng
              </th>
              <th rowSpan={2}>
                Sức khỏe và sự an toàn của khách hàng
                <MdIcons.MdHealthAndSafety />
              </th>
              <th>Tỷ lệ sản phẩm và dịch vụ được đánh giá tác động đến sức khỏe và an toàn</th>
              <td>
                {((+(a.document as SocialFormType).productassess * 100) / +(a.document as SocialFormType).product) %
                  1 !==
                0
                  ? (
                      (+(a.document as SocialFormType).productassess * 100) /
                      +(a.document as SocialFormType).product
                    ).toFixed(1)
                  : (+(a.document as SocialFormType).productassess * 100) / +(a.document as SocialFormType).product}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Sự cố về sức khỏe và an toàn liên quan đến sản phẩm và dịch vụ mỗi năm</th>
              <td>{+(a.document as SocialFormType).productincident}</td>
              <td>sự cố/năm</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Tôn trọng quyền riêng tư
                <MdIcons.MdOutlinePrivacyTip />
              </th>
              <th>Khiếu nại về quyền riêng tư của khách hàng mỗi năm</th>
              <td>{+(a.document as SocialFormType).privacy}</td>
              <td>khiếu nại/năm</td>
            </tr>
            <tr>
              <th>Rò rỉ, trộm cắp hoặc mất dữ liệu khách hàng mỗi năm</th>
              <td>{+(a.document as SocialFormType).leaks}</td>
              <td>rò rỉ, trộm cắp hoặc mất mát/năm</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Sự hài lòng của khách hàng
                <AiIcons.AiOutlineLike />
              </th>
              <th>Khiếu nại của khách hàng mỗi tháng</th>
              <td>{+(a.document as SocialFormType).cuscomp}</td>
              <td>khiếu nại/tháng</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  ));

const SocialAssess = () => {
  const { socials } = useWeb3Store((state) => state);
  const searchParams = useSearchParams();
  const dateState = searchParams.get("date");

  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(dateState);
  }, [dateState]);

  // const Smerge = socials.map((t1) => ({ ...t1, ...socialform.find((t2) => t2.id === t1.id) }));
  // const social = Smerge.filter((obj) => obj.date.includes(date));
  const social = socials?.filter((obj) => obj.date.includes(date ?? ""));

  return (
    <>
      <div className="ml-[10%]">
        <table className="assess-table">
          <tbody>
            <SocialList assessments={socials ?? []} />
            {!!!social && <h2> Không có thông tin</h2>}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SocialAssess;
