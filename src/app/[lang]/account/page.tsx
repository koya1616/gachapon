import Link from "next/link";
import AddressForm from "@/app/[lang]/_components/AddressForm";
import LogoutButton from "@/app/[lang]/account/_components/LogoutButton";
import { useTranslation as t } from "@/lib/translations";
import { cookies } from "next/headers";
import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { getPaypayPaymentsByUserId } from "@/lib/db";
import { formatDate } from "@/lib/date";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import type { Lang, Order } from "@/types";

interface AccountPageLogic {
  l: Lang;
  orders: Order[];
}

const useAccountPageLogic = async (l: Lang): Promise<AccountPageLogic> => {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return redirect(`/${l}/login`);
  }

  const orders = await getPaypayPaymentsByUserId(userToken.id);

  return { l, orders };
};

export const AccountPageView = ({ l, orders }: AccountPageLogic) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-4">{t(l).account.title}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <AddressForm lang={l} />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">{t(l).account.order_history}</h2>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.order_id}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.order_date}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.status}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.paypay_payment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.paypay_payment_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <OrderStatusBadge order={order} lang={l} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/${l}/payment/paypay/${order.merchant_payment_id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-2 cursor-pointer"
                      >
                        {t(l).account.detail}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">{t(l).account.no_orders}</p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <LogoutButton lang={l} />
      </div>
    </div>
  );
};

const AccountPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";
  const logic = await useAccountPageLogic(l);
  return <AccountPageView {...logic} />;
};

export default AccountPage;
