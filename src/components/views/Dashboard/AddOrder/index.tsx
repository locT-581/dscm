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

export default function AddOrder() {
  const { update, notify, _toast } = useToast();
  const { contract, account } = useWeb3Store((state) => state);

  const { products, suppliers, getOrders, orders } = useWeb3Store((state) => state);

  const animatedComponents = makeAnimated();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [steps, setSteps] = useState<{ process: Process; supplier?: Supplier | null; dateFinish: string }[]>([]);

  const [d, setD] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!!selectedProduct) {
      setSteps(
        selectedProduct.process.map((process) => ({
          process,
          supplier: null,
          dateFinish: "",
        }))
      );
    }
  }, [selectedProduct]);

  useEffect(() => {
    // const date = getDate();
    const date = new Date().toISOString();
    setDate(date);
  }, [d]);

  //Add Order
  const addOrder = ({ name, quantity, unit, date }: { name: string; quantity: string; unit: string; date: string }) => {
    if (!!!selectedProduct) return;

    notify("Đang tạo đơn hàng...");
    setDisabled(true);
    contract?.methods
      .addOrder(name, quantity, unit, date)
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
              steps.map((p) => ({
                processID: p.process.id,
                supplierID: p.supplier?.id ?? null,
                status: "WaitingConfirm",
                expectedFinishDate: p.dateFinish,
                actualFinishDate: null,
              })) ?? [],
            productID: selectedProduct.id,
            account: account ?? "",
          },
          id
        );

        await getOrders();

        // reset form
        setQuantity("");
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
    e.preventDefault();
    if (!selectedProduct) return;

    console.log("🚀 ~ onSubmit ~ e:", selectedProduct);
    setD("now");
    console.log("🚀 ~ onSubmit ~ date:", steps);
    // addOrder({ name: selectedProduct.id, quantity, unit: selectedProduct.unit.id, date });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full h-full gap-4">
      <div className="flex items-center justify-between">
        <Title>Tạo đơn hàng</Title>

        <Button type="submit" disabled={disabled || !selectedProduct || !quantity}>
          <AddCircleOutlineIcon />
          <p className="ml-1">Tạo</p>
        </Button>
      </div>

      <div className="flex flex-col gap-6 p-4 ml-[5%]">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-[40%]">
            <label htmlFor="processes-product" className="font-semibold">
              Chọn sản phẩm
            </label>

            <Select
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
          </div>

          <div className="flex flex-col gap-3 w-[20%]">
            <label htmlFor="name-product" className="font-semibold">
              Số lượng
            </label>
            <div className="flex items-center gap-1">
              <input
                required
                type="number"
                id="name-product"
                className="rounded-md p-2 h-[36px]"
                placeholder="Nhập số lượng "
                onChange={(e) => setQuantity(e.target.value)}
              />
              <p className="text-base text-gray-500">{selectedProduct?.unit.name}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-[20%]">
            <label htmlFor="name-product" className="font-semibold">
              Ngày nhận
            </label>
            <input
              required
              type="date"
              id="name-product"
              className="rounded-md p-2 h-[36px]"
              placeholder="Nhập ngày nhận"
              onChange={(e) => {
                console.log("🚀 ~ AddOrder ~ e):", e);
              }}
            />
          </div>
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
                      icon: s.process.image,
                      label: s.process.name,
                      des: s.supplier?.name ? "(" + s.supplier?.name + ")" : "",
                    }))}
                    activeStep={-1}
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
              <div key={i} className="flex items-center w-[80%] justify-between pl-4">
                <label className="font-semibold w-[30%]" htmlFor={process.id}>
                  {i + 1}. {process.name}
                </label>
                <Select
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

                <div className="flex items-center w-[35%]  gap-3">
                  <h4 className=" font-semibold">Ngày nhận dự kiến</h4>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
