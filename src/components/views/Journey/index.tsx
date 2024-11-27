"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Web3 from "web3";

import { useLoadScript } from "@react-google-maps/api";

import { Origin } from "@/lib/abis";
import Sidebar from "@/components/Sidebar";
import TimeLine from "@/components/TimeLine";
import Product from "@/types/product";
import Order, { OrderBlockChainType } from "@/types/order";
import Shipment, { ShipmentBlockChainType } from "@/types/shipment";

import "leaflet/dist/leaflet.css";
import Map from "@/components/Map";

const Journey = () => {
  const web3Instance = useRef<Web3 | null>(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        web3Instance.current = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" });
      }
      if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Please use Metamask!");
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3Instance.current) return;

      const networkId = await web3Instance.current.eth.net.getId();
      const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];
      if (networkData) {
        //Fetch contract
        const contract = new web3Instance.current.eth.Contract(Origin.abi, networkData.address);
        const orderCount = Number(await contract.methods.orderCount().call());
        //Load orders
        for (let i = 1; i <= orderCount; i++) {
          const newOrder: OrderBlockChainType = await contract.methods.orders(i).call();
          setOrders((orders) => [...orders, { ...newOrder, id: Number(newOrder.id).toString() }]);
        }
        const shipmentCount = Number(await contract.methods.shipmentCount().call());
        //Load shipments
        for (let i = 1; i <= shipmentCount; i++) {
          const newShipment: ShipmentBlockChainType = await contract.methods.shipments(i).call();

          setShipment((shipments) => [
            ...shipments,
            {
              ...newShipment,
              id: Number(newShipment.id).toString(),
              latlong: JSON.parse(newShipment.latlong.toString()),
            },
          ]);
          setOrderIDs((shipments) => [...shipments, newShipment.product]);
          setLatlong((latlong) => [...latlong, JSON.parse(newShipment.latlong)]);
        }
      } else {
        window.alert("Origin contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  const [shipments, setShipment] = useState<Shipment[]>([]);
  const [orderIDs, setOrderIDs] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [formProduct, setFormProduct] = useState<Product | undefined>();
  const [latlong, setLatlong] = useState<Shipment["latlong"][]>([]);

  const newShipment = shipments.map((t1) => ({ ...t1, ...latlong.find((t2) => t2.id === t1.id) }));

  const unique = [...new Set(orderIDs.map((item) => item))];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const mapContainerStyle = {
    width: "600px",
    height: "300px",
    borderRadius: "20px",
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };
  const center = {
    lat: 41.1122,
    lng: 29.02,
  };

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) return null;

  return (
    <div>
      <Sidebar />
      <div className="journey-map">
        <div className="timeline-header">
          <label>Select a Product to View the Journey</label>
          <select
            value={formProduct?.id}
            onChange={(e) => setFormProduct(orders.find((order) => order.id === e.target.value))}
          >
            <option value="" disabled hidden></option>
            {unique.map((a, i) => {
              return (
                <option key={i} value={a}>
                  ORDER # {a}: {orders.filter((obj) => obj.id.includes(a)).map((o) => o.name)}{" "}
                </option>
              );
            })}
          </select>
        </div>
        <Map
          markers={newShipment
            // .filter((obj) => obj.product.includes(formProduct.name))
            .map((a) => ({ lat: Number(a.latitude), long: Number(a.longitude) }))}
        />

        {!!!formProduct ? (
          <div id="map"></div>
        ) : (
          // <GoogleMap
          //   id="map"
          //   mapContainerStyle={mapContainerStyle}
          //   zoom={11}
          //   center={center}
          //   options={options}
          //   onLoad={onMapLoad}
          // >
          //   {newShipment
          //     .filter((obj) => obj.product.includes(formProduct))
          //     .map((a) => (
          //       <Marker key={a.id} position={{ lat: Number(a.latitude), lng: Number(a.longitude) }} />
          //     ))}
          // </GoogleMap>
          <Map
            markers={newShipment
              // .filter((obj) => obj.product.includes(formProduct.name))
              .map((a) => ({ lat: Number(a.latitude), long: Number(a.longitude) }))}
          />
        )}
      </div>
      <TimeLine shipments={shipments} product={formProduct} />
    </div>
  );
};

export default Journey;
