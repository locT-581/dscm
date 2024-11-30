"use client";

import Web3 from "web3";
import { useEffect, useRef, useState } from "react";

import { Assessment } from "@/lib/abis";
import Report from "@/components/Report";

export default function Reports() {
  const web3instance = useRef<Web3 | null>(null);

  const [LCICount, setLCICount] = useState<number>(0);
  const [enviroCount, setEnviroCount] = useState<number>(0);
  const [socialCount, setSocialCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      web3instance.current = new Web3(window.ethereum);
      window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
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
        //Fetch contract
        const contract = new web3instance.current.eth.Contract(Assessment.abi, networkData.address);
        const LCICount: number = Number(await contract.methods.LCICount().call());
        setLCICount(LCICount);
        const enviroCount = Number(await contract.methods.enviroCount().call());
        setEnviroCount(enviroCount);
        const socialCount = Number(await contract.methods.socialCount().call());
        setSocialCount(socialCount);
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);
  return (
    <div>
      <div className="main-container">
        <header className="reports-header">
          <h2>Reports</h2>
        </header>
        {<Report enviroCount={enviroCount ?? 0} socialCount={socialCount ?? 0} LCICount={LCICount ?? 0} />}
      </div>
    </div>
  );
}
