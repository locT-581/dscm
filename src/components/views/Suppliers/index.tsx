"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import TableSuppliers from "@/UI/TableSuppliers";

export default function Suppliers() {
  const { suppliers } = useWeb3Store((state) => state);

  if (!!!suppliers) return;
  return (
    <>
      <TableSuppliers
        rowList={suppliers.map((supplier) => ({
          id: supplier.id,
          name: supplier.name,
          processes: supplier.productsProcesses,
          address: supplier.address,
          phoneNumber: supplier.phoneNumber ?? "",
          account: supplier.account,
        }))}
      />
    </>
  );
}
