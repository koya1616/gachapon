import Order from "@/components/Order";
import { findShipmentByMerchantPaymentId } from "@/lib/db";
import { paypayGetCodePaymentDetails } from "@/lib/paypay";

export default async function PayPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paymentDetails = await paypayGetCodePaymentDetails(id);
  const shipment = await findShipmentByMerchantPaymentId(id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">決済詳細 ID: {id}</h1>

      <Order paymentDetails={paymentDetails} shipment={shipment} lang="ja" />

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
