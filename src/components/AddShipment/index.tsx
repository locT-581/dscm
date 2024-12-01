"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import getDate from "@/utils/getDate";
import { GeocodeResponse, Position, ShipType } from "@/types/common";
import axiosClient from "@/services/axiosClient";
import { useWeb3Store } from "@/stores/storeProvider";
import Order from "@/types/order";
import CustomizedSteppers from "../HorizontalStepper";
import Button from "@/UI/Button";
import CloseIcon from "@mui/icons-material/Close";
export interface IAddShipmentProps {
  shipType: ShipType;
  onShipAdd: () => void;
}

export default function AddShipment({ shipType: _shipType, onShipAdd }: IAddShipmentProps) {
  const { orders, contract, account, user } = useWeb3Store((state) => state);

  const animatedComponents = makeAnimated();

  const [date, setDate] = useState("");
  const [d, setD] = useState(true);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // address of the current location
  const [place, setPlace] = useState<string>("");
  const [order, setOrder] = useState<Order>();

  const [shipmentCount, setShipmentCount] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if (!!!contract) return;
      const shipmentCount = Number(await contract.methods.shipmentCount().call());
      setShipmentCount(shipmentCount);
    })();
  }, [contract]);

  // const orderName = orders?.filter((obj) => obj.id.toString().includes(product)).map((order) => order.name);

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

  const addShipment = ({
    shipType,
    place,
    latlong,
    date,
    product,
    process,
  }: {
    shipType: string;
    place: string;
    latlong: string;
    date: string;
    product: string;
    process: string;
    account?: string;
  }) => {
    contract?.methods
      .addShipment(shipType, place, latlong, date, product, process)
      .send({ from: account })
      .once("receipt", () => {
        window.location.reload();
      });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!!order || !!!user) return;
    setD(!d);
    const setLatlong = {
      id: (parseInt(shipmentCount + "") + 1).toString(),
      latitude: latitude,
      longitude: longitude,
    };
    const latlong = JSON.stringify(setLatlong);
    addShipment({
      shipType: _shipType,
      place,
      latlong,
      date,
      account,
      product: order.product.id,
      process: order.process.find((p) => p.supplier?.id === user.id)?.process.id ?? "",
    });
  };

  // useEffect(() => {
  //   if (!!order) {
  //     setSteps(
  //       order.process.map((process) => ({
  //         process,
  //         supplier: null,
  //       }))
  //     );
  //   }
  // }, [order]);

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="!text-[#023047] bg-[#fdfdfd] flex flex-col justify-between gap-4 w-[65vw] border border-[#ab9797] rounded-xl p-8 ml-[5%]"
      >
        <div className="w-full flex justify-between items-center">
          <h4 className="text-3xl font-semibold">{`${_shipType === "Send" ? "Gửi" : "Nhận"} đơn hàng`}</h4>
          <CloseIcon
            className="cursor-pointer"
            fontSize="small"
            onClick={() => {
              onShipAdd();
            }}
          />
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 w-[60%]">
            <label htmlFor="processes-product" className="font-semibold">
              Chọn đơn hàng
            </label>

            <Select
              className="!z-[999]"
              required
              closeMenuOnSelect={true}
              components={animatedComponents}
              onChange={(e) => {
                setOrder(orders?.find((order) => order.id === (e as { value: string; label: string })?.value));
              }}
              options={orders
                ?.map((order) => ({ value: order.id, label: `Đơn hàng #${order.id}: ${order.product?.name}` }))
                .filter(Boolean)}
            />
          </div>
          {order && (
            <div className="flex flex-col gap-3 ">
              <label htmlFor="processes-product" className="font-semibold">
                Giai đoạn sản xuất
              </label>

              <CustomizedSteppers
                steps={order.process.map((s) => ({
                  icon: s.process.image,
                  label: s.process.name,
                  des: s.supplier?.name ?? "",
                }))}
                activeStep={
                  order.process.findIndex((p) => p.supplier?.id === user?.id) === -1
                    ? -1
                    : order.process.findIndex((p) => p.supplier?.id === user?.id)
                }
              />
            </div>
          )}
        </div>

        <Button disabled={!!!order} className="self-end w-[20%]" type="submit">
          {_shipType === "Send" ? "Gửi" : "Nhận"}
        </Button>
      </form>
    </>
  );
}
