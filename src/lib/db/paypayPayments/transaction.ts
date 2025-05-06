import type { PaypayPayment } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient } from "..";

export const createPaypayPaymentWithTransaction = async (
  client: Client,
  paypayPayment: Omit<PaypayPayment, "id">,
): Promise<PaypayPayment> => {
  const query = `
    INSERT INTO paypay_payments (user_id, merchant_payment_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const params = [paypayPayment.user_id, paypayPayment.merchant_payment_id];
  const results = await executeQueryWithClient<PaypayPayment>(client, query, params);
  return results[0];
};
