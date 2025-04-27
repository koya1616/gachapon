import type { PaypayPayment } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient } from "..";

export async function createPaypayPaymentWithTransaction(
  client: Client,
  paypayPayment: Omit<PaypayPayment, "id" | "created_at">,
): Promise<PaypayPayment | null> {
  const query = `
    INSERT INTO paypay_payments (user_id, merchant_payment_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const params = [paypayPayment.user_id, paypayPayment.merchant_payment_id];
  const results = await executeQueryWithClient<PaypayPayment>(client, query, params);
  return results.length > 0 ? results[0] : null;
}
