import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import OrderType from "@/types/order";
import { LatLong, OriginAbi } from "@/types/common";
import Shipment from "@/types/shipment";

interface InitState {
    error?:
        | {
              message: string;
              code: number;
          }
        | undefined;
    loading?: boolean;
    account: string | undefined;
    web3instance: unknown;

    contract: Contract<OriginAbi> | undefined;
    orders: OrderType[] | undefined;
    latlong: LatLong[] | undefined;
    shipments: Shipment[] | undefined;
}

const initialState: InitState = {
    error: undefined,
    loading: true,

    account: undefined,
    web3instance: undefined,

    contract: undefined,

    orders: undefined,
    latlong: undefined,
    shipments: undefined,
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<{ message: string; code: number }>) {
            state.error = action.payload;
        },
        setAccount(state, action: PayloadAction<string>) {
            state.account = action.payload;
        },
        setWeb3Instance(state, action: PayloadAction<Web3>) {
            state.web3instance = action.payload;
        },
        setContract(state, action) {
            state.contract = action.payload;
        },
        setOrders(state, action) {
            state.orders = action.payload;
        },
        setLatlong(state, action) {
            state.latlong = action.payload;
        },
        setShipments(state, action) {
            state.shipments = action.payload;
        },
    },
    extraReducers: () => {},
});

const { actions, reducer } = commonSlice;
export const { setError, setLoading, setAccount, setWeb3Instance, setContract, setOrders, setLatlong, setShipments } =
    actions;
export default reducer;
