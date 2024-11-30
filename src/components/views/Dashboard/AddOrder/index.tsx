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
import getDate from "@/utils/getDate";
import { addOrder as addOrderToFireStore } from "@/app/apis";
import Process from "@/types/process";
import Supplier from "@/types/supplier";

export default function AddOrder() {
  const { update, notify } = useToast();
  const { contract, account } = useWeb3Store((state) => state);

  const { products, suppliers, getOrders, orders } = useWeb3Store((state) => state);

  const animatedComponents = makeAnimated();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [steps, setSteps] = useState<{ process: Process; supplier?: Supplier | null }[]>([]);

  const [d, setD] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (!!selectedProduct) {
      setSteps(
        selectedProduct.process.map((process) => ({
          process,
          supplier: null,
        }))
      );
    }
  }, [selectedProduct]);

  useEffect(() => {
    const date = getDate();
    setDate(date);
  }, [d]);

  //Add Order
  const addOrder = ({ name, quantity, unit, date }: { name: string; quantity: string; unit: string; date: string }) => {
    if (!!!selectedProduct) return;

    notify("Đang tạo đơn hàng...");
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
      })
      .once("error", async (e) => {
        await getOrders();
        update(true, "Đã xảy ra lỗi khi tạo đơn hàng! - " + e.message);
      });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setD("now");
    addOrder({ name: selectedProduct.id, quantity, unit: selectedProduct.unit.id, date });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full h-full gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold">Tạo đơn hàng</h4>
        <Button type="submit">
          <AddCircleOutlineIcon />
          <p className="ml-1">Tạo</p>
        </Button>
      </div>

      <div className="flex flex-col gap-4 w-[80%] border border-[#ab9797] rounded-xl p-4 ml-[5%]">
        <h4 className="text-xl font-semibold">Thông tin chung</h4>
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-[60%]">
            <label htmlFor="processes-product" className="font-semibold">
              Chọn sản phẩm
            </label>

            <Select
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

          <div className="flex flex-col gap-3 w-[30%]">
            <label htmlFor="name-product" className="font-semibold">
              Số lượng
            </label>
            <input
              required
              type="number"
              id="name-product"
              className="rounded-md p-2 h-[36px]"
              placeholder="Nhập số lượng "
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        {selectedProduct && (
          <div className="flex flex-col gap-3 ">
            <label htmlFor="processes-product" className="font-semibold">
              Giai đoạn sản xuất
            </label>

            {steps.length > 0 && (
              <CustomizedSteppers
                steps={steps.map((s) => ({
                  icon: s.process.image,
                  label: s.process.name,
                  des: s.supplier?.name ?? "",
                }))}
                activeStep={-1}
              />
            )}

            {selectedProduct.process.map((process, i) => (
              <div key={i} className="flex items-center w-[70%] justify-between pl-4">
                <label className="font-semibold" htmlFor={process.id}>
                  {i + 1}. {process.name}
                </label>
                <Select
                  placeholder="Chọn nhà cung cấp"
                  className="w-[50%]"
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
                    ?.filter((supplier) => supplier.productsProcesses.map((p) => p.id).includes(process.id))
                    .map((supplier) => ({
                      value: supplier.id,
                      label: supplier.name,
                    }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
