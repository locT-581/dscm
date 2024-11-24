"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import AddOrder from "@/components/AddOrder";
import AddShipment from "@/components/AddShipment";
import Order from "@/components/Order";
import Shipment from "@/components/Shipment";
import { useWeb3Store } from "@/stores/storeProvider";

export default function Dashboard() {
  const { account, shipments, orders, contract } = useWeb3Store((state) => state);

  const [shipType, setShipType] = useState("");

  const [showCreateShip, setShowCreateShip] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

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
        <Shipment shipments={shipments} orders={orders} />
      </div>
    </>
  );
}
