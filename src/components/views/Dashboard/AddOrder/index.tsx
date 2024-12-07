/* eslint-disable @next/next/no-img-element */
"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import Product from "@/types/product";
import Button from "@/UI/Button";
import { useEffect, useState } from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomizedSteppers from "@/components/HorizontalStepper";
import useToast from "@/hook/useToast";
// import getDate from "@/utils/getDate";
import { addOrder as addOrderToFireStore } from "@/app/apis";
import Process from "@/types/process";
import Supplier from "@/types/supplier";
import Title from "@/components/Title";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Order from "@/types/order";
import formatDate from "@/utils/formatDate";

export default function AddOrder({ initOrder, allowEdit = true }: { initOrder?: Order; allowEdit?: boolean }) {
  console.log("🚀 ~ AddOrder ~ initOrder:", initOrder);
  const { update, notify, _toast } = useToast();
  const { contract, account } = useWeb3Store((state) => state);

  const { products, suppliers, getOrders, orders } = useWeb3Store((state) => state);

  const animatedComponents = makeAnimated();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(initOrder?.product ?? undefined);
  const [steps, setSteps] = useState<{ process: Process; supplier?: Supplier | null; dateFinish: string }[]>(
    initOrder?.process.map((p) => ({
      process: p.process,
      supplier: p.supplier,
      dateFinish: p.expectedFinishDate,
    })) ?? []
  );

  const [d, setD] = useState("");
  const [date, setDate] = useState(initOrder?.date ?? "");
  const [quantity, setQuantity] = useState<number>(initOrder?.quantity ?? 0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!!!initOrder) return;
    setSelectedProduct(initOrder?.product ?? undefined);
    setDate(initOrder?.date ?? "");
    setQuantity(initOrder?.quantity ?? 0);
    setSteps(
      initOrder?.process.map((p) => ({
        process: p.process,
        supplier: p.supplier,
        dateFinish: p.expectedFinishDate,
      }))
    );
  }, [initOrder]);

  useEffect(() => {
    if (!!selectedProduct && !!!initOrder) {
      setSteps(
        selectedProduct.process.map((process) => ({
          process,
          supplier: null,
          dateFinish: "",
        }))
      );
    }
  }, [selectedProduct, initOrder]);

  useEffect(() => {
    // const date = getDate();
    const date = new Date().toISOString();
    setDate(date);
  }, [d]);

  //Add Order
  const addOrder = ({ name, quantity, unit, date }: { name: string; quantity: number; unit: string; date: string }) => {
    if (!!!selectedProduct) return;

    notify("Đang tạo đơn hàng...");
    setDisabled(true);
    contract?.methods
      .addOrder(name, quantity.toString(), unit, date)
      .send({ from: account })
      .once("receipt", async (e) => {
        const id = Number(e.events?.OrderAdded.returnValues.id).toString() ?? (orders?.length ?? 1) - 1;

        await addOrderToFireStore(
          {
            id: id.toString(),
            quantity: +quantity,
            unitID: selectedProduct.unit.id,
            date,
            statusProcessID: selectedProduct?.process[0].id,
            process:
              steps.map((p, i) => ({
                processID: p.process.id,
                supplierID: p.supplier?.id ?? null,
                status: i === 0 ? "Processing" : "Waiting",
                expectedFinishDate: p.dateFinish,
                actualFinishDate: null,
                ...p,
              })) ?? [],
            productID: selectedProduct.id,
            account: account ?? "",
          },
          id
        );

        await getOrders();

        // reset form
        setQuantity(0);
        setSelectedProduct(undefined);
        setSteps([]);
        update(true, "Đã tạo đơn hàng thành công!");
        setDisabled(false);
      })
      .once("error", async (e) => {
        await getOrders();
        update(true, "Đã xảy ra lỗi khi tạo đơn hàng! - " + e.message);
      });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!allowEdit) return;

    e.preventDefault();
    if (!selectedProduct) return;
    setD("now");
    addOrder({ name: selectedProduct.id, quantity, unit: selectedProduct.unit.id, date });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full h-full gap-4">
      {allowEdit && (
        <div className="flex items-center justify-between">
          <Title>Tạo đơn hàng</Title>

          <Button
            type="submit"
            disabled={
              disabled ||
              !selectedProduct ||
              !quantity ||
              steps.some((s) => !s.supplier) ||
              steps.length === 0 ||
              steps.some((s) => s.dateFinish === "")
            }
          >
            <AddCircleOutlineIcon />
            <p className="ml-1">Tạo</p>
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-6 p-4 ml-[5%]">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-[40%]">
            <label htmlFor="processes-product" className="font-semibold">
              Sản phẩm
            </label>

            {allowEdit ? (
              <Select
                isDisabled={!allowEdit}
                value={selectedProduct ? { value: selectedProduct.id, label: selectedProduct.name } : undefined}
                className="z-[999]"
                required
                closeMenuOnSelect={true}
                components={animatedComponents}
                onChange={(e) => {
                  setSelectedProduct(
                    products?.find((product) => product.id == (e as { value: string; label: string })?.value)
                  );
                }}
                options={products?.map((products) => ({ value: products.id, label: products.name })).filter(Boolean)}
              />
            ) : (
              <p>{selectedProduct?.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 w-[15%]">
            <label htmlFor="name-product" className="font-semibold">
              Số lượng
            </label>
            <div className="flex items-center gap-1">
              <input
                disabled={!allowEdit}
                value={quantity == 0 ? "" : quantity.toString()}
                required
                type="number"
                id="name-product"
                className="rounded-md p-2 h-[36px]"
                placeholder="Nhập số lượng "
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <p className="text-base text-gray-500">{selectedProduct?.unit.name}</p>
            </div>
          </div>

          {/* <div className="flex flex-col gap-3 w-[20%]">
            <label htmlFor="name-product" className="font-semibold">
              Ngày nhận
            </label>
            <input
              defaultValue={date}
              disabled={!allowEdit}
              value={date}
              required
              type="date"
              id="name-product"
              className="rounded-md p-2 h-[36px]"
              placeholder="Nhập ngày nhận"
              onChange={(e) => {
                console.log("🚀 ~ AddOrder ~ e):", e);
              }}
            />
          </div> */}
        </div>

        {selectedProduct && (
          <div className="flex flex-col gap-2 ">
            <div className="w-full flex items-center justify-between pr-[5%]">
              <div className="flex flex-col gap-3 h-full justify-between">
                <label htmlFor="processes-product" className="font-semibold">
                  Giai đoạn sản xuất
                </label>

                {steps.length > 0 && (
                  <CustomizedSteppers
                    steps={steps.map((s) => ({
                      icon: s.process?.image,
                      label: s.process?.name,
                      des: s.supplier?.name ? "(" + s.supplier?.name + ")" : "",
                    }))}
                    activeStep={
                      initOrder?.statusProcess != "Done"
                        ? initOrder?.process.findIndex(
                            (p) => (initOrder?.statusProcess as Process)?.id === p.process?.id
                          ) ?? -1
                        : initOrder?.statusProcess.length
                    }
                  />
                )}

                <div></div>
              </div>
              <div className="w-[20%] flex flex-col gap-3  items-center justify-center">
                <h5 className="font-semibold w-[100%] text-start">Hình ảnh sản phẩm</h5>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-[80%] object-contain rounded-lg "
                />
              </div>
            </div>

            {selectedProduct.process.map((process, i) => (
              <div
                key={i}
                className="flex items-center justify-between pl-4"
                style={{
                  width: allowEdit ? "80%" : "100%",
                  marginTop: allowEdit ? "0" : "10px",
                }}
              >
                <label className="font-semibold w-[30%]" htmlFor={process.id}>
                  {i + 1}. {process.name}
                </label>
                {allowEdit ? (
                  <Select
                    isDisabled={!allowEdit}
                    value={
                      steps[i]?.supplier
                        ? { value: steps[i]?.supplier?.id, label: steps[i]?.supplier?.name }
                        : undefined
                    }
                    placeholder="Chọn nhà cung cấp"
                    className="w-[30%]"
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    onChange={(e) => {
                      setSteps((steps) =>
                        steps.map((step) => {
                          if (step.process.id === process.id) {
                            return {
                              ...step,
                              supplier: suppliers?.find(
                                (supplier) =>
                                  supplier.id ===
                                  (
                                    e as {
                                      value: string;
                                      label: string;
                                    }
                                  )?.value
                              ),
                            };
                          }
                          return step;
                        })
                      );
                    }}
                    options={suppliers
                      ?.filter((supplier) => supplier?.productsProcesses?.map((p) => p.id).includes(process.id))
                      .map((supplier) => ({
                        value: supplier.id,
                        label: supplier.name,
                      }))}
                  />
                ) : (
                  <p>{steps[i]?.supplier?.name}</p>
                )}

                <div className="flex items-center w-[40%]  gap-3">
                  <h4 className=" font-semibold">Ngày nhận dự kiến</h4>
                  {allowEdit ? (
                    <input
                      required
                      type="date"
                      id="name-product"
                      className="rounded-md p-2 h-[36px] "
                      placeholder="Nhâp ngày hoàn thành"
                      onChange={(e) => {
                        // Check if e.target.value is less than the previous date

                        if (new Date(e.target.value).getTime() < new Date(steps[i - 1]?.dateFinish ?? null).getTime()) {
                          _toast("Ngày nhận phải lớn hơn ngày nhận công đoạn trước đó!", {
                            style: {
                              color: "#F37482",
                            },
                            icon: (
                              <div>
                                <ErrorOutlineIcon sx={{ color: "#F37482", fontSize: "24px" }} />
                              </div>
                            ),
                            position: "bottom-right",
                          });
                          e.target.style.borderColor = "#F37482";
                          e.target.value = "";
                          return;
                        }

                        if (
                          steps[i + 1]?.dateFinish !== undefined &&
                          new Date(e.target.value).getTime() > new Date(steps[i + 1]?.dateFinish ?? null).getTime()
                        ) {
                          _toast("Ngày nhận phải nhỏ hơn ngày nhận công đoạn sau đó!", {
                            style: {
                              color: "#F37482",
                            },
                            icon: (
                              <div>
                                <ErrorOutlineIcon sx={{ color: "#F37482", fontSize: "24px" }} />
                              </div>
                            ),
                            position: "bottom-right",
                          });
                          e.target.style.borderColor = "#F37482";
                          e.target.value = "";
                          return;
                        }

                        e.target.style.borderColor = "transparent";
                        setSteps((steps) =>
                          steps.map((step) => {
                            if (step.process.id === process.id) {
                              return {
                                ...step,
                                dateFinish: new Date(e.target.value).toISOString(),
                              };
                            }
                            return step;
                          })
                        );
                      }}
                    />
                  ) : (
                    <p>{formatDate(steps[i]?.dateFinish)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
