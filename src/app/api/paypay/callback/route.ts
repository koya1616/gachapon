import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { USER_TOKEN } from "@/const/cookies";
import { findPaypayPaymentByMerchantPaymentId } from "@/lib/db";

/**
 * TODO: 決済処理
 * 1. QRコード作成すると同時に、merchantPaymentIdをDBに保存。配送と商品購入レコードの作成
 *   ・merchantPaymentIdの生成ロジック:
 *     - "PAYPAY_"のprefix
 *     - user_id
 *     - ランダム文字列: crypto.randomUUID().split('-')[0]
 *     - timestamp: new Date().toISOString().replace(/[-:T.Z]/g, '')
 */
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

  return NextResponse.redirect(`/ja/payment/paypay/${paypayPayment.merchant_payment_id}`);
}
