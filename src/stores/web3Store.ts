import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { createStore } from "zustand/vanilla";

import { OriginAbi } from "@/types/common";
import Order, { OrderBlockChainType, OrderFireStore } from "@/types/order";
import Shipment, { ShipmentBlockChainType } from "@/types/shipment";
import Product, { ProductBlockChain } from "@/types/product";
import { units } from "@/utils/const";
import { getAllOrders, getAllProcesses, getAllProducts, getAllSupplier } from "@/app/apis";
import Process from "@/types/process";
import Supplier from "@/types/supplier";
import Assessment, { AssessmentOnChain, AssessmentType } from "@/types/assessment";

export type StoreState = {
  web3: Web3 | undefined;
  account: string | undefined;
  networkId: number | undefined;
  contract: Contract<OriginAbi> | undefined;
  assessmentContract: Contract<OriginAbi> | undefined;
  loading: boolean;

  user: Supplier | undefined;

  orders: Order[] | undefined;
  shipments: Shipment[] | undefined;
  products: Product[] | undefined;
  processes: Process[] | undefined;
  suppliers: Supplier[] | undefined;

  LCIs: Assessment[] | undefined;
  enviros: Assessment[] | undefined;
  socials: Assessment[] | undefined;

  tempInitOrder: Order | undefined;
};

export type StoreAction = {
  setWeb3: (web3: StoreState["web3"]) => void;
  setAccount: (account: StoreState["account"]) => void;
  setNetWorkId: (networkId: StoreState["networkId"]) => void;
  setContract: (contract: StoreState["contract"]) => void;
  setAssessmentContract: (contract: StoreState["assessmentContract"]) => void;
  setTempInitOrder: (order: StoreState["tempInitOrder"]) => void;

  setOrders: (orders: StoreState["orders"]) => void;
  setShipments: (shipments: StoreState["shipments"]) => void;
  setProducts: (products: StoreState["products"]) => void;
  setUser: (user: StoreState["user"]) => void;
  setLCIs: (LCIs: StoreState["LCIs"]) => void;
  setLoading: (loading: StoreState["loading"]) => void;
  getOrders: () => Promise<void>;
  getShipments: () => Promise<void>;
  getProducts: () => Promise<void>;
  getProcess: () => Promise<void>;
  getSuppliers: () => Promise<void>;

  getCLIs: () => Promise<void>;
  getEnviros: () => Promise<void>;
  getSocials: () => Promise<void>;
};

export type StoreType = StoreState & StoreAction;

export const defaultInitState: StoreState = {
  loading: false,
  web3: undefined,
  account: undefined,
  networkId: undefined,
  contract: undefined,
  tempInitOrder: undefined,

  user: undefined,

  orders: undefined,
  shipments: undefined,
  products: undefined,
  processes: undefined,
  suppliers: undefined,

  LCIs: undefined,
  enviros: undefined,
  socials: undefined,
  assessmentContract: undefined,
};

