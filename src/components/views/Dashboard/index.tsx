"use client";

import { useState } from "react";

import Button from "@/components/Button";
import AddShipment from "@/components/AddShipment";
import { useWeb3Store } from "@/stores/storeProvider";
import { ShipType } from "@/types/common";
import Tabs from "@/UI/Tabs";
import EnhancedTable from "@/UI/Table";
import { Backdrop } from "@mui/material";
import TableShipment from "@/UI/TableShipment";

export default function Dashboard() {
  const { shipments, orders, processes } = useWeb3Store((state) => state);

  const [shipType, setShipType] = useState<ShipType>("Send");

  const [showCreateShip, setShowCreateShip] = useState(false);

  if (!!!orders || !!!shipments || !!!processes) return null;

  return (
    <>
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
      </header>

      {/* <Shipment shipments={shipments} orders={orders} /> */}
      <Tabs>
        {[
          {
            title: "Danh sách đơn hàng",
            element: (
              <EnhancedTable
                rowList={orders.map((order) => ({
                  ...order,
                  name: order?.product?.name ?? "Rỗng",
                  id: +order.id,
                  status: "Processing",
                }))}
              />
            ),
          },
          {
            title: "Danh sách vận chuyển",
            element: (
              <TableShipment
                rowList={shipments.map((shipment) => ({
                  shipmentStatus: shipment.shipType == "Send" ? "Đã gửi" : "Đã nhận",
                  shippedOrder: shipment?.product?.name ?? "Rỗng",
                  name: shipment?.product?.name ?? "Rỗng",
                  location: shipment?.place ?? "Rỗng",
                  dated: shipment?.date ?? "Rỗng",
                  addBy: shipment?.supplier?.name ?? "Rỗng",
                  processes: processes.find((process) => process.id === shipment?.process?.id)?.name ?? "Rỗng",
                }))}
              />
            ),
          },
        ]}
      </Tabs>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={showCreateShip}
        onClick={() => setShowCreateShip(false)}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <AddShipment
            shipType={shipType}
            onShipAdd={() => {
              setShowCreateShip(false);
            }}
          />
        </div>
      </Backdrop>
    </>
  );
}
