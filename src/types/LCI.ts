import { CLIFormType } from "./document";
import Product from "./product";

export default interface LCI {
  id: string;
  assessType: string;
  date: string;
  account: string;
  document: CLIFormType;
  month: string;
  year: string;
  process: string;
  product: Product;
}

export interface LCIBlockchain {
  id: bigint;
  assessType: string;
  date: string;
  account: string;
  document: string;
  month: string;
  year: string;
  process: string;
  product: string;
}
