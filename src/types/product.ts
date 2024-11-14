export default interface Product {
  id: string;
  name: string;
  image: string;
  process: string[];
  date: string;
  account: string;
}

export interface ProductBlockChain {
  id: bigint;
  name: string;
  image: string;
  process: string; // JSON.stringify(processes)
  date: string;
  account: string;
}
