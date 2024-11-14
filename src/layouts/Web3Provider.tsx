"use client";

import Web3 from "web3";
import { useEffect } from "react";

import { useAppDispatch } from "@/redux/hook";

import { web3 } from "@/web3";

export interface IWeb3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: IWeb3ProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Kiểm tra nếu Web3 đã được khởi tạo trong window
    if (typeof window.ethereum !== "undefined") {
      web3.eth.requestAccounts().then((accounts) => {
        console.log("🚀 ~ web3.eth.requestAccounts ~ accounts:", accounts);
      });
      // Yêu cầu người dùng kết nối tài khoản Metamask
      // window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      //     const accountList = accounts as string[];
      //     dispatch(setAccount(accountList[0]));
      // });
    } else if (window.web3) {
      // Cho các phiên bản dapp cũ hơn vẫn sử dụng Web3 mà không có MetaMask mới
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, [dispatch]);

  return <>{children}</>;
}
