"use client";

import { useState } from "react";

import Button from "@/components/Button";
import AddShipment from "@/components/AddShipment";
import { useWeb3Store } from "@/stores/storeProvider";
import { ShipType } from "@/types/common";
import Tabs from "@/UI/Tabs";
import EnhancedTable from "@/UI/Table";
import { Backdrop } from "@mui/material";
// import TableShipment from "@/UI/TableShipment";
import formatDate from "@/utils/formatDate";

export default function Dashboard() {
  const { shipments, orders, processes, user } = useWeb3Store((state) => state);
  console.log("🚀 ~ Dashboard ~ shipments:", user, orders);

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
      {/* <Tabs>
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
      </Tabs> */}

      <Tabs>
        {[
          {
            title: "Chờ xác nhận",
            element: (
              <EnhancedTable
                rowList={orders
                  .filter((o) => !!o.product)
                  .filter((o) => o.process.some((p) => p.status === "WaitingConfirm"))
                  .map((order) => ({
                    quantity: order.quantity,
                    unit: order.unit,
                    name: order?.product?.name ?? "Rỗng",
                    id: +order.id,
                    status: "Processing",
                    image: order?.product?.image ?? "",
                    date: order?.process.find((p) => p.supplier?.id == user?.id)?.expectedFinishDate ?? "",
                    dateCreate: formatDate(order.date),
                  }))}
              />
            ),
          },
          {
            title: "Đang chờ",
            element: (
              <EnhancedTable
                rowList={orders
                  .filter((o) => !!o.product)
                  .filter((o) => o.process.some((p) => p.status === "Waiting"))
                  .map((order) => ({
                    ...order,
                    name: order?.product?.name ?? "Rỗng",
                    image: order?.product?.image ?? "",
                    status: "Done",
                    id: +order.id,
                    dateCreate: formatDate(order.date),
                  }))}
              />
            ),
          },
          {
            title: "Đang thực hiện",
            element: (
              <EnhancedTable
                rowList={orders
                  .filter((o) => !!o.product)
                  .filter((o) => o.process.some((p) => p.status === "Processing"))
                  .map((order) => ({
                    ...order,
                    name: order?.product?.name ?? "Rỗng",
                    image: order?.product?.image ?? "",
                    status: "Done",
                    id: +order.id,
                    dateCreate: formatDate(order.date),
                  }))}
              />
            ),
          },
          {
            title: "Hoàn thành",
            element: (
              <EnhancedTable
                rowList={orders
                  .filter((o) => !!o.product)
                  .filter((o) => o.process.some((p) => p.status === "Done" || p.status === "Late"))
                  .map((order) => ({
                    ...order,
                    name: order?.product?.name ?? "Rỗng",
                    image: order?.product?.image ?? "",
                    status: "Done",
                    id: +order.id,
                    dateCreate: formatDate(order.date),
                  }))}
              />
            ),
          },
          {
            title: "Huỷ",
            element: (
              <EnhancedTable
                rowList={orders
                  .filter((o) => !!o.product)
                  .filter((o) => o.process.some((p) => p.status === "Cancel"))
                  .map((order) => ({
                    ...order,
                    name: order?.product?.name ?? "Rỗng",
                    image: order?.product?.image ?? "",
                    status: "Done",
                    id: +order.id,
                    dateCreate: formatDate(order.date),
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
