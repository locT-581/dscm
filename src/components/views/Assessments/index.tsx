"use client";

import Link from "next/link";

import { useWeb3Store } from "@/stores/storeProvider";
import TableAssessment from "@/UI/TableAssessment";
import Tabs from "@/UI/Tabs";
import Button from "@/UI/Button";

export default function Assessments() {
  const { LCIs, socials, enviros } = useWeb3Store((state) => state);

  if (!!!LCIs || !!!socials || !!!enviros) return;
  return (
    <div>
      <Tabs>
        {[
          {
            title: "Đánh giá vòng đời hàng tồn kho",
            element: (
              <TableAssessment
                title="Các bảng đánh giá vòng đời hàng tồn kho"
                button={
                  <Link className="w-fit flex flex-shrink-0" href="/bieu-mau/lci">
                    <Button>Tạo đánh giá mới</Button>
                  </Link>
                }
                rowList={LCIs.map((i) => ({
                  id: i.id,
                  dated: i.date,
                  account: i.account?.name ?? "Rỗng",
                  period: `${i.month} ${i.year}`,
                  href: `danh-gia/lci?date=${i.date}`,
                }))}
              />
            ),
          },
          {
            title: "Đánh giá môi trường",
            element: (
              <TableAssessment
                title="Các bảng dánh giá môi trường"
                button={
                  <Link className="w-fit flex flex-shrink-0" href="/bieu-mau/moi-truong">
                    <Button>Tạo đánh giá mới</Button>
                  </Link>
                }
                rowList={enviros.map((i) => ({
                  id: i.id,
                  dated: i.date,
                  account: i.account?.name ?? "Rỗng",
                  period: `${i.month} ${i.year}`,
                  href: `danh-gia/moi-truong?date=${i.date}&account=${i.account.id}`,
                }))}
              />
            ),
          },
          {
            title: "Đánh giá xã hội",
            element: (
              <TableAssessment
                title="Các bảng dánh giá xã hội"
                button={
                  <Link className="w-fit flex flex-shrink-0" href="/bieu-mau/xa-hoi">
                    <Button>Tạo đánh giá mới</Button>
                  </Link>
                }
                rowList={socials.map((i) => ({
                  id: i.id,
                  dated: i.date,
                  account: i.account?.name ?? "Rỗng",
                  period: `${i.month} ${i.year}`,
                  href: `danh-gia/xa-hoi?date=${i.date}`,
                }))}
              />
            ),
          },
        ]}
      </Tabs>

      {/* <Enviro Emerge={LCIs} />
      <Social Smerge={socials} />
      <LCIIndicators assessments={enviros} /> */}
    </div>
  );
}
