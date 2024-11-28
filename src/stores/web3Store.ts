import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { createStore } from "zustand/vanilla";

import { OriginAbi } from "@/types/common";
import Order, { OrderBlockChainType } from "@/types/order";
import Shipment, { ShipmentBlockChainType } from "@/types/shipment";

export type StoreState = {
  web3: Web3 | undefined;
  account: string | undefined;
  networkId: number | undefined;
  contract: Contract<OriginAbi> | undefined;

  orders: Order[] | undefined;
  shipments: Shipment[] | undefined;
};

export type StoreAction = {
  setWeb3: (web3: StoreState["web3"]) => void;
  setAccount: (account: StoreState["account"]) => void;
  setNetWorkId: (networkId: StoreState["networkId"]) => void;
  setContract: (contract: StoreState["contract"]) => void;

  setOrders: (orders: StoreState["orders"]) => void;
  setShipments: (shipments: StoreState["shipments"]) => void;

  getOrders: () => void;
  getShipments: () => void;
};

export type StoreType = StoreState & StoreAction;

export const defaultInitState: StoreState = {
  web3: undefined,
  account: undefined,
  networkId: undefined,
  contract: undefined,

  orders: undefined,
  shipments: undefined,
};

export const createWeb3Store = (initState: StoreState = defaultInitState) => {
  return createStore<StoreType>()((set, get) => ({
    ...initState,
    setWeb3: (web3: Web3 | undefined) => set(() => ({ web3 })),
    setAccount: (account: string | undefined) => set(() => ({ account })),
    setNetWorkId: (networkId: number | undefined) => set(() => ({ networkId })),
    setContract: (contract: Contract<OriginAbi> | undefined) => set(() => ({ contract })),

    setOrders: (orders: Order[] | undefined) => set(() => ({ orders })),
    setShipments: (shipments: Shipment[] | undefined) => set(() => ({ shipments })),

    // fetch Data
    getOrders: async () => {
      const { contract } = get();
      if (!contract) return;

      const orderCount: number = await contract.methods.orderCount().call();
      const orders: Order[] = [];
      for (let i = 1; i <= orderCount; i++) {
        const newOrder: OrderBlockChainType = await contract.methods.orders(i).call();
        orders.push({ ...newOrder, id: Number(newOrder.id).toString() });
      }
      set(() => ({ orders }));
    },

    getShipments: async () => {
      const { contract } = get();
      if (!contract) return;

      // Get shipments from contract
      const shipmentCount: number = await contract.methods.shipmentCount().call();
      const shipments: Shipment[] = [];
      for (let i = 1; i <= shipmentCount; i++) {
        const newShipment: ShipmentBlockChainType = await contract.methods.shipments(i).call();
        shipments.push({
          ...newShipment,
          id: Number(newShipment.id).toString(),
          latlong: JSON.parse(newShipment.latlong),
        });
      }
      set(() => ({ shipments }));
    },
  }));
};
