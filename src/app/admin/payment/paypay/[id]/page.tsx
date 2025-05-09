import { ADMIN_CODE } from "@/const/cookies";
import { findShipmentByMerchantPaymentId, getPaymentProductsByPaypayPaymentId } from "@/lib/db";
import { type PaypayGetCodePaymentDetailsResponse, paypayGetCodePaymentDetails } from "@/lib/paypay";
import type { PaymentProduct, Shipment } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PayPayPageView from "./_components/PageView";

export interface PayPayPageLogic {
  id: string;
  paymentDetails: PaypayGetCodePaymentDetailsResponse | null;
  shipment: Shipment | null;
  paymentProducts: PaymentProduct[];
}

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
