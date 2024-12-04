"use client";
import { ReactNode } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";

export default function Title({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex w-full items-center gap-3">
      <ArrowBackIosIcon className="cursor-pointer" onClick={() => router.back()} fontSize="small" />
      <h2 className="w-full text-start text-2xl font-semibold">{children}</h2>
    </div>
  );
}
