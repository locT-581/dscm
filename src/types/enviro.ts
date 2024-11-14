export default interface Enviro {
  id: string;
  assessType: string;
  date: string;
  account: string;
  document: Document;
  month: string;
  year: string;
}

export interface ContractDocument {
  id: string;
  energy: string;
  renewenergy: string;
  water: string;
  waterrec: string;
  material: string;
  materialrec: string;
  land: string;
  bio: string;
  sensitive: string;
  ghg: string;
  waterpol: string;
  waterpoltype: string;
  landpol: string;
  landpoltype: string;
  air: string;
  hazmat: string;
  hazwaste: string;
  solidwaste: string;
  solidwasterec: string;
  solidwastedes: string;
  waterwaste: string;
  waterwasterec: string;
  waterwastedes: string;
  productrec: string;
  ecolabel: string;
  products: string;
  envirostand: string;
  clean: string;
  envirosus: string;
  suppliers: string;
}
