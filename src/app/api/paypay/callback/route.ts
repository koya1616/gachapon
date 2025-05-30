import { USER_TOKEN } from "@/const/cookies";
import { findPaypayPaymentByMerchantPaymentId } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const merchantPaymentId = request.nextUrl.searchParams.get("merchantPaymentId") || "";

  const paypayPayment = await findPaypayPaymentByMerchantPaymentId(merchantPaymentId);
  if (!paypayPayment) {
    return NextResponse.json({ message: "Not Found", data: null }, { status: 404 });
  }

  if (paypayPayment.user_id !== userToken.id) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  redirect(`/ja/payment/paypay/${paypayPayment.merchant_payment_id}`);
}
