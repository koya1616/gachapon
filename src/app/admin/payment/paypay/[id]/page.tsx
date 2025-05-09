import { cookies } from "next/headers";
import Order from "@/components/Order";
import { findShipmentByMerchantPaymentId, getPaymentProductsByPaypayPaymentId } from "@/lib/db";
import { paypayGetCodePaymentDetails, type PaypayGetCodePaymentDetailsResponse } from "@/lib/paypay";
import { ADMIN_CODE } from "@/const/cookies";
import { redirect } from "next/navigation";
import ShipmentStatusActions from "./_components/ShipmentStatusActions";
import type { PaymentProduct, Shipment } from "@/types";

interface PayPayPageLogic {
  id: string;
  paymentDetails: PaypayGetCodePaymentDetailsResponse | null;
  shipment: Shipment | null;
  paymentProducts: PaymentProduct[];
}

export const PayPayPageView = ({ id, paymentDetails, shipment, paymentProducts }: PayPayPageLogic) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">決済 ID: {id}</h1>

      <Order paymentDetails={paymentDetails} shipment={shipment} paymentProducts={paymentProducts} lang="ja" />
      {shipment && <ShipmentStatusActions shipment={shipment} />}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">デバッグ情報</h3>
        <details>
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">決済詳細 JSON</summary>
          <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
            {JSON.stringify(paymentDetails, null, 2)}
          </pre>
        </details>
        <details>
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">配送情報 JSON</summary>
          <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">{JSON.stringify(shipment, null, 2)}</pre>
        </details>
        <details>
          <summary className="cursor-pointer text-sm text-gray-600">商品情報 JSON</summary>
          <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
            {JSON.stringify(paymentProducts, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

const usePayPayPage = async (id: string): Promise<PayPayPageLogic> => {
  const paymentDetails = await paypayGetCodePaymentDetails(id);
  const shipment = await findShipmentByMerchantPaymentId(id);
  const paymentProducts = shipment ? await getPaymentProductsByPaypayPaymentId(shipment.paypay_payment_id) : [];

  return {
    id,
    paymentDetails,
    shipment,
    paymentProducts,
  };
};

const PayPayPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return redirect("/admin/login");
  }

  const { id } = await params;
  const logic = await usePayPayPage(id);
  return <PayPayPageView {...logic} />;
};

export default PayPayPage;
