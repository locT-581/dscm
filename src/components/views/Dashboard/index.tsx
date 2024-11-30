"use client";

import { useState } from "react";

import Button from "@/components/Button";
import AddOrder from "@/components/AddOrder";
import AddShipment from "@/components/AddShipment";
import Order from "@/components/Order";
import Shipment from "@/components/Shipment";
import { useWeb3Store } from "@/stores/storeProvider";
import useToast from "@/hook/useToast";
import { ShipType } from "@/types/common";
import Tabs from "@/UI/Tabs";
import EnhancedTable from "@/UI/Table";

export default function Dashboard() {
  const { account, shipments, orders, contract, getOrders } = useWeb3Store((state) => state);

  const { notify, update } = useToast();

  const [shipType, setShipType] = useState<ShipType>("Send");

  const [showCreateShip, setShowCreateShip] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  //Add Order
  const addOrder = ({ name, quantity, unit, date }: { name: string; quantity: string; unit: string; date: string }) => {
    notify("Đang tạo đơn hàng...");
    contract?.methods
      .addOrder(name, quantity, unit, date)
      .send({ from: account })
      .once("receipt", async () => {
        await getOrders();
        update(true, "Đã tạo đơn hàng thành công!");
      })
      .once("error", async (e) => {
        await getOrders();
        update(true, "Đã xảy ra lỗi khi tạo đơn hàng! - " + e.message);
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
      {orders && (
        <EnhancedTable rowList={orders.map((order) => ({ ...order, name: order.productID, id: +order.id }))} />
      )}
      <Tabs>
        {[
          { title: "Danh sách đơn hàng", element: <Order orders={orders} /> },
          { title: "Danh sách vận chuyển", element: <Shipment shipments={shipments} orders={orders} /> },
        ]}
      </Tabs>
      <div className="">
        <header className="">
          <div className="shipment-btns">
            <Button
              onClick={() => {
                setShowCreateShip(!showCreateShip);
                setShipType("Send");
              }}
              color="orange"
              text="Gửi hàng"
            />
            <Button
              onClick={() => {
                setShowCreateShip(!showCreateShip);
                setShipType("Receive");
              }}
              color="gold"
              text="Nhận hàng"
            />
          </div>
          <Button
            onClick={() => {
              setShowCreateOrder(!showCreateOrder);
            }}
            color={showCreateOrder ? "#f2f2f2" : "#3eb049"}
            text={showCreateOrder ? "" : "Tạo đơn hàng"}
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
      </div>
    </>
  );
}
