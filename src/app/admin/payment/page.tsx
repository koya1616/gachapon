import { cookies } from "next/headers";
import { getPaypayPayments } from "@/lib/db";
import { ADMIN_CODE } from "@/const/cookies";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrderStatusBadge from "@/components/OrderStatusBadge";

const Payment = async () => {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    redirect("/admin/login");
  }

  const orders = await getPaypayPayments();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">決済履歴</h1>

      {/* PC/タブレット向けテーブル表示 - md以上のサイズで表示 */}
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
                  <span>詳細を見る</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <title>ArrowRight</title>
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Payment;
