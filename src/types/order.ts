import Process from "./process";
import Product from "./product";
import Supplier from "./supplier";
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
  name: string;
}

export interface OrderFireStore {
  id: string;
  productID: string;
  process: {
    processID: string;
    supplierID?: string | null;
    status: "Done" | "Processing";
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
    status: "Done" | "Processing";
  }[];
  quantity: number;
  date: string;
  account: string;
  unit: Unit;
  statusProcess: Process | null | "Done"; // status of process
}
