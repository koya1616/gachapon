import { NextResponse, type NextRequest } from "next/server";
import { PAYPAY_GET_CODE_PAYMENT_DETAILS, PAYPAY_QR_CODE_CREATE, PAYPAY_TYPE } from "@/const/header";
import { paypayGetCodePaymentDetails, paypayQRCodeCreate } from "@/lib/paypay";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { USER_TOKEN } from "@/const/cookies";
import {
  executeTransaction,
  findAddressByUserId,
  createAndGetPaypayPaymentWithTransaction,
  createShipmentWithTransaction,
  createPaymentProductsWithTransaction,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const paypayType = request.headers.get(PAYPAY_TYPE);
  const payload = await request.json();

  if (paypayType === PAYPAY_QR_CODE_CREATE) {
    try {
      const body = await executeTransaction(async (client) => {
        const address = await findAddressByUserId(userToken.id);
        if (!address) {
          throw new Error("Address not found");
        }

        const payment = await createAndGetPaypayPaymentWithTransaction(client, {
          user_id: userToken.id,
          merchant_payment_id: payload.merchantPaymentId,
        });

        if (!payment) {
          throw new Error("Failed to create payment record");
        }

        await createShipmentWithTransaction(client, {
          paypay_payment_id: payment.id,
          address: `${address.country} ${address.postal_code} ${address.address}`,
        });

        const paymentProductsData = payload.orderItems.map(
          (item: { quantity: number; unitPrice: { amount: number }; productId: number }) => ({
            paypay_payment_id: payment.id,
            quantity: item.quantity,
            price: item.unitPrice.amount,
            product_id: item.productId,
          }),
        );

        await createPaymentProductsWithTransaction(client, paymentProductsData);

        const response = await paypayQRCodeCreate({
          merchantPaymentId: payload.merchantPaymentId,
          orderItems: payload.orderItems,
        });

        if (response && "data" in response) {
          if (!response.data.url) {
            throw new Error("PayPay QR code URL not found");
          }
        }

        return response;
      });

      return NextResponse.json({ url: body ? body.data.url : null }, { status: body ? 200 : 500 });
    } catch (error) {
      console.error("Error creating payment:", error);
      return NextResponse.json({ message: "Error creating payment" }, { status: 500 });
    }
  }

  if (paypayType === PAYPAY_GET_CODE_PAYMENT_DETAILS) {
    const body = await paypayGetCodePaymentDetails(payload.merchantPaymentId);
    return NextResponse.json({ status: body ? body.data.status : null }, { status: body ? 200 : 500 });
  }

  return NextResponse.json({ message: "Invalid request" }, { status: 400 });
}
