import type { Order, PaypayPayment } from "@/types";
import { executeQuery } from "..";

export async function getPaypayPayments(): Promise<Order[]> {
  const query = `
  SELECT
    pp.id AS paypay_payment_id,
    pp.user_id AS user_id,
    pp.merchant_payment_id AS merchant_payment_id,
    s.address AS address,
    s.shipped_at AS shipped_at,
    s.delivered_at AS delivered_at,
    s.payment_failed_at AS payment_failed_at,
    s.cancelled_at AS cancelled_at,
    s.created_at AS created_at
  FROM paypay_payments pp
  INNER JOIN shipments s ON pp.id = s.paypay_payment_id
`;
  return executeQuery<Order>(query);
}

export async function getPaypayPaymentsByUserId(user_id: number): Promise<Order[]> {
  const query = `
    SELECT
      pp.id AS paypay_payment_id,
      pp.user_id AS user_id,
      pp.merchant_payment_id AS merchant_payment_id,
      s.address AS address,
      s.shipped_at AS shipped_at,
      s.delivered_at AS delivered_at,
      s.payment_failed_at AS payment_failed_at,
      s.cancelled_at AS cancelled_at,
      s.created_at AS created_at
    FROM paypay_payments pp
    INNER JOIN shipments s ON pp.id = s.paypay_payment_id
    WHERE pp.user_id = $1
  `;
  const params = [user_id];
  return executeQuery<Order>(query, params);
}

export async function findPaypayPaymentByMerchantPaymentId(merchant_payment_id: string): Promise<PaypayPayment | null> {
  const query = `
    SELECT * FROM paypay_payments WHERE merchant_payment_id = $1 LIMIT 1
  `;
  const params = [merchant_payment_id];
  const results = await executeQuery<PaypayPayment>(query, params);
  return results.length > 0 ? results[0] : null;
}

export async function createPaypayPayment(paypayPayment: Omit<PaypayPayment, "id">): Promise<PaypayPayment> {
  const query = `
    INSERT INTO paypay_payments (user_id, merchant_payment_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const params = [paypayPayment.user_id, paypayPayment.merchant_payment_id];
  const results = await executeQuery<PaypayPayment>(query, params);
  return results[0];
}
