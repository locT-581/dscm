export default interface LCI {
  id: StringConstructor;
  assessType: string;
  date: string;
  account: string;
  document: string;
  month: string;
  year: string;
  process: string;
  product: string;
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
