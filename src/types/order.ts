export default interface Order {
  id: string;
  name: string;
  quantity: number;
  date: string;
  account: string;
  unit: string | "cái" | "kg";
}

export interface OrderBlockChainType {
  id: bigint;
  name: string;
  quantity: number;
  date: string;
  account: string;
  unit: string;
}
