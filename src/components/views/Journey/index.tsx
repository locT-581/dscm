"use client";

import { useState, useEffect } from "react";

import { useLoadScript } from "@react-google-maps/api";

import Select from "react-select";
import TimeLine from "@/components/TimeLine";
import Product from "@/types/product";

import "leaflet/dist/leaflet.css";
import Map from "@/components/Map";
import { useWeb3Store } from "@/stores/storeProvider";

const Journey = () => {
  const { shipments, products } = useWeb3Store((state) => state);

  useEffect(() => {
    if (!!shipments) {
      shipments.forEach((shipment) => {
        setOrderIDs((orderIDs) => [...orderIDs, shipment.product.id]);
      });
    }
  }, [shipments]);

  /**
   * List of unique product IDs
   */
  const [orderIDs, setOrderIDs] = useState<string[]>([]);
  const [formProduct, setFormProduct] = useState<Product | undefined>(products?.[0]);

  const unique = [...new Set(orderIDs.map((item) => item))];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  if (!isLoaded) return null;

  return (
    <div className="journey-map flex flex-col items-center gap-4 pb-4">
      <div className="label-sel flex flex-col gap-2">
        <label>Chọn một đơn hàng để xem hành trình</label>
        <Select
          placeholder="Chọn sản phẩm"
          className="!z-[999] w-full max-w-[350px]"
          required
          closeMenuOnSelect={true}
          onChange={(e) => {
            setFormProduct(products?.find((p) => p.id === (e as { value: string; label: string }).value));
          }}
          options={unique
            ?.map((a) => {
              const p = products?.find((product) => product.id === a);
              return { value: p?.id ?? "", label: p?.name ?? "" };
            })
            .filter(Boolean)}
        />
      </div>

      <Map
        markers={
          shipments
            ?.filter((s) => s.product.id == formProduct?.id)
            .map((a) => ({ lat: Number(a.latlong.latitude), long: Number(a.latlong.longitude) })) ?? [
            { lat: 10, long: 105 },
          ]
        }
      />
      {
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
      }
      {formProduct && <TimeLine shipments={shipments ?? []} product={formProduct} />}
    </div>
  );
};

export default Journey;
