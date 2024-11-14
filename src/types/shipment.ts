import { LatLong } from "./common";

export default interface Shipment {
  id: BigInt;
  shipType: string;
  place: string;
  latlong: LatLong;
  date: string;
  account: string;
  product: string;
  process: string;
  latitude: number;
  longitude: number;
}
