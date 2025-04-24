import { cookies } from "next/headers";
import { getPaypayPayments } from "@/lib/db";
import { ADMIN_CODE } from "@/const/cookies";
import { redirect } from "next/navigation";
import { paypayGetCodePaymentDetails } from "@/lib/paypay";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE || "";

const getStatusBadge = (status: string) => {
  const statusStyles: Record<string, { color: string; label: string }> = {
    CREATED: { color: "bg-blue-100 text-blue-800", label: "作成済" },
    AUTHORIZED: { color: "bg-indigo-100 text-indigo-800", label: "認証済" },
    REAUTHORIZING: { color: "bg-purple-100 text-purple-800", label: "再認証中" },
    COMPLETED: { color: "bg-green-100 text-green-800", label: "完了" },
    REFUNDED: { color: "bg-yellow-100 text-yellow-800", label: "返金済" },
    FAILED: { color: "bg-red-100 text-red-800", label: "失敗" },
    CANCELED: { color: "bg-gray-100 text-gray-800", label: "キャンセル" },
    EXPIRED: { color: "bg-gray-100 text-gray-500", label: "期限切れ" },
    UNKNOWN: { color: "bg-gray-100 text-gray-500", label: "不明" },
  };

  const style = statusStyles[status] || statusStyles.UNKNOWN;

  return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${style.color}`}>{style.label}</span>;
};

export default async function Payment() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== ENV_ADMIN_CODE) {
    redirect("/admin/login");
  }

  const payments = await getPaypayPayments();
  const paymentDetails = await Promise.all(
    payments.map(async (payment) => {
      const details = await paypayGetCodePaymentDetails(payment.merchant_payment_id);
      return {
        ...payment,
        status: details?.data.status || "UNKNOWN",
        requestedAt: details?.data.requestedAt ? new Date(details.data.requestedAt * 1000).toLocaleString("ja-JP") : "",
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">決済履歴</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  取引日時
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ステータス
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentDetails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    決済履歴がありません
                  </td>
                </tr>
              ) : (
                paymentDetails.map((payment) => (
                  <tr key={payment.merchant_payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {payment.merchant_payment_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.requestedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button type="button" className="text-indigo-600 hover:text-indigo-900 mr-2">
                        詳細
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
