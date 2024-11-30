/* eslint-disable @next/next/no-img-element */
"use client";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useRef, useState } from "react";
import Button from "@/UI/Button";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import getDate from "@/utils/getDate";
import useToast from "@/hook/useToast";
import { useWeb3Store } from "@/stores/storeProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { units } from "@/utils/const";

import CheckIcon from "@mui/icons-material/Check";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CustomizedSteppers from "@/components/HorizontalStepper";
import Process from "@/types/process";
import { Property } from "@/types/product";
import { addProduct as addProductToFireStore } from "@/app/apis/index";
import Unit from "@/types/unit";
export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export default function AddProduct() {
  const animatedComponents = makeAnimated();
  const { notify, update } = useToast();

  const { contract, account, getProducts, processes, products } = useWeb3Store((state) => state);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  const [name, setName] = useState("");
  const [selectedProcesses, setSelectedProcesses] = useState<Process[]>([]);

  const [properties, setProperties] = useState<Property[] | undefined>([]);
  const [propertiesTabActive, setPropertiesTabActive] = useState<number>(0);

  const [unit, setUnit] = useState<Unit | null>(null);

  const [date, setDate] = useState("");
  const [d, setD] = useState("");

  useEffect(() => {
    const date = getDate();
    setDate(date);
  }, [d]);

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
      .once("receipt", async (e) => {
        await addProductToFireStore(
          {
            process: selectedProcesses,
            unit: unit!,
            properties,
          },
          Number(e.events?.ProductAdded.returnValues.id).toString() ?? (products!.length - 1).toString()
        );
        
        await getProducts();
        update(true, "Thêm sản phẩm thành công!");
      })
      .once("error", (e) => {
        update(false, "Thêm sản phẩm thất bại!" + e.message);
      });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !!!processes || !!!unit) return;

    notify("Đang thêm sản phẩm...");
    const data = new FormData();
    data.set("file", file);
    const uploadRequest = await fetch("/api/files", {
      method: "POST",
      body: data,
    });
    const ipfsUrl = await uploadRequest.json();

    const process = JSON.stringify(processes.map((p) => p.id));
    setD("now");
    addProduct({ name, image: ipfsUrl, process, date });
  };

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const handleDoubleClick = (id: number) => {
    setIsEditing(id);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full h-full gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold">Thêm sản phẩm mới</h4>
        <Button type="submit">
          <FileDownloadDoneIcon />
          <p className="ml-1">Lưu</p>
        </Button>
      </div>

      <div className="flex justify-between pr-8 gap-4 ">
        <div className="flex flex-col gap-4 w-full border border-[#ab9797] rounded-xl p-4">
          <h4 className="text-xl font-semibold">Thông tin chung</h4>

          <div className="flex flex-col gap-1">
            <label htmlFor="name-product" className="font-medium">
              Tên sản phẩm
            </label>
            <input
              required
              type="text"
              id="name-product"
              className="border border-[#ab9797] rounded-md p-2"
              placeholder="Nhập tên sản phẩm"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="processes-product" className="font-medium">
              Thêm quy trình sản phẩm
            </label>
            {selectedProcesses.length > 0 && (
              <CustomizedSteppers
                steps={selectedProcesses.map((p) => ({ label: p.name, icon: p.image }))}
                activeStep={-1}
              />
            )}
            <Select
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

          <div className="flex flex-col justify-between gap-3">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <h4>Thêm thuộc tính</h4>
                <p className="text-sm"> (kích thước, giới tính,...)</p>
              </div>

              <button
                className="flex items-center gap-1 cursor-pointer font-medium"
                type="button"
                onClick={() => {
                  setIsEditing(properties?.length || 0);

                  if (properties?.[properties.length - 1]?.value.length !== 0) {
                    setProperties([...(properties || []), { name: "", value: [] }]);
                    setPropertiesTabActive(properties?.length || 0);
                  }
                }}
              >
                <AddCircleOutlineIcon />
                Thêm mới
              </button>
            </div>

            <div className="flex bg-[#fdfdfd] rounded-2xl">
              <div className="w-2/5 flex flex-col gap-3 p-2 rounded-xl">
                {properties?.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <RemoveCircleOutlineIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setProperties((prev) => {
                          const newProperties = prev ? [...prev] : [];
                          newProperties.splice(i, 1);
                          return newProperties;
                        });
                      }}
                      fontSize="small"
                    />
                    <div
                      onClick={() => setPropertiesTabActive(i)}
                      onDoubleClick={() => handleDoubleClick(i)}
                      className={`pr-2 flex items-center justify-between rounded-lg cursor-pointer w-full ${
                        i == propertiesTabActive ? "bg-[#DEE2FF44] font-medium" : ""
                      }`}
                    >
                      {isEditing === i ? (
                        <>
                          <input
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setIsEditing(null);
                              }
                            }}
                            className="bg-transparent w-full p-2"
                            onBlur={(e) => {
                              setIsEditing(null);
                              // check if value empty then remove
                              if (!e.target.value) {
                                setProperties((prev) => {
                                  const newProperties = prev ? [...prev] : [];
                                  newProperties.splice(i, 1);
                                  return newProperties;
                                });
                              }
                            }}
                            type="text"
                            value={p.name}
                            onChange={(e) => {
                              setProperties((prev) => {
                                const newProperties = prev ? [...prev] : [];
                                newProperties[i].name = e.target.value;
                                return newProperties;
                              });
                            }}
                          />
                          <CheckIcon
                            className="cursor-pointer"
                            fontSize="small"
                            onClick={() => {
                              setIsEditing(null);
                              // check if value empty then remove
                              if (!p.name) {
                                setProperties((prev) => {
                                  const newProperties = prev ? [...prev] : [];
                                  newProperties.splice(i, 1);
                                  return newProperties;
                                });
                              }
                            }}
                          />
                        </>
                      ) : (
                        <span className="p-2">{p.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-full w-px bg-[#DEE2FF]"></div>

              <div className="w-3/5 flex flex-col gap-2 p-2 ">
                <h5 className="font-medium">Các giá trị của thuộc tính</h5>
                <div className="flex flex-col gap-2 h-full overflow-y-auto">
                  {properties &&
                    properties[propertiesTabActive]?.value.map((v, i) => (
                      <div key={i} className="w-full flex items-center justify-between px-4 ">
                        <input
                          className="bg-[#DEE2FF55] px-2 py-1 rounded-lg w-full"
                          type="text"
                          value={v}
                          onChange={(e) => {
                            setProperties((prev) => {
                              const newProperties = prev ? [...prev] : [];
                              newProperties[propertiesTabActive].value[i] = e.target.value;
                              return newProperties;
                            });
                          }}
                        />
                        <CloseIcon
                          fontSize="small"
                          className="cursor-pointer"
                          onClick={() => {
                            setProperties((prev) => {
                              const newProperties = prev ? [...prev] : [];
                              const temp = newProperties[propertiesTabActive].value.filter((_, index) => index !== i);
                              return newProperties.map((p, index) => {
                                if (index === propertiesTabActive) {
                                  return { ...p, value: temp };
                                }
                                return p;
                              });
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
                <div
                  onClick={() => {
                    setProperties((prev) => {
                      return prev?.map((p, index) => {
                        if (index === propertiesTabActive) {
                          return { ...p, value: [...p.value, ""] };
                        }
                        return p;
                      });
                    });
                  }}
                  className="flex w-fit items-center gap-1 cursor-pointer font-medium"
                >
                  <AddIcon />
                  <p>Thêm mới</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[40%] h-full flex flex-col gap-3">
          <div className="border border-[#f00] rounded-xl flex flex-col gap-4 p-4 max-h-[50vh] h-full">
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

          <div className="flex flex-col gap-1">
            <label htmlFor="processes-product" className="font-medium">
              Chọn đơn vị
            </label>
            <Select
              onChange={(selectedUnit) =>
                setUnit(units.find((unit) => unit.id == (selectedUnit as { value: string }).value) ?? null)
              }
              required
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
