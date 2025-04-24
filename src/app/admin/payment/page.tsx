import { cookies } from "next/headers";
import { getPaypayPayments } from "@/lib/db";
import { ADMIN_CODE } from "@/const/cookies";
import { redirect } from "next/navigation";
import RedirectButton from "@/components/RedirectButton";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE || "";

export default async function Payment() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== ENV_ADMIN_CODE) {
    redirect("/admin/login");
  }

  const payments = await getPaypayPayments();

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
                <th scope="col" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    決済履歴がありません
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.merchant_payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {payment.merchant_payment_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <RedirectButton
                        text="詳細"
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        to={`/admin/payment/paypay/${payment.merchant_payment_id}`}
                      />
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
