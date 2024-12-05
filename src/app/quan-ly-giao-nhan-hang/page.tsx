"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import TableShipment from "@/UI/TableShipment";

export default function App() {
  const { shipments, processes } = useWeb3Store((state) => state);
  return (
    <TableShipment
      rowList={
        shipments?.map((shipment) => ({
          shipmentStatus: shipment.shipType == "Send" ? "Đã gửi thành phẩm" : "Đã nhận nguyên liệu",
          shippedOrder: shipment?.product?.name ?? "Rỗng",
          name: shipment?.product?.name ?? "Rỗng",
          location: shipment?.place ?? "Rỗng",
          dated: shipment?.date ?? "Rỗng",
          addBy: shipment?.supplier?.name ?? "Rỗng",
          processes: processes?.find((process) => process.id === shipment?.process?.id)?.name ?? "Rỗng",
          image: shipment?.product?.image ?? "",
          imageProcess: processes?.find((process) => process.id === shipment?.process?.id)?.image ?? "",
        })) ?? []
      }
    />
  );
}
