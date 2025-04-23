import AddressForm from "@/components/AddressForm";
import LogoutButton from "@/components/LogoutButton";
import { useTranslation as t } from "@/lib/translations";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const mockOrderData: Array<{ id: string; date: string; total: number; status_text: string; status: string }> = [
    { id: "ORD-001", date: "2025-04-15", total: 2500, status_text: t(l).order.status.delivered, status: "delivered" },
    {
      id: "ORD-002",
      date: "2025-04-02",
      total: 1800,
      status_text: t(l).order.status.processing,
      status: "processing",
    },
    { id: "ORD-003", date: "2025-03-21", total: 3200, status_text: t(l).order.status.shipped, status: "shipped" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-4">{t(l).account.title}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <AddressForm lang={l} />
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">{t(l).account.order_history}</h2>
        {mockOrderData && mockOrderData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.order_id}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.date}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.total}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t(l).account.status}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockOrderData.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t(l).account.currency}
                      {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status_text}
                      </span>
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
}
