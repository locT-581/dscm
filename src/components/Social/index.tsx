import SocialType from "@/types/social";
import Link from "next/link";
import InterestsIcon from "@mui/icons-material/Interests";
import { usePathname } from "next/navigation";

const AssessList = ({ assessments }: { assessments: SocialType[] }) => {
  const pathname = usePathname();
  return assessments
    .sort((a, b) => Number(b.id) - Number(a.id))
    .map((a) => (
      <tr key={a.id}>
        <td className="p-name">
          <Link href={`${pathname}/social?date=${a.date}`} style={{ textDecoration: "none", color: "black" }}>
            <InterestsIcon style={{ fontSize: "30px", cursor: "pointer" }} />
          </Link>
        </td>
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
        <td className="p-comp">{a.month + " " + a.year}</td>
        <td className="p-comp">{a.date}</td>
      </tr>
    ));
};

const Social = ({ Smerge }: { Smerge: SocialType[] }) => {
  return (
    <>
      <h3 className="table-title">Social Sustainability Assessments</h3>
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
          <AssessList assessments={Smerge} />
        </tbody>
      </table>
    </>
  );
};

export default Social;
