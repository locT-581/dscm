interface Window {
  ethereum?: {
    request: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>;
    enable: () => Promise<void>;
  };
  web3?: Web3;
}

declare module "@maptiler/leaflet-maptilersdk";
