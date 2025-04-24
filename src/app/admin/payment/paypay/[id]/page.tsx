import { findShipmentByMerchantPaymentId } from "@/lib/db";
import { paypayGetCodePaymentDetails } from "@/lib/paypay";
import type { Shipment } from "@/types";

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
  if (shipment?.payment_failed_at) return { status: "支払い失敗", color: "bg-red-100 text-red-800" };
  if (shipment?.delivered_at) return { status: "配送完了", color: "bg-green-100 text-green-800" };
  if (shipment?.shipped_at) return { status: "配送中", color: "bg-blue-100 text-blue-800" };
  return { status: "準備中", color: "bg-yellow-100 text-yellow-800" };
}

function formatDate(timestamp: number | null) {
  if (!timestamp) return "未設定";
  return new Date(timestamp).toLocaleString("ja-JP");
}

export default async function PayPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paymentDetails = await paypayGetCodePaymentDetails(id);
  const shipment = await findShipmentByMerchantPaymentId(id);

  const status = paymentDetails?.data?.status || "不明";
  const statusColor = statusColors[status] || "bg-gray-100 text-gray-800";
  const shipmentStatus = getShipmentStatus(shipment);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">決済詳細 ID: {id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">決済情報</h2>

          <div className="flex items-center mb-4">
            <span className="font-semibold w-32">ステータス:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{status}</span>
          </div>

          {paymentDetails?.data?.amount && (
            <div className="flex items-center mb-4">
              <span className="font-semibold w-32">金額:</span>
              <span className="text-lg font-bold">¥{paymentDetails.data.amount.amount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center mb-4">
            <span className="font-semibold w-32">リクエスト日時:</span>
            <span>{paymentDetails?.data?.requestedAt ? formatDate(paymentDetails.data.requestedAt) : "不明"}</span>
          </div>

          <div className="flex items-center mb-4">
            <span className="font-semibold w-32">承認日時:</span>
            <span>{paymentDetails?.data?.acceptedAt ? formatDate(paymentDetails.data.acceptedAt) : "未承認"}</span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">配送情報</h2>

          {shipment ? (
            <>
              <div className="flex items-center mb-4">
                <span className="font-semibold w-32">配送ステータス:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${shipmentStatus.color}`}>
                  {shipmentStatus.status}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className="font-semibold w-32">配送先住所:</span>
                <span className="break-words">{shipment.address}</span>
              </div>

              {shipment.shipped_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">発送日時:</span>
                  <span>{formatDate(Number(shipment.shipped_at))}</span>
                </div>
              )}

              {shipment.delivered_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">到着日時:</span>
                  <span>{formatDate(Number(shipment.delivered_at))}</span>
                </div>
              )}

              {shipment.created_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">作成日時:</span>
                  <span>{formatDate(Number(shipment.created_at))}</span>
                </div>
              )}

              {shipment.payment_failed_at && (
                <div className="flex items-center mb-4">
                  <span className="font-semibold w-32">支払い失敗日時:</span>
                  <span className="text-red-600">{formatDate(Number(shipment.payment_failed_at))}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">配送情報はありません</p>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">デバッグ情報</h3>
        <details>
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">決済詳細 JSON</summary>
          <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
            {JSON.stringify(paymentDetails, null, 2)}
          </pre>
        </details>
        <details>
          <summary className="cursor-pointer text-sm text-gray-600">配送情報 JSON</summary>
          <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">{JSON.stringify(shipment, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}
