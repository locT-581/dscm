import Process from "./process";

export default interface Supplier {
  id: string;
  name: string;
  productsProcesses: Process;
  type: "Doanh nghiệp" | "Cá nhân";
  address: string;
  account: string;
  phoneNumber?: string;
  email?: string;
  taxCode?: string;
  website?: string;
}
