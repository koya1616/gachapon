import { NextResponse, type NextRequest } from "next/server";
import { PAYPAY_GET_CODE_PAYMENT_DETAILS, PAYPAY_QR_CODE_CREATE, PAYPAY_TYPE } from "@/const/header";
import { paypayGetCodePaymentDetails, paypayQRCodeCreate } from "@/lib/paypay";

export async function POST(request: NextRequest) {
  const paypayType = request.headers.get(PAYPAY_TYPE);
  const payload = await request.json();

  if (paypayType === PAYPAY_QR_CODE_CREATE) {
    const body = await paypayQRCodeCreate(payload.merchantPaymentId, payload.amount);
    return NextResponse.json({ url: body ? body.data.url : null }, { status: body ? 200 : 500 });
  }

  if (paypayType === PAYPAY_GET_CODE_PAYMENT_DETAILS) {
    const body = await paypayGetCodePaymentDetails(payload.merchantPaymentId);
    return NextResponse.json({ status: body ? body.data.status : null }, { status: body ? 200 : 500 });
  }
}
