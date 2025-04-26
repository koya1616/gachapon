import PAYPAY from "@paypayopa/paypayopa-sdk-node";

const PAYPAY_MERCHANT_ID = process.env.PAYPAY_MERCHANT_ID || "";
const PAYPAY_API_KEY = process.env.PAYPAY_API_KEY || "";
const PAYPAY_API_SECRET = process.env.PAYPAY_API_SECRET || "";
const PAYPAY_REDIRECT_URL = process.env.PAYPAY_REDIRECT_URL || "";

// https://github.dev/paypay/paypayopa-sdk-node
// https://www.paypay.ne.jp/opa/doc/jp/v1.0/dynamicqrcode#tag/%E6%B1%BA%E6%B8%88/operation/createQRCode
PAYPAY.Configure({
  env: "STAGING",
  clientId: PAYPAY_API_KEY,
  clientSecret: PAYPAY_API_SECRET,
  merchantId: PAYPAY_MERCHANT_ID,
});

type PaypayQRCodeCreateResponse = { data: { url: string } };
export const paypayQRCodeCreate = async ({
  merchantPaymentId,
  orderItems,
}: {
  merchantPaymentId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    productId: string;
    unitPrice: {
      amount: number;
      currency: "JPY";
    };
  }>;
}): Promise<PaypayQRCodeCreateResponse | null> => {
  const itemDescription =
    orderItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ")
      .substring(0, 200) + (orderItems.length > 200 ? "..." : "");

  const response = await PAYPAY.QRCodeCreate({
    merchantPaymentId: merchantPaymentId,
    amount: {
      amount: orderItems.reduce((total, item) => total + item.unitPrice.amount * item.quantity, 0),
      currency: "JPY",
    },
    codeType: "ORDER_QR",
    redirectUrl: `${PAYPAY_REDIRECT_URL}?merchantPaymentId=${merchantPaymentId}`,
    redirectType: "WEB_LINK",
    orderItems: orderItems,
    orderDescription: itemDescription,
  });
  return "BODY" in response ? (response.BODY as PaypayQRCodeCreateResponse) : null;
};

export type PaypayGetCodePaymentDetailsResponse = {
  data: {
    status: "CREATED" | "AUTHORIZED" | "REAUTHORIZING" | "COMPLETED" | "REFUNDED" | "FAILED" | "CANCELED" | "EXPIRED";
    requestedAt: number;
    acceptedAt: number;
    amount: {
      amount: number;
    };
  };
};
export const paypayGetCodePaymentDetails = async (
  merchantPaymentId: string,
): Promise<PaypayGetCodePaymentDetailsResponse | null> => {
  const response = await PAYPAY.GetCodePaymentDetails([merchantPaymentId]);
  return "BODY" in response ? (response.BODY as PaypayGetCodePaymentDetailsResponse) : null;
};
