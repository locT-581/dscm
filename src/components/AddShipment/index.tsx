"use client";

import { useEffect, useState } from "react";

import Origin from "../../../build/contracts/Origin.json";
import Web3 from "web3";
import Product from "@/types/product";
import Order from "@/types/order";
import getDate from "@/utils/getDate";
import { GeocodeResponse, Position } from "@/types/common";
import axiosClient from "@/services/axiosClient";

export interface IAddShipmentProps {
    addShipment: ({
        shipType,
        place,
        latlong,
        date,
        product,
        process,
    }: {
        shipType: string;
        place: string;
        latlong: string;
        date: string;
        product: string;
        process: string;
        account?: string;
    }) => void;
    shipType: string;
    onShipAdd: () => void;
}

export default function AddShipment({ addShipment, shipType, onShipAdd }: IAddShipmentProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [account, setAccount] = useState<string>("");

    const [date, setDate] = useState("");
    const [d, setD] = useState(true);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [place, setPlace] = useState<string>("");
    const [product, setProduct] = useState("");
    const [process, setProcess] = useState("");
    const [shipmentCount, setShipmentCount] = useState<number>(0);

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
            }
            if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider);
            } else {
                window.alert("Please use Metamask!");
            }
        };
        loadWeb3();
    }, []);

    useEffect(() => {
        const loadBlockchainData = async () => {
            const web3 = window.web3;
            //Load account
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            console.log(Origin.abi);
            const networkId = await web3.eth.net.getId();
            const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];
            if (networkData) {
                //Fetch contract
                const contract = new web3.eth.Contract(Origin.abi, networkData.address);
                const productCount = await contract.methods.productCount().call();
                const shipmentCount = await contract.methods.shipmentCount().call();
                console.log("🚀 ~ loadBlockchainData ~ shipmentCount:", shipmentCount);
                const orderCount = await contract.methods.orderCount().call();
                setShipmentCount(shipmentCount);
                //Load products
                for (let i = 1; i <= productCount; i++) {
                    const newProduct = await contract.methods.products(i).call();
                    setProducts((products) => [...products, newProduct]);
                }
                for (let i = 1; i <= orderCount; i++) {
                    const neworder = await contract.methods.orders(i).call();
                    setOrders((orders) => [...orders, neworder]);
                }
            } else {
                window.alert("Origin contract is not deployed to the detected network");
            }
        };
        loadBlockchainData();
    }, []);

    const orderName = orders.filter((obj) => obj.id.toString().includes(product)).map((order) => order.name);

    useEffect(() => {
        setDate(getDate());
        getLocation();
    }, [d]);

    const getCoordinates = async (position: Position) => {
        const accuracy = position.coords.accuracy;
        console.log("accuracy: ", accuracy);
        const lat = position.coords.latitude.toString();
        const long = position.coords.longitude.toString();
        setLatitude(lat);
        setLongitude(long);
        // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyA1NTVyRpS9yu9w8Otq1K3r-SwMJMvrhNY`;
        const url = `https://api.opencagedata.com/geocode/v1/json?key=d1cb18bbd8d04d70bd59b8d7178628cc&q=${lat}%2C${long}&pretty=1&language=vi`;
        axiosClient
            .get(url)
            .then((response) => response.data)
            .then((data: GeocodeResponse) => {
                const address = data.results[0].formatted;
                setPlace(address);
            });
    };

    const handleError = () => {
        alert("Geolocation API is not supported in your browser. Please enable Geolocation");
    };

    const getLocation = () => {
        console.log("object", navigator.geolocation);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoordinates, handleError, { enableHighAccuracy: true });
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setD(!d);
        const setLatlong = {
            id: (parseInt(shipmentCount + "") + 1).toString(),
            latitude: latitude,
            longitude: longitude,
        };
        const latlong = JSON.stringify(setLatlong);
        addShipment({ shipType, place, latlong, date, account, product, process });
    };

    return (
        <div className="center">
            <form className="ship-form" onSubmit={onSubmit}>
                <div className="form-header">
                    <h2>{shipType === "Shipment Sent" ? "Send Shipment" : "Receive Shipment"}</h2>
                    <button
                        className="btn form-close"
                        style={{ background: "red", fontSize: "14px" }}
                        onClick={onShipAdd}
                    >
                        X
                    </button>
                </div>
                <div className="product-center-form">
                    <div className="form-inputs">
                        <label className="order-label">Select Order</label>
                        <select
                            className="order-product"
                            required
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                        >
                            <option value="" disabled selected hidden></option>
                            {orders.map((order, i) => {
                                return (
                                    <option key={i} value={order.id}>
                                        ORDER # {order.id}: {order.name}{" "}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-inputs">
                        <label className="order-label">Select Production Process</label>
                        <select
                            className="order-product"
                            required
                            value={process}
                            onChange={(e) => setProcess(e.target.value)}
                        >
                            <option value="" disabled selected hidden></option>
                            {product !== ""
                                ? products
                                      .filter((obj) => orderName.includes(obj.name))
                                      .map((product) => product.process)
                                      .map((a, i) =>
                                          JSON.parse(a).map((process: string) => (
                                              <option key={i} value={process}>
                                                  {process}{" "}
                                              </option>
                                          ))
                                      )
                                : null}
                        </select>
                    </div>
                    <button className="btn order-input-btn" type="submit">
                        {shipType === "Shipment Sent" ? "Send" : "Receive"}
                    </button>
                </div>
            </form>
        </div>
    );
}
