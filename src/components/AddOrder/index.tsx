"use client";

import Web3 from "web3";
import { useEffect, useState } from "react";

import Origin from "../../../build/contracts/Origin.json";

import Product from "@/types/product";
import getDate from "@/utils/getDate";

export interface IAddOrderProps {
  addOrder: ({ name, quantity, unit, date }: { name: string; quantity: string; unit: string; date: string }) => void;
  onAdd: () => void;
}

export default function AddOrder({ addOrder, onAdd }: IAddOrderProps) {
  const [d, setD] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

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
      const networkId = await web3.eth.net.getId();
      const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];
      if (networkData) {
        //Fetch contract
        const contract = new web3.eth.Contract(Origin.abi, networkData.address);
        const productCount = await contract.methods.productCount().call();
        for (let i = 1; i <= productCount; i++) {
          const newProduct = await contract.methods.products(i).call();
          setProducts((products) => [...products, newProduct]);
        }
      } else {
        window.alert("Origin contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, []);

  useEffect(() => {
    const date = getDate();
    setDate(date);
  }, [d]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name);
    console.log(quantity);
    console.log(unit);
    setD("now");
    addOrder({ name, quantity, unit, date });
  };

  return (
    <div className="center">
      <form className="order-form" onSubmit={onSubmit}>
        <div className="form-header">
          <h2>Add Order</h2>
          <button className="btn form-close" style={{ background: "red", fontSize: "14px" }} onClick={onAdd}>
            X
          </button>
        </div>
        <div className="product-center-form">
          <div className="form-inputs">
            <label className="order-label">Select Product</label>
            <select
              className="order-product"
              required
              value={name}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            >
              <option value="" disabled hidden></option>
              {products.map((product, i) => {
                return (
                  <option key={i} value={product.name}>
                    {product.name}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-inputs">
            <label className="order-label">Product Quantity and Unit</label>
            <input
              type="number"
              className="quantity"
              required
              placeholder="Enter Product Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select className="unit" required value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="" disabled hidden>
                Select Unit
              </option>
              <option value="kg">kg</option>
              <option value="items">items</option>
            </select>
          </div>
          <button className="btn order-input-btn" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
