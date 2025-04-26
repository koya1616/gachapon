import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { USER_TOKEN } from "@/const/cookies";
import { findPaypayPaymentByMerchantPaymentId } from "@/lib/db/index";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const merchantPaymentId = request.nextUrl.searchParams.get("merchantPaymentId") || "";

  const paypayPayment = await findPaypayPaymentByMerchantPaymentId(merchantPaymentId);
  if (!paypayPayment) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  if (paypayPayment.user_id !== userToken.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  redirect(`/ja/payment/paypay/${paypayPayment.merchant_payment_id}`);
}
