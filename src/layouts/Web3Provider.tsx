"use client";

import Web3 from "web3";
import { useEffect } from "react";

import { Origin } from "@/lib/abis";
import { useWeb3Store } from "@/stores/storeProvider";
import { getSupplierByAddress } from "@/app/apis";

export interface IWeb3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: IWeb3ProviderProps) {
  const {
    web3,
    contract,
    setWeb3,
    setAccount,
    setContract,
    orders,
    getOrders,
    shipments,
    getShipments,
    products,
    getProducts,
    processes,
    getProcess,
    user,
    setUser,
    suppliers,
    getSuppliers,
  } = useWeb3Store((state) => state);

  // get Web3
  useEffect(() => {
    if (!!web3) return;

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.request({ method: "eth_requestAccounts" }).then(async (accounts) => {
        const accountList = accounts as string[];
        setAccount(accountList[0]);

        const user = await getSupplierByAddress(accountList[0].toLocaleLowerCase());
        setUser(user ?? undefined);
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, [setWeb3, setAccount, setUser, web3]);

  // get contract
  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3 || !!contract) return;

      const networkId = await web3.eth.net.getId();
      const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];
      if (!!!networkData) {
        window.alert("Origin contract is not deployed to the detected network");
        return;
      }

      const localContract = new web3.eth.Contract(Origin.abi, networkData.address);
      setContract(localContract);
      // setLatlong((latlong) => [...latlong, (newShipment as unknown as ShipmentType).latlong]);
    };
    loadBlockchainData();
  }, [web3, contract, setContract]);

  useEffect(() => {
    (async () => {
      if (contract && !!!products) await getProducts();
      if (contract && !!!processes) await getProcess();
    })();
  }, [contract, products, getProducts, processes, getProcess]);

  useEffect(() => {
    if (contract && !!!orders && !!products && !!suppliers) getOrders();
  }, [contract, orders, getOrders, products, suppliers]);

  useEffect(() => {
    if (contract && !!!shipments && !!products && !!processes && !!suppliers && !!orders) getShipments();
  }, [contract, shipments, getShipments, products, processes, suppliers, orders]);

  useEffect(() => {
    // if (user && user.role === "Focal company" && !!!suppliers) getSuppliers();
    if (!!!suppliers) getSuppliers();
  }, [user, suppliers, getSuppliers]);

  if (!!!user) return <>Đăng nhập vào hệ thống</>;
  return <>{children}</>;
}
