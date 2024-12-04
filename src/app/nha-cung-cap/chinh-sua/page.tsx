"use client";
import AddSupplier from "@/components/views/Suppliers/AddSupplier";
import { useWeb3Store } from "@/stores/storeProvider";
import { useSearchParams } from "next/navigation";

export default function App() {
  const { suppliers } = useWeb3Store((state) => state);
  const params = useSearchParams();
  const id = params.get("id");
  const supplier = id ? suppliers?.find((supplier) => supplier.id == id) : undefined;
  return <AddSupplier supplier={supplier} />;
}
