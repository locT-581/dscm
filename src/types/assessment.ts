import { CLIFormType, EnviroFormType, SocialFormType } from "./document";
import Process from "./process";
import Supplier from "./supplier";

export type AssessmentType = "Social Assessment" | "Life Cycle Inventory" | "Environmental Assessment";

export default interface Assessment {
  id: string;
  assessType: AssessmentType;
  date: string;
  account: Supplier;
  month: string;
  year: string;
  process?: Process;
  document: CLIFormType | EnviroFormType | SocialFormType;
}

export interface AssessmentOnChain {
  id: string;
  assessType: string;
  date: string;
  account: string;
  document: string;
  month: string;
  year: string;
  process: string;
}
