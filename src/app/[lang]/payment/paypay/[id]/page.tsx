import Order from "@/components/Order";
import { findShipmentByMerchantPaymentIdAndUserId, getPaymentProductsByPaypayPaymentId } from "@/lib/db";
import { paypayGetCodePaymentDetails } from "@/lib/paypay";
import { cookies } from "next/headers";
import { USER_TOKEN } from "@/const/cookies";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function UserPayPayPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
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

  const paymentDetails = await paypayGetCodePaymentDetails(id);
  const paymentProducts = await getPaymentProductsByPaypayPaymentId(shipment.paypay_payment_id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Order paymentDetails={paymentDetails} shipment={shipment} paymentProducts={paymentProducts} lang={l} />
    </div>
  );
}
