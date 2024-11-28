"use client";

import { useState } from "react";

import Button from "@/components/Button";
import AddProduct from "@/components/AddProducts";
import Product from "@/components/Product";
import { useWeb3Store } from "@/stores/storeProvider";
import useToast from "@/hook/useToast";

export default function Products() {
  const { account, contract, products, getProducts } = useWeb3Store((state) => state);

  const { notify, update } = useToast();

  const [showAddProduct, setShowAddProduct] = useState(false);

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
    notify("Đang thêm sản phẩm...");

    contract?.methods
      .addProduct(name, image, process, date)
      .send({ from: account })
      .once("receipt", async () => {
        await getProducts();
        update(true, "Thêm sản phẩm thành công!");
      })
      .once("error", (e) => {
        update(false, "Thêm sản phẩm thất bại!" + e.message);
      });
  };

  const onView = (url: string) => {
    window.open(url, "_blank");
  };

  if (!!!products) return <></>;

  return (
    <div className="main-container">
      <header className="product-header">
        <h2>Danh sách các sản phẩm</h2>
        <Button
          className="btn"
          onClick={() => setShowAddProduct(!showAddProduct)}
          color={showAddProduct ? "#f2f2f2" : "#3eb049"}
          text={showAddProduct ? "X" : <>{"Thêm sản phẩm"}</>}
        />
      </header>
      {showAddProduct && <AddProduct onAdd={() => setShowAddProduct(!showAddProduct)} addProduct={addProduct} />}
      <Product onView={onView} products={products} />
    </div>
  );
}
