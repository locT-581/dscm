// import type Order from "@/types/order";
// import { units } from "@/utils/const";

// export interface IOrderProps {
//   orders: Order[] | undefined;
// }

// export default function Order({ orders }: IOrderProps) {
//   return (
//     <>
//       <h3 className="table-title">Danh sách các đơn hàng</h3>
//       <table className="table">
//         <thead>
//           <tr>
//             <th className="ordernum">Mã đơn hàng</th>
//             <th>Tên sản phẩm</th>
//             <th>Số lượng</th>
//             <th>Đơn vị</th>
//             <th>Ngày tạo</th>
//           </tr>
//         </thead>
//         <tbody>
//           <OrderList orders={orders} />
//         </tbody>
//       </table>
//     </>
//   );
// }

// const OrderList = ({ orders }: IOrderProps) =>
//   orders
//     ?.sort((a, b) => Number(b.id) - Number(a.id))
//     .map((order) => (
//       <tr key={order.id}>
//         <td className="id">{order.id}</td>
//         <td className="p-name">{order.name}</td>
//         <td className="p-comp">{order.quantity}</td>
//         <td className="p-comp">{units.find((unit) => unit.id == order.unit)?.value}</td>
//         <td className="p-comp">{order.date}</td>
//         <td></td>
//       </tr>
//     ));
