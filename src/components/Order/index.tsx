import type Order from "@/types/order";

export interface IOrderProps {
  orders: Order[] | undefined;
}

export default function Order({ orders }: IOrderProps) {
  return (
    <>
      <h3 className="table-title">Orders</h3>
      <table className="table">
        <thead>
          <tr>
            <th className="ordernum">Order #</th>
            <th>Order Name</th>
            <th>Order Quantity</th>
            <th>Order Unit</th>
            <th>Date Time Added</th>
          </tr>
        </thead>
        <tbody>
          <OrderList orders={orders} />
        </tbody>
      </table>
    </>
  );
}

const OrderList = ({ orders }: IOrderProps) =>
  orders
    ?.sort((a, b) => Number(a.id) - Number(b.id))
    .map((order) => (
      <tr key={order.id}>
        <td className="id">{order.id}</td>
        <td className="p-name">{order.name}</td>
        <td className="p-comp">{order.quantity}</td>
        <td className="p-comp">{order.unit}</td>
        <td className="p-comp">{order.date}</td>
        <td></td>
      </tr>
    ));
