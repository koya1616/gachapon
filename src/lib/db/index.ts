import type { Shipment, User } from "@/types";
import { Client } from "pg";
import type { QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

async function executeQuery<T extends QueryResultRow = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    const result: QueryResult<T> = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function executeTransaction<T>(callback: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function executeQueryWithClient<T extends QueryResultRow = Record<string, unknown>>(
  client: Client,
  query: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result: QueryResult<T> = await client.query(query, params);
  return result.rows;
}

export async function createShipmentWithTransaction(
  client: Client,
  shipment: Pick<Shipment, "paypay_payment_id" | "address">,
): Promise<void> {
  const query = `
    INSERT INTO shipments (paypay_payment_id, address)
    VALUES ($1, $2)
  `;
  const params = [shipment.paypay_payment_id, shipment.address];
  await executeQueryWithClient(client, query, params);
}

export async function findShipmentByMerchantPaymentId(merchant_payment_id: string): Promise<Shipment | null> {
  const query = `
    SELECT s.*
    FROM paypay_payments pp
    INNER JOIN shipments s ON pp.id = s.paypay_payment_id
    WHERE pp.merchant_payment_id = $1
    LIMIT 1
  `;
  const params = [merchant_payment_id];
  const results = await executeQuery<Shipment>(query, params);
  return results.length > 0 ? results[0] : null;
}

export async function findShipmentByMerchantPaymentIdAndUserId(
  merchant_payment_id: string,
  user_id: number,
): Promise<Shipment | null> {
  const query = `
    SELECT s.*
    FROM paypay_payments pp
    INNER JOIN shipments s ON pp.id = s.paypay_payment_id
    WHERE pp.merchant_payment_id = $1 AND pp.user_id = $2
    LIMIT 1
  `;
  const params = [merchant_payment_id, user_id];
  const results = await executeQuery<Shipment>(query, params);
  return results.length > 0 ? results[0] : null;
}

export async function updateShipmentStatus(
  id: number,
  status: "shipped" | "delivered" | "payment_failed" | "cancelled",
): Promise<void> {
  const statusMap = {
    shipped: "shipped_at",
    delivered: "delivered_at",
    payment_failed: "payment_failed_at",
    cancelled: "cancelled_at",
  };

  const query = `
    UPDATE shipments
    SET ${statusMap[status]} = $1
    WHERE id = $2
  `;

  const params = [Date.now(), id];
  await executeQuery(query, params);
}

export { executeQuery };
export {
  getProducts,
  createProducts,
  findProductById,
  updateProductById,
} from "./products/query";
export {
  findPaypayPaymentByMerchantPaymentId,
  getPaypayPayments,
  getPaypayPaymentsByUserId,
} from "./paypayPayments/query";
export { createAndGetPaypayPaymentWithTransaction } from "./paypayPayments/transaction";
export { createLotteryProductsWithTransaction } from "./lotteryProducts/transaction";
export { createLotteryEventWithTransaction } from "./lotteryEvents/transaction";
export { getLotteryEvents } from "./lotteryEvents/query";
export { createPaymentProductsWithTransaction } from "./paymentProducts/transaction";
export { getPaymentProductsByPaypayPaymentId } from "./paymentProducts/query";
export {
  findAddressByUserId,
  createAddress,
  updateAddress,
} from "./addresses/query";
export { findUserByEmail, createUser } from "./users/query";
