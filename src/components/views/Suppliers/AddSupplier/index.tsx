"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import Supplier from "@/types/supplier";
import { useState } from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Process from "@/types/process";
import { addSupplier, updateSupplier } from "@/app/apis";
import useToast from "@/hook/useToast";
import Button from "@/UI/Button";
import Title from "@/components/Title";

export default function AddSupplier({ supplier }: { supplier?: Supplier }) {
  const { processes, getSuppliers } = useWeb3Store((state) => state);
  const animatedComponents = makeAnimated();

  const init: Supplier = {
    id: supplier?.id ?? "",
    email: supplier?.email ?? "",
    phoneNumber: supplier?.phoneNumber ?? "",
    address: supplier?.address ?? "",
    account: supplier?.account ?? "",
    name: supplier?.name ?? "",
    productsProcesses: supplier?.productsProcesses ?? [],
    role: supplier?.role ?? undefined,
    taxCode: supplier?.taxCode ?? "",
    type: supplier?.type ?? "Doanh nghiệp",
    website: supplier?.website ?? "",
  };

  const [selectedProcesses, setSelectedProcesses] = useState<Process[]>(init.productsProcesses);

  const { update, notify } = useToast();

  const [form, setForm] = useState<Supplier>(init);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (supplier) {
      notify("Đang cập nhật nhà cung cấp...");
      updateSupplier({
        ...form,
        productsProcesses: selectedProcesses?.map((process) => process),
        account: form.account.toLowerCase(),
        role: "Supplier",
      });
    } else {
      notify("Đang thêm nhà cung cấp...");
      addSupplier({
        ...form,
        productsProcesses: selectedProcesses?.map((process) => process),
        account: form.account.toLowerCase(),
        role: "Supplier",
      }).then(() => {
        getSuppliers();

        setForm(init);
        setSelectedProcesses([]);
        update(true, "Thêm nhà cung cấp thành công");
      });
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className=" p-4 pl-5 rounded-3xl flex flex-col gap-6"
    >
      <Title>{`${!supplier ? "Thêm" : "Sửa"}  nhà cung cấp`}</Title>

      <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex gap-4 items-center">
            <label htmlFor="name" className="text-lg font-medium  flex flex-shrink-0">
              Tên nhà cung cấp
            </label>
            <input
              placeholder="Nhập tên nhà cung cấp"
              required
              title=""
              onChange={handleChange}
              value={form.name}
              id="name"
              name="name"
              type="text"
              className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>

          <div className="flex gap-1 items-center">
            <label htmlFor="type" className="text-lg font-medium  flex flex-shrink-0">
              Loại
            </label>
            <select
              required
              title=""
              onChange={handleChange}
              value={form.type}
              name="type"
              id="type"
              className="cursor-pointer !bg-transparent max-w-[300px] !border !border-[#D9DBE9] rounded-lg py-1 px-4  "
            >
              {["Doanh nghiệp", "Cá nhân"].map((type, i) => (
                <option key={type ?? i} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-4 items-center">
            <label htmlFor="email" className="text-lg font-medium  flex flex-shrink-0">
              Email
            </label>
            <input
              onChange={handleChange}
              placeholder="Nhập email"
              title=""
              value={form.email}
              id="email"
              name="email"
              type="email"
              className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="phoneNumber" className="text-lg font-medium  flex flex-shrink-0">
              Số điện thoại
            </label>
            <input
              placeholder="Số điện thoại"
              onChange={handleChange}
              required
              title=""
              value={form.phoneNumber}
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="address" className="text-lg font-medium  flex flex-shrink-0">
            Địa chỉ
          </label>
          <input
            placeholder="Nhập địa chỉ"
            required
            title=""
            onChange={handleChange}
            value={form.address}
            id="address"
            name="address"
            type="text"
            className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-4 items-center">
            <label htmlFor="taxCode" className="text-lg font-medium  flex flex-shrink-0">
              Mã số thuế
            </label>
            <input
              onChange={handleChange}
              placeholder="Nhập mã số thuế"
              title=""
              value={form.taxCode}
              id="taxCode"
              name="taxCode"
              type="text"
              className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label htmlFor="website" className="text-lg font-medium  flex flex-shrink-0">
              Website
            </label>
            <input
              placeholder="Trang web"
              onChange={handleChange}
              required
              title=""
              value={form.website}
              id="website"
              name="website"
              type="text"
              className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <label htmlFor="account" className="text-lg font-medium  flex flex-shrink-0">
            Địa chỉ ví
          </label>
          <input
            placeholder="Nhập địa chỉ ví"
            required
            title=""
            onChange={handleChange}
            value={form.account}
            id="account"
            name="account"
            type="text"
            className=" !bg-transparent w-full border border-[#D9DBE9] rounded-lg py-1 px-4 mt-1"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="processes-product" className="font-medium">
            Thêm quy trình sản phẩm
          </label>

          <Select
            defaultValue={init.productsProcesses.map((process) => ({ value: process.id, label: process.name }))}
            required
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            onChange={(selectedProcesses) => {
              const x = selectedProcesses?.map(
                (process) =>
                  (processes?.find(
                    (p) => p.id == (process as unknown as { value: string; label: string }).value
                  ) as Process) || ""
              );
              setSelectedProcesses(x);
            }}
            options={processes?.map((process) => ({ value: process.id, label: process.name })).filter(Boolean)}
          />
        </div>

        <div className="w-full flex justify-end py-4">
          <Button>Xác nhận</Button>
        </div>
      </form>
    </div>
  );
}
