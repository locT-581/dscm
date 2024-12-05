"use client";
import AddProcess from "@/components/views/Products/AddProcess";
import { useWeb3Store } from "@/stores/storeProvider";
import { useSearchParams } from "next/navigation";

export default function App() {
  const { processes } = useWeb3Store((state) => state);
  const params = useSearchParams();
  const id = params.get("id");
  const process = id ? processes?.find((process) => process.id == id) : undefined;
  return <AddProcess process={process} />;
}
