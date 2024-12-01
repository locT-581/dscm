import Link from "next/link";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EnviroType from "@/types/enviro";

interface IEnviroType {
  assessments: EnviroType[];
}

const AssessList = ({ assessments }: IEnviroType) =>
  assessments
    .sort((a, b) => Number(b.id) - Number(a.id))
    .map((a) => (
      <tr key={a.id}>
        <td className="p-name">
          <Link href={`enviro?date=${a.date}&account=${a.account}`} style={{ textDecoration: "none", color: "black" }}>
            <AssignmentIcon style={{ fontSize: "30px", cursor: "pointer" }} />
          </Link>
        </td>
        <td className="p-comp">
          {a.account === "0xf00EbF44706A84d73698D51390a6801215fF338c"
            ? "Supplier#1"
            : a.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
            ? "Supplier#2"
            : a.account === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619"
            ? "Supplier#3"
            : a.account === "0x5e66410a4C6443d035E05162C9bb59708cB0596F"
            ? "Supplier#4"
            : a.account === "0x3421668462324bFB48EA07D0B12243091CD09759"
            ? "Company"
            : a.account === "0xf5D0a9A8cCC008Bc72c6e708F5A7871d094B7E11"
            ? "Customer"
            : a.account}
        </td>
        <td className="p-comp">{a.month + " " + a.year}</td>
        <td className="p-comp">{a.date}</td>
      </tr>
    ));

const Enviro = ({ Emerge }: { Emerge: EnviroType[] }) => {
  return (
    <>
      <h3 className="table-title">Environmental Sustainability Assessments</h3>
      <table className="assess-table">
        <thead>
          <tr>
            <th className="assess">Assessment</th>
            <th className="user">User</th>
            <th className="period">Period (Month Year)</th>
            <th>Date Time Added</th>
          </tr>
        </thead>
        <tbody>
          <AssessList assessments={Emerge} />
        </tbody>
      </table>
    </>
  );
};

export default Enviro;
