"use client";

import Web3 from "web3";
import { useEffect, useRef, useState } from "react";

import Origin from "../../../../build/contracts/Origin.json";
import { Contract } from "web3-eth-contract"; // Import kiểu Contract từ Web3.js
import OrderType from "@/types/order";
import ShipmentType from "@/types/shipment";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import AddOrder from "@/components/AddOrder";
import AddShipment from "@/components/AddShipment";
import Order from "@/components/Order";
import { LatLong } from "@/types/common";
import Shipment from "@/components/Shipment";

type OriginAbi = typeof Origin.abi;

export default function Dashboard() {
  const web3instance = useRef<Web3 | null>(null);

  const [contract, setContract] = useState<Contract<OriginAbi>>();
  const [account, setAccount] = useState<string | undefined>();
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showCreateShip, setShowCreateShip] = useState(false);

  const [orders, setOrder] = useState<OrderType[]>([]);
  const [shipType, setShipType] = useState("");
  const [shipments, setShipment] = useState<ShipmentType[]>([]);
  const [latlong, setLatlong] = useState<LatLong[]>([]);

  useEffect(() => {
    // Kiểm tra nếu Web3 đã được khởi tạo trong window
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // Tạo một instance Web3 sử dụng provider từ Metamask
      web3instance.current = new Web3(window.ethereum);
      // Yêu cầu người dùng kết nối tài khoản Metamask
      window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        const accountList = accounts as string[];
        setAccount(accountList[0]);
      });
    } else if (window.web3) {
      console.log("object");
      // Cho các phiên bản dapp cũ hơn vẫn sử dụng Web3 mà không có MetaMask mới
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3instance.current) return;
      const networkId = await web3instance.current.eth.net.getId();
      const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];

      if (networkData) {
        // get contract
        const contract = new web3instance.current.eth.Contract(Origin.abi, networkData.address);
        setContract(contract);
        // get all orders and shipments
        const orderCount: number = await contract.methods.orderCount().call();
        for (let i = 1; i <= orderCount; i++) {
          const newOrder = await contract.methods.orders(i).call();
          setOrder((orders) => [...orders, newOrder as unknown as OrderType]);
        }
        const shipmentCount: number = await contract.methods.shipmentCount().call();
        for (let i = 1; i <= shipmentCount; i++) {
          const newShipment = await contract.methods.shipments(i).call();
          setShipment((shipments) => [...shipments, newShipment as unknown as ShipmentType]);
          setLatlong((latlong) => [...latlong, (newShipment as unknown as ShipmentType).latlong]);
        }
      } else {
        window.alert("Origin contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  const newShipment = shipments.map((t1) => ({
    ...t1,
    ...latlong.find((t2) => Number(t2.id) === Number(t1.id)),
    id: BigInt(Number(t1.id)),
  }));

  //Add Order
  const addOrder = ({ name, quantity, unit, date }: { name: string; quantity: string; unit: string; date: string }) => {
    contract?.methods
      .addOrder(name, quantity, unit, date)
      .send({ from: account })
      .once("receipt", () => {
        window.location.reload();
      });
  };

  //Add Shipment
  const addShipment = ({
    shipType,
    place,
    latlong,
    date,
    product,
    process,
  }: {
    shipType: string;
    place: string;
    latlong: string;
    date: string;
    product: string;
    process: string;
    account?: string;
  }) => {
    contract?.methods
      .addShipment(shipType, place, latlong, date, product, process)
      .send({ from: account })
      .once("receipt", () => {
        window.location.reload();
      });
  };

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <header className="dashheader">
          <div className="shipment-btns">
            <Button
              onClick={() => {
                setShowCreateShip(!showCreateShip);
                setShipType("Shipment Sent");
              }}
              color="orange"
              text="Send Shipment"
            />
            <Button
              onClick={() => {
                setShowCreateShip(!showCreateShip);
                setShipType("Shipment Received");
              }}
              color="gold"
              text="Receive Shipment"
            />
          </div>
          <Button
            onClick={() => {
              setShowCreateOrder(!showCreateOrder);
            }}
            color={showCreateOrder ? "#f2f2f2" : "#3eb049"}
            text={showCreateOrder ? "" : <>Create Order</>}
          />
        </header>
        {showCreateOrder && (
          <AddOrder
            addOrder={addOrder}
            onAdd={() => {
              setShowCreateOrder(!showCreateOrder);
            }}
          />
        )}
        {showCreateShip && (
          <AddShipment
            addShipment={addShipment}
            shipType={shipType}
            onShipAdd={() => {
              setShowCreateShip(!showCreateShip);
            }}
          />
        )}
        <Order orders={orders} />
        <Shipment shipments={newShipment} orders={orders} />
      </div>
    </>
  );
}
