"use client";

import { useState } from "react";

import Button from "@/components/Button";
import AddShipment from "@/components/AddShipment";
import { useWeb3Store } from "@/stores/storeProvider";
import { ShipType } from "@/types/common";
import Tabs from "@/UI/Tabs";
import EnhancedTable from "@/UI/Table";
import { Backdrop } from "@mui/material";
import Option from "@/components/Option";
// import TableShipment from "@/UI/TableShipment";

export default function Dashboard() {
  const { shipments, orders, processes, user, tempInitOrder } = useWeb3Store((state) => state);
  const [shipType, setShipType] = useState<ShipType>("Send");

  const [showCreateShip, setShowCreateShip] = useState(false);

  const ordersFilter = orders?.filter((o) => o.process.find((p) => p.supplier?.id == user?.id));

  if (!!!orders || !!!shipments || !!!processes) return <>Loading...</>;

  return (
    <>
      {user?.role == "Supplier" && (
        <div className="shipment-btns flex gap-4 items-end justify-end">
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
      )}

      <>
        {user?.role == "Supplier" ? (
          <Tabs>
            {[
              {
                title: "Đang chờ",
                element: (
                  <EnhancedTable
                    dateTitle="Ngày hoàn thành dự kiến"
                    option={
                      <Option
                        disabled={
                          tempInitOrder?.process?.[
                            tempInitOrder?.process.findIndex((p) => p.supplier?.id == user?.id) - 1 ?? 0
                          ].status != "Done"
                        }
                        options={[
                          {
                            label: "Nhận hàng",
                            onClick: () => {
                              setShowCreateShip(!showCreateShip);
                              setShipType("Receive");
                            },
                          },
                        ]}
                      />
                    }
                    rowList={
                      ordersFilter
                        ?.filter((o) => o.process.find((p) => p.supplier?.id == user?.id)?.status === "Waiting")
                        .map((order) => ({
                          ...order,
                          name: order?.product?.name ?? "Rỗng",
                          image: order?.product?.image ?? "",
                          status: "Done",
                          id: +order.id,
                          dateCreate: new Date(
                            order.process.find((p) => p.supplier?.id == user?.id)?.expectedFinishDate ?? ""
                          ).getTime(),
                          rawId: order.id,
                          process: order.process.find((p) => p.supplier?.id == user?.id),
                          date: new Date(
                            order.process.find((p) => p.supplier?.id == user?.id)?.expectedFinishDate ?? ""
                          ).getTime(),
                        })) ?? []
                    }
                  />
                ),
              },
              {
                title: "Đang thực hiện",
                element: (
                  <EnhancedTable
                    dateTitle="Ngày hoàn thành dự kiến"
                    option={
                      <Option
                        options={[
                          {
                            label: "Gửi hàng",
                            onClick: () => {
                              setShowCreateShip(!showCreateShip);
                              setShipType("Send");
                            },
                          },
                        ]}
                      />
                    }
                    rowList={
                      ordersFilter
                        ?.filter((o) => o.process.find((p) => p.supplier?.id == user?.id)?.status === "Processing")
                        .map((order) => ({
                          ...order,
                          name: order?.product?.name ?? "Rỗng",
                          image: order?.product?.image ?? "",
                          status: "Done",
                          id: +order.id,
                          dateCreate: new Date(
                            order.process.find((p) => p.supplier?.id == user?.id)?.expectedFinishDate ?? ""
                          ).getTime(),
                          rawId: order.id,
                          process: order.process.find((p) => p.supplier?.id == user?.id),
                          date: new Date(
                            order.process.find((p) => p.supplier?.id == user?.id)?.expectedFinishDate ?? ""
                          ).getTime(),
                        })) ?? []
                    }
                  />
                ),
              },
              {
                title: "Hoàn thành",
                element: (
                  <EnhancedTable
                    dateTitle="Ngày hoàn thành thưc tế"
                    rowList={
                      ordersFilter
                        ?.filter((o) => {
                          return o.process.find((p) => p.supplier?.id == user?.id)?.status === "Done";
                        })
                        .map((order) => ({
                          ...order,
                          name: order?.product?.name ?? "Rỗng",
                          image: order?.product?.image ?? "",
                          status: "Done",
                          id: +order.id,
                          dateCreate: new Date(
                            order.process.find((p) => p.supplier?.id == user?.id)?.actualFinishDate ?? ""
                          ).getTime(),
                          rawId: order.id,
                          process: order.process.find((p) => p.supplier?.id == user?.id),
                          date: new Date(
                            order.process.find((p) => p.supplier?.id == user?.id)?.actualFinishDate ?? ""
                          ).getTime(),
                        })) ?? []
                    }
                  />
                ),
              },
            ]}
          </Tabs>
        ) : (
          <Tabs>
            {[
              {
                title: "Đang thực hiện",
                element: (
                  <EnhancedTable
                    dateTitle="Ngày tạo đơn hàng"
                    rowList={orders
                      .filter((o) => o.statusProcess !== "Done")
                      .map((order) => ({
                        ...order,
                        name: order?.product?.name ?? "Rỗng",
                        image: order?.product?.image ?? "",
                        status: "Done",
                        id: +order.id,
                        dateCreate: new Date(order.date).getTime(),
                        rawId: order.id,
                        process: order.process.find((p) => p.supplier?.id == user?.id),
                        date: new Date(order.date).getTime(),
                      }))}
                  />
                ),
              },
              {
                title: "Hoàn thành",
                element: (
                  <EnhancedTable
                    dateTitle="Ngày hoàn thành thưc tế"
                    rowList={orders
                      .filter((o) => o.statusProcess == "Done")
                      .map((order) => ({
                        ...order,
                        name: order?.product?.name ?? "Rỗng",
                        image: order?.product?.image ?? "",
                        status: "Done",
                        id: +order.id,
                        dateCreate: new Date(order.date).getTime(),
                        rawId: order.id,
                        process: order.process.find((p) => p.supplier?.id == user?.id),
                        date: new Date(order.date).getTime(),
                      }))}
                  />
                ),
              },
            ]}
          </Tabs>
        )}
      </>
      {/* <Shipment shipments={shipments} orders={orders} /> */}

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
            initOrder={tempInitOrder}
          />
        </div>
      </Backdrop>
    </>
  );
}
