import { NextResponse, type NextRequest } from "next/server";
import { PAYPAY_GET_CODE_PAYMENT_DETAILS, PAYPAY_QR_CODE_CREATE, PAYPAY_TYPE } from "@/const/header";
import {
  paypayGetCodePaymentDetails,
  type PaypayGetCodePaymentDetailsStatus,
  paypayQRCodeCreate,
  type PaypayQRCodeCreateRequest,
} from "@/lib/paypay";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { USER_TOKEN } from "@/const/cookies";
import {
  executeTransaction,
  findAddressByUserId,
  createPaypayPaymentWithTransaction,
  createShipmentWithTransaction,
  createPaymentProductsWithTransaction,
} from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const paypayType = request.headers.get(PAYPAY_TYPE);

  if (paypayType === PAYPAY_QR_CODE_CREATE) {
    const payload: PaypayQRCodeCreateRequest = await request.json();
    try {
      const body = await executeTransaction(async (client) => {
        const address = await findAddressByUserId(userToken.id);
        if (!address) {
          throw new Error("Address not found");
        }

        const payment = await createPaypayPaymentWithTransaction(client, {
          user_id: userToken.id,
          merchant_payment_id: payload.merchantPaymentId,
        });

        await createShipmentWithTransaction(client, {
          paypay_payment_id: payment.id,
          address: `${address.country} ${address.postal_code} ${address.address}`,
        });

        const paymentProductsData = payload.orderItems.map(
          (item: { quantity: number; unitPrice: { amount: number }; productId: string }) => ({
            paypay_payment_id: payment.id,
            quantity: item.quantity,
            price: item.unitPrice.amount,
            product_id: Number(item.productId),
          }),
        );

        await createPaymentProductsWithTransaction(client, paymentProductsData);

        const response = await paypayQRCodeCreate(payload);

        if (!response) {
          throw new Error("PayPay QR code URL not found");
        }

        return response;
      });

      return NextResponse.json({ message: "OK", data: { url: body.data.url } } as ApiResponse<{ url: string }>, {
        status: 200,
      });
    } catch (error) {
      console.error(`ERROR_CODE_0002: ${error}`);
      return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
    }
  }

  if (paypayType === PAYPAY_GET_CODE_PAYMENT_DETAILS) {
    const payload: { merchantPaymentId: string } = await request.json();
    const body = await paypayGetCodePaymentDetails(payload.merchantPaymentId);
    if (!body) {
      console.error(
        `ERROR_CODE_0003: PayPay payment details not found for merchantPaymentId ${payload.merchantPaymentId}`,
      );
      return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
    }
    return NextResponse.json(
      {
        message: "OK",
        data: { status: body.data.status },
      } as ApiResponse<{ status: PaypayGetCodePaymentDetailsStatus }>,
      { status: 200 },
    );
  }

  return NextResponse.json({ message: "Bad Request", data: null }, { status: 400 });
}
