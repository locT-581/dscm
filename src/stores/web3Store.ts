import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { createStore } from "zustand/vanilla";

import { OriginAbi } from "@/types/common";
import Order, { OrderBlockChainType } from "@/types/order";
import Shipment, { ShipmentBlockChainType } from "@/types/shipment";
import Product, { ProductBlockChain } from "@/types/product";
import { units } from "@/utils/const";
import { getAllProcesses, getAllProducts } from "@/app/apis";
import Process from "@/types/process";

export type StoreState = {
  web3: Web3 | undefined;
  account: string | undefined;
  networkId: number | undefined;
  contract: Contract<OriginAbi> | undefined;

  orders: Order[] | undefined;
  shipments: Shipment[] | undefined;
  products: Product[] | undefined;
  processes: Process[] | undefined;
};

export type StoreAction = {
  setWeb3: (web3: StoreState["web3"]) => void;
  setAccount: (account: StoreState["account"]) => void;
  setNetWorkId: (networkId: StoreState["networkId"]) => void;
  setContract: (contract: StoreState["contract"]) => void;

  setOrders: (orders: StoreState["orders"]) => void;
  setShipments: (shipments: StoreState["shipments"]) => void;
  setProducts: (products: StoreState["products"]) => void;

  getOrders: () => Promise<void>;
  getShipments: () => Promise<void>;
  getProducts: () => Promise<void>;
  getProcess: () => Promise<void>;
};

export type StoreType = StoreState & StoreAction;

export const defaultInitState: StoreState = {
  web3: undefined,
  account: undefined,
  networkId: undefined,
  contract: undefined,

  orders: undefined,
  shipments: undefined,
  products: undefined,
  processes: undefined,
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
    setProducts: (products: Product[] | undefined) => set(() => ({ products })),

    // fetch Data
    getOrders: async () => {
      const { contract, products } = get();
      if (!contract || !!!products) return;

      const orderCount: number = await contract.methods.orderCount().call();
      const orders: Order[] = [];
      for (let i = 1; i <= orderCount; i++) {
        const orderBlockchain: OrderBlockChainType = await contract.methods.orders(i).call();
        const newOrder: Order = {
          ...orderBlockchain,
          id: Number(orderBlockchain.id).toString(),
          unit: units.find((unit) => unit.id == orderBlockchain.unit) ?? { id: "", name: "" },
          product: products?.find((product) => product.id == orderBlockchain.productID) as Product,
          status: "Đã tạo",
        };

        orders.push(newOrder);
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

    getProducts: async () => {
      const { contract, processes } = get();
      if (!contract || !!!processes) return;

      const allProduct = await getAllProducts();

      const productCount: number = await contract.methods.productCount().call();
      const products: Product[] = [];
      for (let i = 1; i <= productCount; i++) {
        const productOnchain: ProductBlockChain = await contract.methods.products(i).call();
        const productOffChain = allProduct.find(
          (product) => product.offChainId == Number(productOnchain.id).toString()
        );
        console.log("🚀 ~ getProducts: ~ productOffChain:", productOffChain);

        const newProduct: Product = {
          ...productOnchain,
          ...productOffChain,
          id: Number(productOnchain.id).toString(),
          process: productOffChain?.process ?? [],
          unit: productOffChain?.unit ?? { id: "", name: "" },
        };

        products.push(newProduct);
      }
      set(() => ({ products }));
    },

    getProcess: async () => {
      const processes = await getAllProcesses();
      set(() => ({ processes }));
    },
  }));
};
