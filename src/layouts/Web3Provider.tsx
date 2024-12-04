"use client";

import Web3, { ProviderAccounts } from "web3";
import { useEffect, useState } from "react";

import { Assessment, Origin } from "@/lib/abis";
import { useWeb3Store } from "@/stores/storeProvider";
import { getSupplierByAddress } from "@/app/apis";
import Welcome from "@/components/views/Welcome";
import { CircularProgress } from "@mui/material";
import { Backdrop } from "@mui/material";
import useToast from "@/hook/useToast";

export interface IWeb3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: IWeb3ProviderProps) {
  const {
    web3,
    loading,
    setLoading,
    contract,
    assessmentContract,
    setAssessmentContract,
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
    LCIs,
    getCLIs,
    enviros,
    getEnviros,
    socials,
    getSocials,
  } = useWeb3Store((state) => state);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean | null>(null);

  const { _toast } = useToast();

  // get Web3
  useEffect(() => {
    if (!!web3) return;

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.on("accountsChanged", () => {
        console.log("accountsChanged");
        window.location.reload();
      });
      window.ethereum.on("disconnect", () => {
        console.log("disconnect");
        window.location.reload();
      });

      window.ethereum.request({ method: "eth_accounts" }).then(async (accounts: ProviderAccounts) => {
        const accountList = accounts as string[];
        if (accountList?.length > 0) {
          requestAccounts(window);
          setIsFirstTimeLogin(false);
        } else {
          setIsFirstTimeLogin(true);
        }
      });

      // window.ethereum.request({ method: "eth_requestAccounts" }).then(async (accounts: ProviderAccounts) => {
      //   const accountList = accounts as string[];
      //   setAccount(accountList[0]);

      //   const user = await getSupplierByAddress(accountList[0].toLocaleLowerCase());
      //   setUser(user ?? undefined);
      // });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, [setWeb3, web3]);

  const requestAccounts = async (window: Window & typeof globalThis) => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    setLoading(true);
    const user = await getSupplierByAddress(accounts[0].toLocaleLowerCase());
    setUser(user ?? undefined);
    setLoading(false);
    setIsFirstTimeLogin(false);
    _toast("Đăng nhập thành công!", {
      style: {
        padding: "8px",
        color: "#3eb049",
      },
    });
  };

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

      const networkDataAssessment = Assessment.networks[networkId as unknown as keyof typeof Assessment.networks];
      if (!!!networkDataAssessment) {
        window.alert("Assessment contract is not deployed to the detected network");
        return;
      }
      const localAssessmentContract = new web3.eth.Contract(Assessment.abi, networkDataAssessment.address);
      setAssessmentContract(localAssessmentContract);
    };
    loadBlockchainData();
  }, [web3, contract, setContract, assessmentContract, setAssessmentContract]);

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

  useEffect(() => {
    if (contract && !!processes && !!suppliers && !!!LCIs) getCLIs();
  }, [contract, LCIs, processes, getCLIs, suppliers]);

  useEffect(() => {
    if (contract && !!processes && !!suppliers && !!!enviros) getEnviros();
  }, [contract, enviros, processes, suppliers, getEnviros]);

  useEffect(() => {
    if (contract && !!processes && !!suppliers && !!!socials) getSocials();
  }, [contract, socials, , processes, suppliers, getSocials]);

  if (isFirstTimeLogin == null || loading)
    return (
      <>
        <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );

  return isFirstTimeLogin != null && isFirstTimeLogin == true ? (
    <Welcome onConnect={requestAccounts} />
  ) : (
    <>{children}</>
  );
}
