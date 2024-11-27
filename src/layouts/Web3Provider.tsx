"use client";
import Web3 from "web3";
import { useEffect } from "react";
import { useWeb3Store } from "@/stores/storeProvider";
import { Origin } from "@/lib/abis";
import Order, { OrderBlockChainType } from "@/types/order";
import Shipment, { ShipmentBlockChainType } from "@/types/shipment";

export interface IWeb3ProviderProps {
  children: React.ReactNode;
}

export default function Web3Provider({ children }: IWeb3ProviderProps) {
  const { web3, contract, setWeb3, setAccount, setContract, setOrders, setShipments } = useWeb3Store((state) => state);

  useEffect(() => {
    if (!!web3) return;

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        const accountList = accounts as string[];
        setAccount(accountList[0]);
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, [setWeb3, setAccount, web3]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      // CHeck if don't have web3 or already have contract, return
      if (!web3 || !!contract) return;

      const networkId = await web3.eth.net.getId();
      const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];

      if (networkData) {
        // Get contract from network
        const contract = new web3.eth.Contract(Origin.abi, networkData.address);
        setContract(contract);

        // Get orders from contract
        const orderCount: number = await contract.methods.orderCount().call();
        const orders: Order[] = [];
        for (let i = 1; i <= orderCount; i++) {
          const newOrder: OrderBlockChainType = await contract.methods.orders(i).call();
          orders.push({ ...newOrder, id: Number(newOrder.id).toString() });
        }
        setOrders(orders);

        // Get shipments from contract
        const shipmentCount: number = await contract.methods.shipmentCount().call();
        const shipments: Shipment[] = [];
        for (let i = 1; i <= shipmentCount; i++) {
          const newShipment: ShipmentBlockChainType = await contract.methods.shipments(i).call();
          shipments.push({
            ...newShipment,
            id: Number(newShipment.id).toString(),
            latlong: JSON.parse(newShipment.latlong),
          });
        }
        setShipments(shipments);

        // setLatlong((latlong) => [...latlong, (newShipment as unknown as ShipmentType).latlong]);
      } else {
        window.alert("Origin contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, [web3, contract, setContract, setOrders, setShipments]);
  return <>{children}</>;
}
