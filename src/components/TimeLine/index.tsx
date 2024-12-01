"use client";
import Product from "@/types/product";
import Shipment from "@/types/shipment";

import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import Link from "next/link";
import { useWeb3Store } from "@/stores/storeProvider";

export interface ITimeLineProps {
  shipments: Shipment[];
  product: Product;
}

export default function TimeLine({ shipments, product }: ITimeLineProps) {
  const { suppliers } = useWeb3Store((state) => state);
  return (
    <div className="w-[90%]">
      <div className="timeline">
        {!!product ? (
          <VerticalTimeline>
            {shipments
              .filter((obj) => obj?.product?.id.includes(product.id))
              .map((e, i) => {
                return (
                  <VerticalTimelineElement
                    key={i}
                    date={e.date}
                    iconStyle={{ background: "black", color: "#fff" }}
                    icon={
                      <img src={e.process?.image} className="w-full h-full m-1 rounded-full object-cover" alt="icon" />
                    }
                  >
                    <div className="time-title">
                      <h4>{e.shipType === "Shipment Sent" ? e.process?.name + " Gửi" : e.process?.name + " Nhận"}</h4>
                      <button className="time-title-btn">
                        <Link
                          href={"/van-chuyen/lci?process=" + e.process?.id + "&productId=" + product?.id}
                          // state={{ process: e.process, product: product }}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          Đánh giá LCI của {e.process?.name}
                        </Link>
                      </button>
                    </div>
                    <h4 className="subtitle">
                      {" "}
                      bởi{" "}
                      {suppliers?.find((s) => s.account.toLocaleLowerCase() === e.account.toLocaleLowerCase())?.name}
                    </h4>
                    <button className="as-btn">
                      <Link
                        href={
                          "/van-chuyen/danh-gia?account=" +
                          suppliers?.find((s) => s.account.toLocaleLowerCase() === e.account.toLocaleLowerCase())?.id
                        }
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        Đánh giá tính bền vững môi trường và xã hội của{" "}
                        {suppliers?.find((s) => s.account.toLocaleLowerCase() === e.account.toLocaleLowerCase())?.name}
                      </Link>
                    </button>
                    <h4 className="description">
                      {e.shipType == "Send" ? "Gửi vào " : "Nhận vào "}: {e.date}
                    </h4>
                  </VerticalTimelineElement>
                );
              })}
          </VerticalTimeline>
        ) : null}
      </div>
    </div>
  );
}
