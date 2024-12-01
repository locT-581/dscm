"use client";

import { SocialList } from "@/components/views/Assessments/SocialAssess";
import { useWeb3Store } from "@/stores/storeProvider";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function App() {
  const { socials } = useWeb3Store((state) => state);
  const searchParams = useSearchParams();
  const dateState = searchParams.get("date");

  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(dateState);
  }, [dateState]);

  // const social = Smerge.filter((obj) => obj.date.includes(date));
  const social = socials?.filter((obj) => obj.date.includes(date ?? ""));

  return (
    <div className="ml-[10%]">
      <table className="assess-table">
        <tbody>
          <SocialList assessments={socials ?? []} />
          {!!!social && <h2> Không có thông tin</h2>}
        </tbody>
      </table>
    </div>
  );
}
