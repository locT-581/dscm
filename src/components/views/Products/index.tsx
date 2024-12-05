"use client";

import { useWeb3Store } from "@/stores/storeProvider";
import Tabs from "@/UI/Tabs";
import TableProduct from "@/UI/TableProduct";
import TableProcesses from "@/UI/TableProcesses";

export default function Products() {
  const { products, processes } = useWeb3Store((state) => state);

  if (!!!products || !!!processes) return <></>;

  return (
    <div className="main-container">
      <Tabs>
        {[
          {
            title: "Danh sách sản phẩm",
            element: (
              <TableProduct
                rowList={products.map((p) => ({
                  id: p.id,
                  name: p.name,
                  image: p.image,
                  date: new Date(p.date).getTime(),
                  processes: p.process.map((process) => process.name),
                  unit: p.unit,
                }))}
              />
            ),
          },
          {
            title: "Danh sách các quy trình",
            element: (
              <TableProcesses
                rowList={processes.map((p, i) => ({
                  id: (i + 1).toString(),
                  name: p.name,
                  image: p.image,
                  description: p.description ?? "",
                  date: new Date(p.date).getTime(),
                  _id: p.id,
                }))}
              />
            ),
          },
        ]}
      </Tabs>
    </div>
  );
}
