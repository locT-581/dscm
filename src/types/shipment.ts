import { LatLong } from "./common";

export default interface Shipment {
  id: string;
  shipType: string;
  place: string;
  latlong: LatLong;
  date: string;
  account: string;
  product: string; // Product ID
  process: string;
  latitude: number;
  longitude: number;
}

export interface ShipmentBlockChainType {
  id: bigint;
  shipType: string;
  place: string;
  latlong: string;
  date: string;
  account: string;
  product: string; // Product ID
  process: string;
  latitude: number;
  longitude: number;
}
