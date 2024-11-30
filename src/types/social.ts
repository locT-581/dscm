import { SocialFormType } from "./document";

export default interface Social {
  id: string;
  assessType: string;
  date: string;
  account: string;
  document: SocialFormType;
  month: string;
  year: string;
}

export interface SocialBlockChainType {
  id: bigint;
  assessType: string;
  date: string;
  account: string;
  document: string;
  month: string;
  year: string;
}
