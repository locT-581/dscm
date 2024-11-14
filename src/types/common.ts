import Origin from "../../build/contracts/Origin.json";

export interface Position {
    coords: {
        accuracy: number;
        latitude: number;
        longitude: number;
    };
}

export interface GeocodeResponse {
    results: {
        formatted: string;
    }[];
}

export interface LatLong {
    id: string;
    latitude: number;
    longitude: number;
}

export type OriginAbi = typeof Origin.abi; // Kiểu này sẽ tự động lấy kiểu của mảng ABI từ file JSON
