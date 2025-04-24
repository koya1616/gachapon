import Order from "@/components/Order";
import { findShipmentByMerchantPaymentIdAndUserId } from "@/lib/db";
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
    redirect(`/${l}/login`);
  }

  const shipment = await findShipmentByMerchantPaymentIdAndUserId(id, userToken.id);
  if (!shipment) {
    redirect(`/${l}/account`);
  }

  const paymentDetails = await paypayGetCodePaymentDetails(id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">決済詳細 ID: {id}</h1>

      <Order paymentDetails={paymentDetails} shipment={shipment} lang={l} />
    </div>
  );
}
