/* eslint-disable @next/next/no-img-element */
"use client";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useRef, useState } from "react";
import Button from "@/UI/Button";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { addProcess, updateProcess } from "@/app/apis";
import useToast from "@/hook/useToast";
import { useWeb3Store } from "@/stores/storeProvider";
import Title from "@/components/Title";
import Process from "@/types/process";

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export default function AddProcess({ process }: { process?: Process }) {
  const { update, notify } = useToast();
  const { getProcess } = useWeb3Store((state) => state);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  useEffect(() => {
    (async () => {
      if (process) {
        const response = await fetch(process.image);
        const blob = await response.blob();

        // Tạo một đối tượng File từ blob
        const file = new File([blob], "default-image.jpg", { type: "image/jpeg" });

        // Tạo một DataTransfer để gán file vào input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current!.files = dataTransfer.files;

        setFile(dataTransfer.files[0]);
      }
    })();
  }, []);

  const [name, setName] = useState(process?.name ?? "");
  const [description, setDescription] = useState<string>(process?.description ?? "");

  const [disabled, setDisabled] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.set("file", file);

    notify("Đang lưu quy trình...");
    setDisabled(true);

    const uploadRequest = await fetch("/api/files", {
      method: "POST",
      body: data,
    });
    const ipfsUrl = await uploadRequest.json();

    if (process) {
      updateProcess({ ...process, name, description, image: ipfsUrl }).then(() => {
        update(true, "Đã sửa quy trình sản phẩm thành công!");
      });
    } else {
      addProcess({ id: "", name, description, image: ipfsUrl }).then(() => {
        setName("");
        setDescription("");
        setFile(undefined);
        getProcess();
        update(true, "Đã thêm quy trình sản phẩm thành công!");
      });
    }
    setDisabled(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full h-full gap-6">
      <div className="flex items-center justify-between">
        <Title>{`${process ? "Sửa" : "Thêm"} quy trình sản phẩm`}</Title>

        <Button type="submit" disabled={disabled || !name || !description || !file}>
          <FileDownloadDoneIcon />
          <p className="ml-1">Lưu</p>
        </Button>
      </div>

      <div className="flex justify-between pr-8 gap-4 ">
        <div className="w-full flex justify-between pr-8 gap-4 ">
          <div className="flex flex-col gap-4 w-full rounded-xl p-4">
            <h4 className="text-xl font-semibold">Thông tin chung</h4>

            <div className="flex flex-col gap-1">
              <label htmlFor="name-product" className="font-medium">
                Tên quy trình
              </label>
              <input
                value={name}
                required
                type="text"
                id="name-product"
                className="border border-[#ab9797] rounded-md p-2"
                placeholder="Nhập tên quy trình"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-between gap-3">
              <label htmlFor="description" className="font-medium">
                Mô tả
              </label>
              <textarea
                value={description}
                required
                id="description"
                className="border border-[#ab9797] rounded-md p-2 resize-none h-[30vh]"
                placeholder="Nhập mô tả quy trình"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className=" w-[40%] border border-green-300 rounded-xl flex flex-col gap-4 p-4 max-h-[50vh] h-full">
          <h4 className="text-xl font-semibold">Hình ảnh</h4>

          <div
            onClick={() => {
              if (!!file) return;
              inputRef.current?.click();
            }}
            className="flex items-center justify-center h-full w-full cursor-pointer"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              placeholder="Chọn ảnh sản phẩm"
              onChange={handleChange}
            />
            {!!!file && (
              <div className="flex flex-col justify-center items-center gap-1">
                <AddIcon className="cursor-pointer" fontSize="large" />
                <p>Thêm hình ảnh</p>
              </div>
            )}

            {file && (
              <div className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-[inherit]"
                />
                <CloseIcon
                  className="absolute top-0 right-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(undefined);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
