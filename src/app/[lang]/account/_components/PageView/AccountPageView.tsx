import AddressForm from "@/app/[lang]/_components/AddressForm";
import LogoutButton from "@/app/[lang]/account/_components/LogoutButton";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import Table from "@/components/Table";
import { formatDate } from "@/lib/date";
import { useTranslation as t } from "@/lib/translations";
import type { Lang, Order } from "@/types";
import Link from "next/link";

interface AccountPageLogic {
  orders: Order[];
}

const AccountPageView = ({ orders, l }: AccountPageLogic & { l: Lang }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-4">{t(l).account.title}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <AddressForm lang={l} />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">{t(l).account.order_history}</h2>
        {orders.length > 0 ? (
          <Table
            data={orders}
            keyExtractor={(order) => order.paypay_payment_id}
            columns={[
              {
                header: t(l).account.order_id,
                accessor: (order) => order.paypay_payment_id,
              },
              {
                header: t(l).account.order_date,
                accessor: (order) => formatDate(order.created_at),
              },
              {
                header: t(l).account.status,
                accessor: (order) => <OrderStatusBadge order={order} lang={l} />,
              },
              {
                header: "",
                accessor: (order) => (
                  <Link
                    href={`/${l}/payment/paypay/${order.merchant_payment_id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-2 cursor-pointer"
                  >
                    {t(l).account.detail}
                  </Link>
                ),
              },
            ]}
          />
        ) : (
          <p className="text-gray-500">{t(l).account.no_orders}</p>
        )}
      </div>

      <div className="text-right">
        <LogoutButton lang={l} />
      </div>
    </div>
  );
};

export default AccountPageView;
