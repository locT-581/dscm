"use client";

import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import L, { Map as MapType } from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

import styles from "./index.module.css";
import { Position } from "@/types/common";

// import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";

interface MapProps {
  markers: { lat: number; long: number }[];
}
const Map = ({ markers }: MapProps) => {
  console.log("🚀 ~ Map ~ markers:", markers);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapType | null>(null);

  const [zoom] = useState(12);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: Position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          setLatitude(lat);
          setLongitude(long);
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (map.current || latitude == undefined || longitude == undefined) return;

    map.current = new L.Map(mapContainer.current ?? "", {
      center: L.latLng(latitude, longitude),
      zoom: zoom,
    });

    markers.forEach((marker) => {
      L.marker([marker.lat, marker.long]).addTo(map.current!);
    });

    const mtLayer = new MaptilerLayer({
      apiKey: process.env.NEXT_PUBLIC_MAP_TILER_API_KEY ?? "",
    });
    mtLayer.addTo(map.current);
  }, [zoom, latitude, longitude]);

  return (
    <div className={styles.mapWrap}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
};

export default Map;
