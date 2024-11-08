import Product from "./product";

export default interface Shipment {
    id: string;
    shipType: string;
    place: string;
    latlong: string;
    date: string;
    account: string;
    product: Product;
    process: string;
}
