"use client";

import Web3 from "web3";
import { useEffect, useRef, useState } from "react";

import Assessment from "../../../../build/contracts/Assessments.json";
import LCIType from "@/types/LCI";
import EnviroType from "@/types/enviro";
import SocialType from "@/types/social";
import Button from "@/components/Button";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Enviro from "@/components/Enviro";
import Social from "@/components/Social";
import LCIIndicators from "@/components/LCI";

export default function Assessments() {
  const web3instance = useRef<Web3 | null>(null);

  const [LCIs, setLCIs] = useState<LCIType[]>([]);
  const [LCIform, setLCIForm] = useState<LCIType[]>([]);

  const [enviros, setEnviros] = useState<EnviroType[]>([]);
  const [enviroform, setEnviroForm] = useState<EnviroType[]>([]);

  const [socials, setSocials] = useState<SocialType[]>([]);
  const [socialform, setSocialForm] = useState<SocialType[]>([]);

  const merge = LCIs.map((t1) => ({ ...t1, ...LCIform.find((t2) => t2.id === t1.id) }));
  const Emerge = enviros.map((t1) => ({ ...t1, ...enviroform.find((t2) => t2.id === t1.id) }));
  const Smerge = socials.map((t1) => ({ ...t1, ...socialform.find((t2) => t2.id === t1.id) }));

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      web3instance.current = new Web3(window.ethereum);
      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {});
    } else if (window.web3) {
      console.log("object");
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3instance.current === null) return;
      const networkId = await web3instance.current.eth.net.getId();
      const networkData = Assessment.networks[networkId as unknown as keyof typeof Assessment.networks];
      if (networkData) {
        const contract = new web3instance.current.eth.Contract(Assessment.abi, networkData.address);
        const LCICount: number = await contract.methods.LCICount().call();
        const enviroCount: number = await contract.methods.enviroCount().call();
        const socialCount: number = await contract.methods.socialCount().call();
        //Load LCIs
        for (let i = 1; i <= LCICount; i++) {
          const newLCI = await contract.methods.LCIs(i).call();
          setLCIs((LCIs) => [...LCIs, newLCI as unknown as LCIType]);
        }
        for (let i = 1; i <= LCICount; i++) {
          const newLCI = await contract.methods.LCIs(i).call();
          setLCIForm((LCIs) => [...LCIs, JSON.parse((newLCI as unknown as LCIType).document)]);
        }
        //Load Enviros
        for (let i = 1; i <= enviroCount; i++) {
          const newEnviro = await contract.methods.enviros(i).call();
          setEnviros((enviros) => [...enviros, newEnviro as unknown as EnviroType]);
        }
        for (let i = 1; i <= enviroCount; i++) {
          const newEnviro = await contract.methods.enviros(i).call();
          setEnviroForm((enviros) => [...enviros, JSON.parse((newEnviro as unknown as EnviroType).document)]);
        }
        //Load Socials
        for (let i = 1; i <= socialCount; i++) {
          const newSocial = await contract.methods.socials(i).call();
          setSocials((socials) => [...socials, newSocial as unknown as SocialType]);
        }
        for (let i = 1; i <= socialCount; i++) {
          const newSocial = await contract.methods.socials(i).call();
          setSocialForm((socials) => [...socials, JSON.parse((newSocial as unknown as SocialType).document)]);
        }
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);
  return (
    <div>
      <header className="assess-dashheader">
        <Link href="/forms/enviro">
          <Button className="btn" color="#279b48" text="Đánh giá môi trường" />
        </Link>
        <Link href="/forms/social">
          <Button className="btn" color="#279b48" text="Đánh giá xã hội" />
        </Link>
        <Link href="/forms/lci">
          <Button className="btn" color="#279b48" text="Vòng đời hàng tồn kho" />
        </Link>
      </header>

      <Enviro Emerge={Emerge} />
      <Social Smerge={Smerge} />
      <LCIIndicators assessments={merge} />
      <Sidebar />
    </div>
  );
}
