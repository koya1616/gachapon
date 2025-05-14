import OrderStatusBadge from "@/components/OrderStatusBadge";
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

      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ユーザーID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  決済ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ステータス
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    決済履歴がありません
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.merchant_payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{order.user_id}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500 truncate max-w-[180px]">
                      {order.merchant_payment_id}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge order={order} lang="ja" />
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/payment/paypay/${order.merchant_payment_id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">決済履歴がありません</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.merchant_payment_id}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-600 font-medium">ユーザーID:</span>
                <span className="text-sm text-gray-900 font-bold">{order.user_id}</span>
              </div>

              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-gray-600 font-medium">決済ID:</span>
                <span className="text-sm font-mono text-gray-700 truncate max-w-[200px]">
                  {order.merchant_payment_id}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600 font-medium">ステータス:</span>
                <OrderStatusBadge order={order} lang="ja" />
              </div>

              <div className="text-right">
                <Link
                  href={`/admin/payment/paypay/${order.merchant_payment_id}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  詳細
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentView;
