import { Product } from "./product";
import Unit from "./unit";

export interface OrderOnChain {
  id: string;
  /**
   * name of product in onchain
   */
  productID: string;
  quantity: number;
  date: string;
  account: string;
  unit: Unit;
}

export interface OrderBlockChainType {
  id: bigint;
  /**
   * name of product in onchain
   */
  productID: string;
  quantity: number;
  date: string;
  account: string;
  unit: string;
}

export default interface Order extends OrderOnChain {
  id: string;
  status: string;
  product: Product;
}
