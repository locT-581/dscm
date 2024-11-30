import Process from "./process";

type Role = "Focal company" | "Supplier";
export default interface Supplier {
  role?: Role;
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
