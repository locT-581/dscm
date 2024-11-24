"use client";

import { useStore } from "zustand";
import { type ReactNode, createContext, useRef, useContext } from "react";

import { type StoreType, createWeb3Store } from "@/stores/web3Store";

export type Web3StoreApi = ReturnType<typeof createWeb3Store>;

export const Web3StoreContext = createContext<Web3StoreApi | undefined>(undefined);

export interface Web3StoreProviderProps {
  children: ReactNode;
}

export const Web3StoreProvider = ({ children }: Web3StoreProviderProps) => {
  const storeRef = useRef<Web3StoreApi>();
  if (!storeRef.current) {
    storeRef.current = createWeb3Store();
  }

  return <Web3StoreContext.Provider value={storeRef.current}>{children}</Web3StoreContext.Provider>;
};

export const useWeb3Store = <T,>(selector: (store: StoreType) => T): T => {
  const counterStoreContext = useContext(Web3StoreContext);

  if (!counterStoreContext) {
    throw new Error(`useWeb3Store must be used within Web3StoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
