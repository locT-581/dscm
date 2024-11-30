"use client";

import getDate from "@/utils/getDate";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";

export interface IAddProductProps {
  addProduct: ({ name, image, process, date }: { name: string; image: string; process: string; date: string }) => void;
  onAdd: () => void;
}
export default function AddProduct({ addProduct, onAdd }: IAddProductProps) {
  const [name, setName] = useState("");
  const [processes, setProcesses] = useState<string[]>([""]);
  const [date, setDate] = useState("");
  const [d, setD] = useState("");

  const [file, setFile] = useState<File | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  useEffect(() => {
    const date = getDate();
    setDate(date);
  }, [d]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.set("file", file);

    const uploadRequest = await fetch("/api/files", {
      method: "POST",
      body: data,
    });
    const ipfsUrl = await uploadRequest.json();

    const process = JSON.stringify(processes);
    setD("now");
    addProduct({ name, image: ipfsUrl, process, date });
  };

  const handleAddField = () => {
    setProcesses([...processes, ""]);
  };

  const handleChangeInput = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const values = [...processes];
    values[id] = event.target.value;
    setProcesses(values);
  };

  const handleRemoveField = (id: number) => {
    setProcesses((prev) => prev.filter((_, index) => index !== id));
  };

  return (
    <div className="center">
      <form className="product-form" onSubmit={onSubmit}>
        <div className="product-form-header">
          <h2>Thêm sản phẩm</h2>
          <button className="btn form-close" style={{ background: "red", fontSize: "14px" }} onClick={onAdd}>
            X
          </button>
        </div>
        <div className="product-center-form">
          <div className="form-inputs">
            <label>Hình ảnh</label>
            <input type="file" className="product" placeholder="Upload an Image" onChange={handleChange} />
          </div>
          <div></div>
          <div className="form-inputs">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              className="product"
              required
              placeholder="Nhập tên sản phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <h3>Quy trình sản xuất</h3>
          {processes.map((c, id) => {
            return (
              <div className="form-inputs" key={id}>
                <input
                  name="process"
                  className="process-add"
                  required
                  placeholder="Nhập quy trình sản xuất"
                  value={c}
                  onChange={(e) => handleChangeInput(id, e)}
                />

                <PostAddIcon onClick={handleAddField} />
                {processes.length !== 1 ? <CloseIcon className="add" onClick={() => handleRemoveField(id)} /> : null}
              </div>
            );
          })}
          <div></div>
          <button className="btn product-input-btn" type="submit">
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
}
