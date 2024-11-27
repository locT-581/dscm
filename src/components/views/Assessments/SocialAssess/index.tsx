"use client";

import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import Sidebar from "@/components/Sidebar";
import { useSearchParams } from "next/navigation";
import { Assessment } from "@/lib/abis";

import Social, { SocialBlockChainType } from "@/types/social";

import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as GrIcons from "react-icons/gr";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi";
import * as IoIcons from "react-icons/io";

const SocialList = ({ assessments }: { assessments: Social[] }) =>
  assessments.map((a) => (
    <tr key={a.id}>
      <td>
        <table className="LCI-table">
          <caption>
            Social Sustainability Assessment for
            {a.account === "0xf00EbF44706A84d73698D51390a6801215fF338c"
              ? " Supplier#1"
              : a.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
              ? " Supplier#2"
              : a.account === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619"
              ? " Supplier#3"
              : a.account === "0x5e66410a4C6443d035E05162C9bb59708cB0596F"
              ? " Supplier#4"
              : a.account === "0x3421668462324bFB48EA07D0B12243091CD09759"
              ? " Company"
              : a.account}
          </caption>
          <caption className="captwo">{"For period " + a.month + " " + a.year}</caption>
          <thead>
            <tr>
              <th>Categories</th>
              <th>Indicators</th>
              <th>Measurements</th>
              <th>Values</th>
              <th>Units</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th rowSpan={17} className="category">
                Labor Practices
              </th>
              <th rowSpan={2}>
                Employee training and development <MdIcons.MdOutlineSchool />
              </th>
              <th>Average training hours per employee per year</th>
              <td>
                {(+a.document.trainh / +a.document.trainemp) % 1 !== 0
                  ? (+a.document.trainh / +a.document.trainemp).toFixed(1)
                  : +a.document.trainh / +a.document.trainemp}
              </td>
              <td>hours/ year</td>
            </tr>
            <tr>
              <th>Percentage of employees trained per year</th>
              <td>
                {((+a.document.trainemp * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.trainemp * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.trainemp * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Employee turnover
                <GrIcons.GrPowerCycle />
              </th>
              <th>Employee turnover per year</th>
              <td>
                {(+a.document.resemp / +a.document.hiredemp) % 1 !== 0
                  ? (+a.document.resemp / +a.document.hiredemp).toFixed(1)
                  : +a.document.resemp / +a.document.hiredemp}
              </td>
              <td>turnover/ year</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Full and part-time employees
                <GrIcons.GrUserWorker />
              </th>
              <th>Percentage of full-time employees</th>
              <td>
                {((+a.document.fullemp * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.fullemp * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.fullemp * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Percentage part-time employees</th>
              <td>
                {(((+a.document.emp - +a.document.fullemp) * 100) / +a.document.emp) % 1 !== 0
                  ? (((+a.document.emp - +a.document.fullemp) * 100) / +a.document.emp).toFixed(1)
                  : ((+a.document.emp - +a.document.fullemp) * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Hours of work
                <AiIcons.AiOutlineClockCircle />
              </th>
              <th>Average weekly contractual working hours per employee per month</th>
              <td>{+a.document.workh}</td>
              <td>hours/ month</td>
            </tr>
            <tr>
              <th>Average weekly overtime hours per employee per month</th>
              <td>{+a.document.overtimeh}</td>
              <td>hours/ month</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Fair wage
                <MdIcons.MdAttachMoney />
              </th>
              <th>Percentage of employee wage to the minimum wage</th>
              <td>
                {((+a.document.empwage * 100) / 4250) % 1 !== 0
                  ? ((+a.document.empwage * 100) / 4250).toFixed(1)
                  : (+a.document.empwage * 100) / 4250}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Percentage of full-time employees earning below minimum wage</th>
              <td>
                {((+a.document.minwage * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.minwage * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.minwage * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Social benefits and security
                <MdIcons.MdSecurity />
              </th>
              <th>
                Percentage of employees entitled for health insurance, parental leave, unemployment, disability and
                invalidity coverage, retirement provision
              </th>
              <td>
                {((+a.document.insurance * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.insurance * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.insurance * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={3}>
                Gender diversity
                <BsIcons.BsGenderAmbiguous />
              </th>
              <th>Wage diversity of genders</th>
              <td>
                {(+a.document.femwage / +a.document.malwage) % 1 !== 0
                  ? (+a.document.femwage / +a.document.malwage).toFixed(1)
                  : +a.document.femwage / +a.document.malwage}
              </td>
              <td>female wage/ male wage</td>
            </tr>
            <tr>
              <th>Employee gender diversity</th>
              <td>
                {(+a.document.fem / +a.document.male) % 1 !== 0
                  ? (+a.document.fem / +a.document.male).toFixed(1)
                  : +a.document.fem / +a.document.male}
              </td>
              <td>female employees/ male employees</td>
            </tr>
            <tr>
              <th>Percentage of female employees in board of directors and management positions</th>
              <td>
                {((+a.document.femboard * 100) / +a.document.empboard) % 1 !== 0
                  ? ((+a.document.femboard * 100) / +a.document.empboard).toFixed(1)
                  : (+a.document.femboard * 100) / +a.document.empboard}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={3}>
                Diversity among the workforce
                <MdIcons.MdGroups />
              </th>
              <th>Percentage of disabled employees</th>
              <td>
                {((+a.document.disabled * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.disabled * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.disabled * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Percentage of minority employees</th>
              <td>
                {((+a.document.minority * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.minority * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.minority * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Percentage of employees with age over 65</th>
              <td>
                {((+a.document.older * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.older * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.older * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Social standards <GrIcons.GrCertificate />
              </th>
              <th>Existence of external certifications regarding social standards</th>
              <td>{(+a.document.socialstand + " ").replace(/,/g, ", ")}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={6} className="category">
                Work Health and Safety
              </th>
              <th rowSpan={5}>
                Occupational health and safety
                <GiIcons.GiHealthNormal />
              </th>
              <th>Occupational health and safety compliance</th>
              <td>{+a.document.ilo}</td>
              <td></td>
            </tr>
            <tr>
              <th>Existence of fire-fighting equipment and emergency exits </th>
              <td>{+a.document.fire}</td>
              <td></td>
            </tr>
            <tr>
              <th>Provision of medical assistance and first aid </th>
              <td>{+a.document.medical}</td>
              <td></td>
            </tr>
            <tr>
              <th>Access to drinking water and sanitation</th>
              <td>{+a.document.sanitation}</td>
              <td></td>
            </tr>
            <tr>
              <th>Provision of protective gear</th>
              <td>{+a.document.gear}</td>
              <td></td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Accidents
                <MdIcons.MdOutlinePersonalInjury />
              </th>
              <th>Work accidents per year</th>
              <td>{+a.document.workacc}</td>
              <td>accidents/ year</td>
            </tr>
            <tr>
              <th rowSpan={7} className="category">
                Human Rights
              </th>
              <th rowSpan={2}>
                Freedom of association
                <GiIcons.GiThreeFriends />
              </th>
              <th>Presence of unions within the organization</th>
              <td>{+a.document.union}</td>
              <td></td>
            </tr>
            <tr>
              <th>Percentage of employees joined to labor unions</th>
              <td>
                {((+a.document.empunion * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.empunion * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.empunion * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Collective bargaining agreements
                <FaIcons.FaRegHandshake />
              </th>
              <th>Percentage of employees covered by collective bargaining agreements</th>
              <td>
                {((+a.document.bargain * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.bargain * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.bargain * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Discrimination
                <GiIcons.GiInjustice />
              </th>
              <th>Discrimination incidents per year</th>
              <td>{+a.document.discri}</td>
              <td>incidents</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Child and forced labor
                <GiIcons.GiCrossedChains />
              </th>
              <th>Child labor </th>
              <td>{+a.document.child}</td>
              <td>employees</td>
            </tr>
            <tr>
              <th>Forced labor</th>
              <td>{+a.document.forced}</td>
              <td>employees</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Rights of indigenous people
                <FaIcons.FaFeatherAlt />
              </th>
              <th>Violation of the rights of indigenous people per year</th>
              <td>{+a.document.indig}</td>
              <td>incidents/ year</td>
            </tr>
            <tr>
              <th rowSpan={6} className="category">
                Society
              </th>
              <th rowSpan={1}>
                Job localization
                <AiIcons.AiOutlineHome />
                <GrIcons.GrUserWorker />
              </th>
              <th>Percentage of local employees</th>
              <td>
                {((+a.document.localemp * 100) / +a.document.emp) % 1 !== 0
                  ? ((+a.document.localemp * 100) / +a.document.emp).toFixed(1)
                  : (+a.document.localemp * 100) / +a.document.emp}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Source localization
                <AiIcons.AiOutlineHome />
                <FiIcons.FiMapPin />
              </th>
              <th>Percentage of local suppliers</th>
              <td>
                {((+a.document.localsup * 100) / +a.document.suppliers) % 1 !== 0
                  ? ((+a.document.localsup * 100) / +a.document.suppliers).toFixed(1)
                  : (+a.document.localsup * 100) / +a.document.suppliers}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Community development
                <FaIcons.FaSchool />
                <IoIcons.IoIosConstruct />
              </th>
              <th>Percentage of charity donations to earnings per year</th>
              <td>
                {((+a.document.donation * 100) / +a.document.earning) % 1 !== 0
                  ? ((+a.document.donation * 100) / +a.document.earning).toFixed(1)
                  : (+a.document.donation * 100) / +a.document.earning}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Anti-corruption
                <GiIcons.GiPrisoner />
              </th>
              <th>Corruption incidents per year</th>
              <td>{+a.document.corrup}</td>
              <td>incidents/ year</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Anti-competitive behavior
                <GiIcons.GiPodiumWinner />
              </th>
              <th>Legal actions pending or completed regarding anti-competitive behavior per year</th>
              <td>{+a.document.anticomp}</td>
              <td>legal actions/ year</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Supplier sustainability assessment
                <MdIcons.MdOutlineAssessment />
              </th>
              <th>Percentage of suppliers monitored on social sustainability per year</th>
              <td>
                {((+a.document.socialsus * 100) / +a.document.suppliers) % 1 !== 0
                  ? ((+a.document.socialsus * 100) / +a.document.suppliers).toFixed(1)
                  : (+a.document.socialsus * 100) / +a.document.suppliers}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th rowSpan={5} className="category">
                Customer Responsibility
              </th>
              <th rowSpan={2}>
                Customer health and safety
                <MdIcons.MdHealthAndSafety />
              </th>
              <th>Percentage of products and services for which health and safety impacts are assessed</th>
              <td>
                {((+a.document.productassess * 100) / +a.document.product) % 1 !== 0
                  ? ((+a.document.productassess * 100) / +a.document.product).toFixed(1)
                  : (+a.document.productassess * 100) / +a.document.product}
              </td>
              <td>%</td>
            </tr>
            <tr>
              <th>Health and safety incidents concerning products and services per year</th>
              <td>{+a.document.productincident}</td>
              <td>incidents/ year</td>
            </tr>
            <tr>
              <th rowSpan={2}>
                Respect for privacy
                <MdIcons.MdOutlinePrivacyTip />
              </th>
              <th>Customer privacy complaints per year</th>
              <td>{+a.document.privacy}</td>
              <td>complaints/ year</td>
            </tr>
            <tr>
              <th>Leaks, thefts, or losses of customer data per year</th>
              <td>{+a.document.leaks}</td>
              <td>leaks, thefts, or losses/ year</td>
            </tr>
            <tr>
              <th rowSpan={1}>
                Customer satisfaction
                <AiIcons.AiOutlineLike />
              </th>
              <th>Customer complaints per month</th>
              <td>{+a.document.cuscomp}</td>
              <td>complaints/ month</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  ));

const SocialAssess = () => {
  const web3Instance = useRef<Web3 | null>(null);

  const searchParams = useSearchParams();
  const dateState = searchParams.get("date");

  const [socials, setSocials] = useState<Social[]>([]);
  // const [socialform, setSocialForm] = useState<SocialFormType[]>([]);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        web3Instance.current = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" });
      }
      if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Please use Metamask!");
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3Instance.current) return;

      const networkId = await web3Instance.current.eth.net.getId();
      const networkData = Assessment.networks[networkId as unknown as keyof typeof Assessment.networks];
      if (networkData) {
        //Fetch contract
        const contract = new web3Instance.current.eth.Contract(Assessment.abi, networkData.address);
        const socialCount = Number(await contract.methods.socialCount().call());
        //Load Socials
        for (let i = 1; i <= socialCount; i++) {
          const newSocial: SocialBlockChainType = await contract.methods.socials(i).call();
          setSocials((socials) => [
            ...socials,
            { ...newSocial, document: JSON.parse(newSocial.document), id: Number(newSocial.id).toString() },
          ]);

          // setSocialForm((socials) => [...socials, JSON.parse(newSocial.document)]);
        }
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  useEffect(() => {
    setDate(dateState);
  }, [dateState]);

  // const Smerge = socials.map((t1) => ({ ...t1, ...socialform.find((t2) => t2.id === t1.id) }));
  const social = socials.filter((obj) => obj.date.includes(date ?? ""));
  // const social = Smerge.filter((obj) => obj.date.includes(date));

  return (
    <>
      <Sidebar />
      <div className="margin">
        <table className="assess-table">
          <tbody>
            <SocialList assessments={social} />
            {!!!social && <h2> No Assessment Found</h2>}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SocialAssess;
