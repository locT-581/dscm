"use client";

import { useEffect, useState } from "react";

import getDate from "@/utils/getDate";
import { GeocodeResponse, Position, ShipType } from "@/types/common";
import axiosClient from "@/services/axiosClient";
import { useWeb3Store } from "@/stores/storeProvider";

export interface IAddShipmentProps {
  addShipment: ({
    shipType,
    place,
    latlong,
    date,
    product,
    process,
  }: {
    shipType: ShipType;
    place: string;
    latlong: string;
    date: string;
    product: string;
    process: string;
    account?: string;
  }) => void;
  shipType: ShipType;
  onShipAdd: () => void;
}

export default function AddShipment({ addShipment, shipType: _shipType, onShipAdd }: IAddShipmentProps) {
  const { products, orders, contract, account } = useWeb3Store((state) => state);

  const [date, setDate] = useState("");
  const [d, setD] = useState(true);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // address of the current location
  const [place, setPlace] = useState<string>("");
  const [product, setProduct] = useState("");

  // A process of the product
  const [process, setProcess] = useState("");
  const [shipmentCount, setShipmentCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!!!contract) return;
      const shipmentCount = Number(await contract.methods.shipmentCount().call());
      setShipmentCount(shipmentCount);
    })();
  }, [contract]);

  const orderName = orders?.filter((obj) => obj.id.toString().includes(product)).map((order) => order.name);

  useEffect(() => {
    setDate(getDate());
    getLocation();
  }, [d]);

  const getCoordinates = async (position: Position) => {
    const lat = position.coords.latitude.toString();
    const long = position.coords.longitude.toString();

    setLatitude(lat);
    setLongitude(long);
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyA1NTVyRpS9yu9w8Otq1K3r-SwMJMvrhNY`;
    const url = `https://api.opencagedata.com/geocode/v1/json?key=d1cb18bbd8d04d70bd59b8d7178628cc&q=${lat}%2C${long}&pretty=1&language=vi`;
    axiosClient
      .get(url)
      .then((response) => response.data)
      .then((data: GeocodeResponse) => {
        const address = data.results[0].formatted;
        const removed = address.split(",").filter((item) => !item.includes("unnamed"));
        setPlace(removed.join(","));
      });
  };

  /**
   * Get current location
   */
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        () => {
          alert("API định vị không được hỗ trợ trong trình duyệt của bạn. Vui lòng bật Định vị!");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setD(!d);
    const setLatlong = {
      id: (parseInt(shipmentCount + "") + 1).toString(),
      latitude: latitude,
      longitude: longitude,
    };
    const latlong = JSON.stringify(setLatlong);
    addShipment({ shipType: _shipType, place, latlong, date, account, product, process });
  };

  return (
    <div className="center">
      <form className="ship-form" onSubmit={onSubmit}>
        <div className="form-header">
          <h2>{_shipType === "Send" ? "Gửi hàng" : "Nhận hàng"}</h2>
          <button className="btn form-close" style={{ background: "red", fontSize: "14px" }} onClick={onShipAdd}>
            X
          </button>
        </div>
        <div className="product-center-form">
          <div className="form-inputs">
            <label className="order-label">Chọn đơn hàng</label>
            <select className="order-product" required value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="" disabled hidden></option>
              {orders?.map((order, i) => {
                return (
                  <option key={i} value={Number(order.id)}>
                    Đơn hàng # {order.id}: {order.name}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-inputs">
            <label className="order-label">Chọn quy trình của sản phẩm</label>
            <select className="order-product" required value={process} onChange={(e) => setProcess(e.target.value)}>
              <option value="" disabled hidden></option>
              {products
                ?.filter((obj) => orderName?.includes(obj.name))
                .map((product, i) => (
                  <option key={i} value={product.process}>
                    {product.process}{" "}
                  </option>
                ))}
            </select>
          </div>
          <button className="btn order-input-btn" type="submit">
            {_shipType === "Send" ? "Gửi" : "Nhận"}
          </button>
        </div>
      </form>
    </div>
  );
}
