"use client";

import EnviroType from "@/types/enviro";
import { useEffect, useRef, useState } from "react";
import Web3 from "web3";

import Assessment from "../../../../build/contracts/Assessments.json";

export default function EnviroAssess() {
  const web3instance = useRef<Web3 | null>(null);

  const [account, setAccount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [enviros, setEnviros] = useState<EnviroType[]>([]);
  const [enviroform, setEnviroForm] = useState<EnviroType[]>([]);
  const [material, setMaterial] = useState([]);

  const location = useLocation();
  const dateState = location.state.date;
  const accountState = location.state.account;

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
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const networkData = Assessment.networks[networkId as keyof typeof Assessment.networks];
      if (networkData) {
        //Fetch contract
        const contract = new web3.eth.Contract(Assessment.abi, networkData.address);
        const enviroCount = await contract.methods.enviroCount().call();
        //Load Enviros
        for (let i = 1; i <= enviroCount; i++) {
          const newEnviro = await contract.methods.enviros(i).call();
          setEnviros((enviros) => [...enviros, newEnviro]);
        }
        for (let i = 1; i <= enviroCount; i++) {
          const newEnviro = await contract.methods.enviros(i).call();
          setEnviroForm((enviros) => [...enviros, JSON.parse(newEnviro.document)]);
        }
        for (let i = 1; i <= enviroCount; i++) {
          const newenviro = await contract.methods.enviros(i).call();
          const parse = JSON.parse(newenviro.document);
          setMaterial((enviros) => [...enviros, parse.material]);
        }
      } else {
        window.alert("Assessment contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  return <div></div>;
}
