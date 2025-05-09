import { USER_TOKEN } from "@/const/cookies";
import { findShipmentByMerchantPaymentIdAndUserId, getPaymentProductsByPaypayPaymentId } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { paypayGetCodePaymentDetails } from "@/lib/paypay";
import type { PaypayGetCodePaymentDetailsResponse } from "@/lib/paypay";
import type { Lang, PaymentProduct, Shipment } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserPayPayPageView from "./_components/PageView";

export interface UserPayPayPageLogic {
  paymentDetails: PaypayGetCodePaymentDetailsResponse | null;
  shipment: Shipment | null;
  paymentProducts: PaymentProduct[];
  l: Lang;
}

const useUserPayPayPage = async (l: Lang, id: string, shipment: Shipment): Promise<UserPayPayPageLogic> => {
  const paymentDetails = await paypayGetCodePaymentDetails(id);
  const paymentProducts = await getPaymentProductsByPaypayPaymentId(shipment.paypay_payment_id);

  return {
    paymentDetails,
    shipment,
    paymentProducts,
    l,
  };
};

const UserPayPayPage = async ({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) => {
  const { lang, id } = await params;
  const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";

  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return redirect(`/${l}/login`);
  }

  const shipment = await findShipmentByMerchantPaymentIdAndUserId(id, userToken.id);
  if (!shipment) {
    return redirect(`/${l}/account`);
  }

  const logic = await useUserPayPayPage(l, id, shipment);
  return <UserPayPayPageView {...logic} />;
};

export default UserPayPayPage;
