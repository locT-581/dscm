"use client";

import { useEffect, useState } from "react";

import getDate from "@/utils/getDate";
import { useWeb3Store } from "@/stores/storeProvider";
import { units } from "@/utils/const";

export interface IAddOrderProps {
  addOrder: ({ name, quantity, unit, date }: { name: string; quantity: string; unit: string; date: string }) => void;
  onAdd: () => void;
}

export default function AddOrder({ addOrder, onAdd }: IAddOrderProps) {
  const { products } = useWeb3Store((state) => state);

  const [d, setD] = useState("");
  const [name, setName] = useState("");

  // id of unit
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const date = getDate();
    setDate(date);
  }, [d]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setD("now");
    addOrder({ name, quantity, unit, date });
  };

  return (
    <div className="center">
      <form className="order-form" onSubmit={onSubmit}>
        <div className="form-header">
          <h2>Tạo đơn hàng</h2>
          <button className="btn form-close" style={{ background: "red", fontSize: "14px" }} onClick={onAdd}>
            X
          </button>
        </div>
        <div className="product-center-form">
          <div className="form-inputs">
            <label className="order-label">Chọn sản phẩm</label>
            <select className="order-product" required value={name} onChange={(e) => setName(e.target.value)}>
              <option value="" disabled hidden></option>
              {products?.map((product, i) => {
                return (
                  <option key={i} value={product.name}>
                    {product.name}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-inputs">
            <label className="order-label">Chọn số lượng và đơn vị</label>
            <input
              type="number"
              className="quantity"
              required
              placeholder="Nhập số lượng"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select className="unit" required value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="" disabled hidden>
                Chọn đơn vị
              </option>
              {units.map((unit, i) => (
                <option key={i} value={unit.id}>
                  {unit.name}{" "}
                </option>
              ))}
            </select>
          </div>
          <button className="btn order-input-btn" type="submit">
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
}
