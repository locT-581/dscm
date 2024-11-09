import { configureStore } from "@reduxjs/toolkit";
import rootReducers from "./reducers";

import { persistReducer } from "redux-persist";
// import storage from 'redux-persist/lib/storage';
import createFilter from "redux-persist-transform-filter";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: unknown, value: unknown) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const saveSubsetFilter = createFilter("userSlice", [
    "loading",
    "userInfo",
    "privateLeaderBoard",
    "affiliate",
    "inviteFriendInfo",
    "userMission",
]);

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["", ""],
    // transforms: [saveSubsetFilter],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
        // devTools: process.env.NODE_ENV === 'development',
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
