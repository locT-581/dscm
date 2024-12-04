import { MetaMaskProvider } from "web3";

/// <reference types="react-scripts" />

declare global {
  interface Window {
    ethereum: MetaMaskProvider;
    web3: Web3;
  }
}

declare module "@maptiler/leaflet-maptilersdk";
