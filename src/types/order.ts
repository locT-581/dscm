export default interface Order {
  id: bigint;
  name: string;
  quantity: number;
  date: string;
  account: string;
  unit: string;
}
