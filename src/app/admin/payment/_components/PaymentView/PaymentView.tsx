import OrderStatusBadge from "@/components/OrderStatusBadge";
import Table from "@/components/Table";
import type { Order } from "@/types";
import Link from "next/link";

interface PaymentLogic {
  orders: Order[];
}

const PaymentView = ({ orders }: PaymentLogic) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="h-10 w-1 bg-blue-600 rounded-full mr-3 hidden sm:block" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">決済履歴</h2>
          </div>
        </div>
      </div>
      <Table
        data={orders}
        keyExtractor={(order) => order.merchant_payment_id}
        columns={[
          {
            header: "ユーザーID",
            accessor: "user_id",
          },
          {
            header: "決済ID",
            accessor: (order) => (
              <div className="font-mono text-gray-500 truncate max-w-[180px]">{order.merchant_payment_id}</div>
            ),
          },
          {
            header: "ステータス",
            accessor: (order) => <OrderStatusBadge order={order} lang="ja" />,
          },
          {
            header: "",
            accessor: (order) => (
              <Link
                href={`/admin/payment/paypay/${order.merchant_payment_id}`}
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                詳細
              </Link>
            ),
          },
        ]}
      />{" "}
    </div>
  );
};

export default PaymentView;
