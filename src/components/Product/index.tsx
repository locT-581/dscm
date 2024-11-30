/* eslint-disable @next/next/no-img-element */

import ProductType from "@/types/product";
import TableProduct from "@/UI/TableProduct";

export interface IProductProps {
  products: ProductType[];
}

export default function Product({ products }: IProductProps) {
  return (
    <TableProduct
      rowList={products.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        date: p.date,
        processes: p.process.map((process) => process.name),
        unit: p.unit,
      }))}
    />
  );
}
