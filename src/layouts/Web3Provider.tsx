"use client";

import Web3 from "web3";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
    setAccount,
    setWeb3Instance,
    setContract,
    setOrders,
    setLatlong,
    setShipments,
} from "@/redux/reducers/commonSlice";

import Origin from "../../build/contracts/Origin.json";
import Order from "@/types/order";
import Shipment from "@/types/shipment";

export interface IWeb3ProviderProps {
    children: React.ReactNode;
}

export default function Web3Provider({ children }: IWeb3ProviderProps) {
    const dispatch = useAppDispatch();
    const { web3instance, orders, latlong, shipments } = useAppSelector((state) => state.commonSlice);

    useEffect(() => {
        if (!!web3instance) return;
        // Kiểm tra nếu Web3 đã được khởi tạo trong window
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            // Tạo một instance Web3 sử dụng provider từ Metamask
            const web3Local = new Web3(window.ethereum);
            dispatch(setWeb3Instance(web3Local));

            // Yêu cầu người dùng kết nối tài khoản Metamask
            window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
                const accountList = accounts as string[];
                dispatch(setAccount(accountList[0]));
            });
        } else if (window.web3) {
            console.log("object");
            // Cho các phiên bản dapp cũ hơn vẫn sử dụng Web3 mà không có MetaMask mới
            window.web3 = new Web3(window.web3.currentProvider);
            dispatch(setWeb3Instance(window.web3));
        } else {
            console.log("Please install MetaMask!");
        }
    }, [dispatch, web3instance]);

    useEffect(() => {
        if (!!!web3instance) return;
        const loadBlockchainData = async () => {
            const networkId = await (web3instance as Web3).eth.net.getId();
            const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];

            if (networkData) {
                // get contract
                const contract = new (web3instance as Web3).eth.Contract(Origin.abi, networkData.address);
                dispatch(setContract(contract));
                // get all orders and shipments
                const orderCount: number = await contract.methods.orderCount().call();
                for (let i = 1; i <= orderCount; i++) {
                    const newOrder = await contract.methods.orders(i).call();
                    dispatch(setOrders([...(orders || []), newOrder as unknown as Order]));
                }
                const shipmentCount: number = await contract.methods.shipmentCount().call();
                for (let i = 1; i <= shipmentCount; i++) {
                    const newShipment: Shipment = await contract.methods.shipments(i).call();
                    dispatch(setShipments([...(shipments || []), newShipment as unknown as Shipment]));
                    dispatch(setLatlong([...(latlong || []), newShipment.latlong]));
                }
            } else {
                window.alert("Origin contract is not deployed to the detected network");
            }
        };
        loadBlockchainData();
    }, [web3instance, dispatch, latlong, orders, shipments]);

    return <>{children}</>;
}
