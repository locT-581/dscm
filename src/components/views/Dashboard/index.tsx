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

  if (!!!orders || !!!shipments || !!!processes) return <>Loading...</>;

  return (
    <>
      <header className="">
        <div className="shipment-btns">
          <Button
            onClick={() => {
              setShowCreateShip(!showCreateShip);
              setShipType("Send");
            }}
            color="#8E9AAF"
            text="Gửi hàng"
          />
          <Button
            onClick={() => {
              setShowCreateShip(!showCreateShip);
              setShipType("Receive");
            }}
            color="#809BCE"
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
                rowList={orders
                  .filter((o) => !!o.product)
                  .map((order) => ({
                    ...order,
                    name: order?.product?.name ?? "Rỗng",
                    id: +order.id,
                    status: "Processing",
                    image: order?.product?.image ?? "",
                  }))}
              />
            ),
          },
          {
            title: "Danh sách vận chuyển",
            element: (
              <TableShipment
                rowList={shipments
                  .filter((o) => !!o.process)
                  .map((shipment) => ({
                    shipmentStatus: shipment.shipType == "Send" ? "Đã gửi" : "Đã nhận",
                    shippedOrder: shipment?.product?.name ?? "Rỗng",
                    name: shipment?.product?.name ?? "Rỗng",
                    location: shipment?.place ?? "Rỗng",
                    dated: shipment?.date ?? "Rỗng",
                    addBy: shipment?.supplier?.name ?? "Rỗng",
                    processes: processes.find((process) => process.id === shipment?.process?.id)?.name ?? "Rỗng",
                    image: shipment?.product?.image ?? "",
                    imageProcess: processes.find((process) => process.id === shipment?.process?.id)?.image ?? "",
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
