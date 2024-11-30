import Process from "./process";
import Unit from "./unit";

export interface ProductOnChain {
  id: string;
  name: string;
  image: string;
  processIDs: string[];
  date: string;
  account: string;
}

export interface ProductOffChain {
  process: Process[];
  unit: Unit;
}

export interface ProductBlockChain {
  id: bigint;
  name: string;
  image: string;
  process: string; // JSON.stringify(processes) - array of id of processes
  date: string;
  account: string;
}

// export default interface Product extends ProductOffChain, ProductOnChain {}

export default interface Product {
  id: string;
  name: string;
  image: string;
  process: Process[];
  unit: Unit;
  date: string;
  account: string;
}
