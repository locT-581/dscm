"use client";

import Report from "@/components/Report";
import { useWeb3Store } from "@/stores/storeProvider";

export default function Reports() {
  const { LCIs, enviros, socials } = useWeb3Store((state) => state);

  return (
    <div>
      <div className="main-container">
        <header className="reports-header">
          <h2>Báo cáo</h2>
        </header>
        {<Report enviroCount={enviros?.length ?? 0} socialCount={socials?.length ?? 0} LCICount={LCIs?.length ?? 0} />}
      </div>
    </div>
  );
}