export const createWeb3Store = (initState: StoreState = defaultInitState) => {
  return createStore<StoreType>()((set, get) => ({
    ...initState,
    setWeb3: (web3: Web3 | undefined) => set(() => ({ web3 })),
    setAccount: (account: string | undefined) => set(() => ({ account: account?.toLocaleLowerCase() })),
    setNetWorkId: (networkId: number | undefined) => set(() => ({ networkId })),
    setContract: (contract: Contract<OriginAbi> | undefined) => set(() => ({ contract })),
    setAssessmentContract: (contract: Contract<OriginAbi> | undefined) => set(() => ({ assessmentContract: contract })),
    setTempInitOrder: (order: Order | undefined) => set(() => ({ tempInitOrder: order })),
    setOrders: (orders: Order[] | undefined) => set(() => ({ orders })),
    setShipments: (shipments: Shipment[] | undefined) => set(() => ({ shipments })),
    setProducts: (products: Product[] | undefined) => set(() => ({ products })),
    setUser: (user: Supplier | undefined) => set(() => ({ user })),
    setLCIs: (LCIs: Assessment[] | undefined) => set(() => ({ LCIs })),
    setLoading: (loading: boolean) => set(() => ({ loading })),

    // fetch Data
    getOrders: async () => {
      const { contract, products, user } = get();
      if (!contract) return;
      set(() => ({ loading: true }));

      const allOrders: OrderFireStore[] = await getAllOrders();

      const orderCount: number = await contract.methods.orderCount().call();
      const orders: Order[] = [];

      for (let i = 1; i <= orderCount; i++) {
        const orderBlockchain: OrderBlockChainType = await contract.methods.orders(i).call();

        const orderOffChain: OrderFireStore | undefined = allOrders.find(
          (order) => order.id == Number(orderBlockchain.id).toString()
        );

        const newOrder: Order = {
          ...orderBlockchain,
          id: Number(orderBlockchain.id).toString(),
          unit: units.find((unit) => unit.id == orderBlockchain.unit) ?? { id: "", name: "" },
          product: products?.find((product) => product.id == orderBlockchain.name) as Product,
          process:
            orderOffChain?.process.map((process) => ({
              process: process.process,
              supplier: process.supplier,
              status: process.status,
              expectedFinishDate: process.expectedFinishDate,
              actualFinishDate: process.actualFinishDate,
            })) ?? [],
          statusProcess:
            orderOffChain?.statusProcessID != "Done"
              ? get().processes?.find((p) => p.id == orderOffChain?.statusProcessID) ?? null
              : "Done",
        };

        if (!!orderOffChain) {
          orders.push(newOrder);
        }
      }

      let filterOrder: Order[] = [];
      if (user?.role == "Supplier") {
        filterOrder = orders.filter((order) =>
          order.process.some((p) => {
            return p.supplier?.id == user?.id;
          })
        );
      } else if (user?.role == "Focal company") {
        filterOrder = orders;
      }
      console.log("🚀 ~ getOrders: ~ filterOrder:", filterOrder);
      set(() => ({ loading: false }));
      set(() => ({ orders: filterOrder }));
    },

    getShipments: async () => {
      const { contract, products, processes, user } = get();
      if (!contract) return;

      const shipmentCount: number = await contract.methods.shipmentCount().call();
      const shipments: Shipment[] = [];

      for (let i = 1; i <= shipmentCount; i++) {
        const newShipment: ShipmentBlockChainType = await contract.methods.shipments(i).call();
        shipments.push({
          ...newShipment,
          id: Number(newShipment.id).toString(),
          latlong: JSON.parse(newShipment.latlong),
          product: products?.find((product) => product.id == newShipment.product) as Product,
          process: processes?.find((process) => process.id == newShipment.process) as Process,
          supplier: get().suppliers?.find((supplier) => {
            console.log(supplier.account.toLocaleLowerCase() == newShipment.account.toLocaleLowerCase());
            return supplier.account.toLocaleLowerCase() == newShipment.account.toLocaleLowerCase();
          }) as Supplier,
        });
      }

      if (user?.role == "Supplier") {
        set(() => ({
          shipments: shipments.filter((sh) => sh.supplier.id == user.id),
        }));
      } else {
        set(() => ({ shipments }));
      }
      console.log("🚀 ~ getShipments: ~ shipments:", shipments);
    },

    getProducts: async () => {
      const { contract } = get();
      if (!contract) return;
      const allProduct = await getAllProducts();
      const productCount: number = await contract.methods.productCount().call();

      const products: Product[] = [];
      for (let i = 1; i <= productCount; i++) {
        const productOnchain: ProductBlockChain = await contract.methods.products(i).call();
        const productOffChain = allProduct.find(
          (product) => product.offChainId == Number(productOnchain.id).toString()
        );
        const newProduct: Product = {
          ...productOnchain,
          ...productOffChain,
          id: Number(productOnchain.id).toString(),
          process: productOffChain?.process ?? [],
          unit: productOffChain?.unit ?? { id: "", name: "" },
        };

        products.push(newProduct);
      }
      console.log("🚀 ~ getProducts: ~ products:", products);
      set(() => ({ products: products.filter((p) => p.process.length != 0 && p.name != "45") }));
    },

    getProcess: async () => {
      const processes = await getAllProcesses();
      set(() => ({ processes }));
    },

    getSuppliers: async () => {
      const suppliers = await getAllSupplier();
      console.log("🚀 ~ getSuppliers: ~ suppliers:", suppliers);
      set(() => ({ suppliers }));
    },

    getCLIs: async () => {
      const { assessmentContract, user } = get();
      if (!assessmentContract) return;

      const LCICount: number = await assessmentContract.methods.LCICount().call();
      const LCIs: Assessment[] = [];

      for (let i = 1; i <= LCICount; i++) {
        const newLCI: AssessmentOnChain = await assessmentContract.methods.LCIs(i).call();
        LCIs.push({
          ...newLCI,
          id: Number(newLCI.id).toString(),
          document: {
            ...JSON.parse(newLCI.document),
            batch: JSON.parse(newLCI.document).batch ?? JSON.parse(newLCI.document)["lô"],
            product: get().products?.find((p) => p.id == JSON.parse(newLCI.document).product),
          },
          assessType: newLCI.assessType as AssessmentType,
          process: get().processes?.find((p) => p.id == newLCI.process) as Process,
          account: get().suppliers?.find(
            (s) => s.account.toLocaleLowerCase() == newLCI.account.toLocaleLowerCase()
          ) as Supplier,
        });
      }

      let temp;
      if (user?.role == "Supplier") {
        temp = LCIs.filter((lci) => {
          console.log("lsls000", lci, lci.account.account.toLowerCase(), user?.account?.toLowerCase());
          return lci.account.account.toLowerCase() === user?.account?.toLowerCase();
        });
      } else {
        temp = LCIs;
      }

      console.log("🚀 ~ getCLIs: ~ LCIs:", LCIs);
      set(() => ({ LCIs: temp }));
    },

    getEnviros: async () => {
      const { assessmentContract, user } = get();
      if (!assessmentContract) return;

      const enviroCount: number = await assessmentContract.methods.enviroCount().call();
      const enviros: Assessment[] = [];

      for (let i = 1; i <= enviroCount; i++) {
        const newEnviro: AssessmentOnChain = await assessmentContract.methods.enviros(i).call();
        enviros.push({
          ...newEnviro,
          id: Number(newEnviro.id).toString(),
          document: {
            ...JSON.parse(newEnviro.document),
            batch: JSON.parse(newEnviro.document).batch ?? JSON.parse(newEnviro.document)["lô"],
          },
          assessType: newEnviro.assessType as AssessmentType,
          process: get().processes?.find((p) => p.id == newEnviro.process) as Process,
          account: get().suppliers?.find(
            (s) => s.account.toLocaleLowerCase() == newEnviro.account.toLocaleLowerCase()
          ) as Supplier,
        });
      }

      let temp;
      if (user?.role == "Supplier") {
        temp = enviros.filter((enviro) => enviro.account.account.toLowerCase() === user?.account?.toLowerCase());
      } else {
        temp = enviros;
      }
      set(() => ({ enviros: temp }));
    },
    getSocials: async () => {
      const { assessmentContract, user } = get();
      if (!assessmentContract) return;

      const socialCount: number = await assessmentContract.methods.socialCount().call();
      const socials: Assessment[] = [];

      for (let i = 1; i <= socialCount; i++) {
        const newSocial: AssessmentOnChain = await assessmentContract.methods.socials(i).call();
        socials.push({
          ...newSocial,
          id: Number(newSocial.id).toString(),
          document: {
            ...JSON.parse(newSocial.document),
            product: get().products?.find((p) => p.id == JSON.parse(newSocial.document).product),
            suppliers: get().suppliers?.find((s) => s.id == JSON.parse(newSocial.document).suppliers),
            batch: JSON.parse(newSocial.document).batch ?? JSON.parse(newSocial.document)["lô"],
          },
          assessType: newSocial.assessType as AssessmentType,
          process: get().processes?.find((p) => p.id == newSocial.process) as Process,
          account: get().suppliers?.find(
            (s) => s.account.toLocaleLowerCase() == newSocial.account.toLocaleLowerCase()
          ) as Supplier,
        });
      }

      let temp;
      if (user?.role == "Supplier") {
        temp = socials.filter((social) => social.account.account.toLowerCase() === user?.account?.toLowerCase());
      } else {
        temp = socials;
      }
      set(() => ({ socials: temp }));
    },
  }));
};
