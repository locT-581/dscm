import LCIType from "@/types/LCI";
import Link from "next/link";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import { usePathname } from "next/navigation";

const AssessList = ({ assessments }: { assessments: LCIType[] }) => {
  const pathname = usePathname();
  return assessments
    .sort((a, b) => Number(b.id) - Number(a.id))
    .map((a, i) => (
      <tr key={i}>
        <td className="p-name">
          <Link href={`${pathname}/lci?date=${a.date}`} style={{ textDecoration: "none", color: "black" }}>
            <Diversity2Icon style={{ fontSize: "30px", cursor: "pointer" }} />
          </Link>
        </td>
        <td className="p-comp">{a.product?.name}</td>
        <td className="p-comp">{a.process}</td>
        <td className="p-comp">{a.month + " " + a.year}</td>
        <td className="p-comp">
          {a.account === "0xf00EbF44706A84d73698D51390a6801215fF338c"
            ? "Supplier#1"
            : a.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
            ? "Supplier#2"
            : a.account === "0x3421668462324bFB48EA07D0B12243091CD09759"
            ? "Company"
            : a.account === "0xf5D0a9A8cCC008Bc72c6e708F5A7871d094B7E11"
            ? "Customer"
            : a.account}
        </td>
        <td className="p-comp">{a.date}</td>
      </tr>
    ));
};

const LCIIndicators = ({ assessments }: { assessments: LCIType[] }) => {
  return (
    <>
      <h3 className="table-title">Life Cycle Inventories</h3>
      <table className="assess-table">
        <thead>
          <tr>
            <th className="LCI-assess">Assessment</th>
            <th className="LCI-product">Product</th>
            <th>Process</th>
            <th className="LCI-period">Period (Month Year)</th>
            <th>User</th>
            <th>Date Time Added</th>
          </tr>
        </thead>
        <tbody>
          <AssessList assessments={assessments} />
        </tbody>
      </table>
    </>
  );
};

export default LCIIndicators;
