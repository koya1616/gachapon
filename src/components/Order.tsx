import { formatDate } from "@/lib/date";
import type { PaypayGetCodePaymentDetailsResponse } from "@/lib/paypay";
import type { Lang, PaymentProduct, Shipment } from "@/types";
import { useTranslation as t } from "@/lib/translations";

const statusColors: Record<string, string> = {
  CREATED: "bg-blue-100 text-blue-800",
  AUTHORIZED: "bg-purple-100 text-purple-800",
  REAUTHORIZING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  REFUNDED: "bg-orange-100 text-orange-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELED: "bg-gray-100 text-gray-800",
  EXPIRED: "bg-gray-100 text-gray-800",
};

function getShipmentStatus(shipment: Shipment | null) {
  if (shipment?.payment_failed_at) return { status: "決済失敗", color: "bg-red-100 text-red-800" };
  if (shipment?.cancelled_at) return { status: "キャンセル済み", color: "bg-gray-100 text-gray-800" };
  if (shipment?.delivered_at) return { status: "配達済み", color: "bg-green-100 text-green-800" };
  if (shipment?.shipped_at) return { status: "発送済み", color: "bg-blue-100 text-blue-800" };
  return { status: "処理中", color: "bg-yellow-100 text-yellow-800" };
}

const Order = async ({
  paymentDetails,
  shipment,
  paymentProducts,
  lang,
}: {
  paymentDetails: PaypayGetCodePaymentDetailsResponse | null;
  shipment: Shipment | null;
  paymentProducts: PaymentProduct[];
  lang: Lang;
}) => {
  const status = paymentDetails?.data?.status || "不明";
  const statusColor = statusColors[status] || "bg-gray-100 text-gray-800";
  const shipmentStatus = getShipmentStatus(shipment);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t(lang).order.payment.title}</h2>

          <div className="flex items-center mb-4">
            <span className="font-semibold w-32">{t(lang).order.payment.status}:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{status}</span>
          </div>

          {paymentDetails?.data?.amount && (
            <div className="flex items-center mb-4">
              <span className="font-semibold w-32">{t(lang).order.payment.amount}:</span>
              <span className="text-lg font-bold">¥{paymentDetails.data.amount.amount.toLocaleString()}</span>
            </div>
          )}

          {status === "COMPLETED" && (
            <>
              <div className="flex items-center mb-4">
                <span className="font-semibold w-32">{t(lang).order.payment.requested_at}:</span>
                <span>{paymentDetails?.data?.requestedAt ? formatDate(paymentDetails.data.requestedAt) : ""}</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="font-semibold w-32">{t(lang).order.payment.accepted_at}:</span>
                <span>{paymentDetails?.data?.acceptedAt ? formatDate(paymentDetails.data.acceptedAt) : ""}</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t(lang).order.shipment.title}</h2>

          {shipment ? (
            <>
              <div className="flex items-center mb-4">
                <span className="font-semibold w-32">{t(lang).order.shipment.status}:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${shipmentStatus.color}`}>
                  {shipmentStatus.status}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className="font-semibold w-32">{t(lang).order.shipment.address}:</span>
                <span className="break-words">{shipment.address}</span>
              </div>

              {shipment.created_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">{t(lang).order.shipment.created_at}:</span>
                  <span>{formatDate(Number(shipment.created_at))}</span>
                </div>
              )}

              {shipment.shipped_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">{t(lang).order.shipment.shipped_at}:</span>
                  <span>{formatDate(Number(shipment.shipped_at))}</span>
                </div>
              )}

              {shipment.delivered_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">{t(lang).order.shipment.delivered_at}:</span>
                  <span>{formatDate(Number(shipment.delivered_at))}</span>
                </div>
              )}

              {shipment.cancelled_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">{t(lang).order.shipment.cancelled_at}:</span>
                  <span className="text-red-600">{formatDate(Number(shipment.cancelled_at))}</span>
                </div>
              )}

              {shipment.payment_failed_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">{t(lang).order.shipment.payment_failed_at}:</span>
                  <span className="text-red-600">{formatDate(Number(shipment.payment_failed_at))}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">配送情報はありません</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t(lang).order.product.title}</h2>

        {paymentProducts && paymentProducts.length > 0 ? (
          <div className="space-y-4">
            {paymentProducts.map((product) => (
              <div key={product.id} className="flex flex-col sm:flex-row border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-3 sm:mb-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow sm:ml-4">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-700">{`${product.quantity} × ¥${product.price.toLocaleString()}`}</span>
                    <span className="font-semibold">¥{(product.price * product.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>{t(lang).order.product.total}:</span>
                <span>
                  ¥
                  {paymentProducts
                    .reduce((sum, product) => sum + product.price * (product.quantity || 1), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">商品情報はありません</p>
        )}
      </div>
    </div>
  );
};

export default Order;
