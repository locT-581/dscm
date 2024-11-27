"use client";
import Product from "@/types/product";
import Shipment from "@/types/shipment";

import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";

import SpaIcon from "@mui/icons-material/Spa";
import IronIcon from "@mui/icons-material/Iron";
import PaletteIcon from "@mui/icons-material/Palette";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import Link from "next/link";

export interface ITimeLineProps {
  shipments: Shipment[];
  product: Product;
}

export default function TimeLine({ shipments, product }: ITimeLineProps) {
  return (
    <div className="time-margin">
      <div className="timeline">
        {!!product ? (
          <VerticalTimeline>
            {shipments
              .filter((obj) => obj.product.includes(product.id))
              .map((e, i) => {
                return (
                  <VerticalTimelineElement
                    key={i}
                    date={e.date}
                    iconStyle={{ background: "black", color: "#fff" }}
                    icon={
                      e.account === "0xf00EbF44706A84d73698D51390a6801215fF338c" ? (
                        <SpaIcon />
                      ) : e.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae" ? (
                        <IronIcon />
                      ) : e.account === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619" ? (
                        <PaletteIcon />
                      ) : e.account === "0x5e66410a4C6443d035E05162C9bb59708cB0596F" ? (
                        <DeliveryDiningIcon />
                      ) : e.account === "0x3421668462324bFB48EA07D0B12243091CD09759" ? (
                        <ShoppingBasketIcon />
                      ) : null
                    }
                  >
                    <div className="time-title">
                      <h4>{e.shipType === "Shipment Sent" ? e.process + " Sent" : e.process + " Received"}</h4>
                      <button className="time-title-btn">
                        <Link
                          href={"lci?process=" + e.process + "&productId=" + product.id}
                          // state={{ process: e.process, product: product }}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          Life Cycle Inventory of {e.process}
                        </Link>
                      </button>
                    </div>
                    <h4 className="subtitle">
                      {e.account === "0xf00EbF44706A84d73698D51390a6801215fF338c"
                        ? "by Supplier#1"
                        : e.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
                        ? "by Supplier#2"
                        : e.account === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619"
                        ? "by Supplier#3"
                        : e.account === "0x5e66410a4C6443d035E05162C9bb59708cB0596F"
                        ? "by Supplier#4"
                        : e.account === "0x3421668462324bFB48EA07D0B12243091CD09759"
                        ? "by Company"
                        : null}
                    </h4>
                    <button className="as-btn">
                      <Link
                        href={"/assessments?account=" + e.account}
                        // state={e.account}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        Environmental and Social Sustainability Assessment of
                        {e.account === "0xf00EbF44706A84d73698D51390a6801215fF338c"
                          ? " Supplier#1"
                          : e.account === "0x2074b4e9bE42c7724C936c16795C42c04e83d7ae"
                          ? " Supplier#2"
                          : e.account === "0xa686525B5A5c9353c649b9Ef7f387a9B92085619"
                          ? " Supplier#3"
                          : e.account === "0x5e66410a4C6443d035E05162C9bb59708cB0596F"
                          ? " Supplier#4"
                          : e.account === "0x3421668462324bFB48EA07D0B12243091CD09759"
                          ? " Company"
                          : null}
                      </Link>
                    </button>
                    <h4 className="description">
                      {e.shipType}: {e.date}
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
