/* eslint-disable @next/next/no-img-element */

import ProductType from "@/types/product";

export interface IProductProps {
  products: ProductType[];
  onView: (link: string) => void;
}

const ProductList = ({ products, onView }: IProductProps) =>
  products
    .sort((a, b) => Number(b.id) - Number(a.id))
    .map((product) => (
      <tr key={Number(product.id)}>
        <td className="p-img">
          <img
            style={{ width: "90px", height: "90px", cursor: "pointer" }}
            src={`${product.image}`}
            alt=""
            onClick={() => onView(product.image)}
          />
        </td>
        <td className="p-name">{product.name}</td>
        <td className="p-comp">{product.process.replace(/^\[(.+)\]$/, "$1").replace(/"/g, " ")}</td>
        <td className="p-comp">{product.date}</td>
      </tr>
    ));

export default function Product({ products, onView }: IProductProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="product-img"></th>
          <th className="product-name">Product Name</th>
          <th className="process">Product Production Processes</th>
          <th>Date Time Added</th>
        </tr>
      </thead>
      <tbody>
        <ProductList onView={onView} products={products} />
      </tbody>
    </table>
  );
}
