"use client";

import { useEffect, useRef, useState } from "react";

import Origin from "../../../../build/contracts/Origin.json";
import ProductType from "@/types/product";
import Web3 from "web3";
import { Contract } from "web3-eth-contract"; // Import kiểu Contract từ Web3.js
import { OriginAbi } from "@/types/common";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/Button";
import AddProduct from "@/components/AddProducts";
import Product from "@/components/Product";

export default function Products() {
  const web3instance = useRef<Web3 | null>(null);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [contract, setContract] = useState<Contract<OriginAbi>>();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    // Kiểm tra nếu Web3 đã được khởi tạo trong window
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // Tạo một instance Web3 sử dụng provider từ Metamask
      web3instance.current = new Web3(window.ethereum);
      // Yêu cầu người dùng kết nối tài khoản Metamask
    } else if (window.web3) {
      console.log("object");
      // Cho các phiên bản dapp cũ hơn vẫn sử dụng Web3 mà không có MetaMask mới
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (!web3instance.current) return;

      const accounts = await web3instance.current.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(Origin.abi);
      const networkId = await web3instance.current.eth.net.getId();
      console.log(networkId);
      const networkData = Origin.networks[networkId as unknown as keyof typeof Origin.networks];
      console.log(networkData);
      if (networkData) {
        //Fetch contract
        const contract = new web3instance.current.eth.Contract(Origin.abi, networkData.address);
        setContract(contract);
        console.log(contract);
        const productCount: number = await contract.methods.productCount().call();
        //Load products
        for (let i = 1; i <= productCount; i++) {
          const newProduct = await contract.methods.products(i).call();
          setProducts((products) => [...products, newProduct as unknown as ProductType]);
        }
      } else {
        window.alert("Origin contract is not deployed to the detected network");
      }
    };
    loadBlockchainData();
  }, [web3instance.current]);

  //Add Product
  const addProduct = ({
    name,
    image,
    process,
    date,
  }: {
    name: string;
    image: string;
    process: string;
    date: string;
  }) => {
    contract?.methods
      .addProduct(name, image, process, date)
      .send({ from: account })
      .once("receipt", () => {
        window.location.reload();
      });
  };

  const onView = (hash: string) => {
    const url = `https://ipfs.infura.io/ipfs/${hash}`;
    window.open(url);
  };

  return (
    <div>
      <Sidebar />
      <div className="main-container">
        <header className="product-header">
          <h2>Products</h2>
          <Button
            className="btn"
            onClick={() => setShowAddProduct(!showAddProduct)}
            color={showAddProduct ? "#f2f2f2" : "#3eb049"}
            text={showAddProduct ? "X" : <>{"Add Product"}</>}
          />
        </header>
        {showAddProduct && <AddProduct onAdd={() => setShowAddProduct(!showAddProduct)} addProduct={addProduct} />}
        <Product onView={onView} products={products} />
      </div>
    </div>
  );
}
