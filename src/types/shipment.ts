import { LatLong } from "./common";
import Process from "./process";
import Product from "./product";
import Supplier from "./supplier";

export interface ShipmentOnChain {
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

export default interface Shipment {
  id: string;
  shipType: string;
  place: string;
  latlong: LatLong;
  date: string;
  account: string;
  product: Product; // Product ID
  process: Process;
  latitude: number;
  longitude: number;
  supplier: Supplier;
}
