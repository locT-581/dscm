import Process from "./process";
import Product from "./product";
import Supplier from "./supplier";
import Unit from "./unit";

export type OrderStatus = "Done" | "Processing" | "Waiting" | "Late" | "WaitingReceive";
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
  name: string;
}

export interface OrderFireStore {
  id: string;
  productID: string;
  process: {
    process: Process;
    supplier?: Supplier | null;
    status: OrderStatus;
    expectedFinishDate: string;
    actualFinishDate: string | null;
  }[];
  quantity: number;
  date: string;
  account: string;
  unitID: string;
  statusProcessID: string;
}

export default interface Order {
  id: string;
  product: Product;
  process: {
    process: Process;
    supplier?: Supplier | null;
    status: OrderStatus;
    expectedFinishDate: string;
    actualFinishDate: string | null;
  }[];
  quantity: number;
  date: string;
  account: string;
  unit: Unit;
  statusProcess: Process | null | "Done"; // status of process
}
