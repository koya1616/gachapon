import { Client } from "pg";
import type { QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

export const executeQuery = async <T extends QueryResultRow = Record<string, unknown>>(
  query: string,
  params: unknown[] = [],
): Promise<T[]> => {
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
};

export const executeTransaction = async <T>(callback: (client: Client) => Promise<T>): Promise<T> => {
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
};

export const executeQueryWithClient = async <T extends QueryResultRow = Record<string, unknown>>(
  client: Client,
  query: string,
  params: unknown[] = [],
): Promise<T[]> => {
  const result: QueryResult<T> = await client.query(query, params);
  return result.rows;
};

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
  createPaypayPayment,
} from "./paypayPayments/query";
export { createPaypayPaymentWithTransaction } from "./paypayPayments/transaction";
export { createLotteryProducts, getLotteryProductsByLotteryEventId } from "./lotteryProducts/query";
export { createLotteryProductsWithTransaction } from "./lotteryProducts/transaction";
export { createLotteryEventWithTransaction } from "./lotteryEvents/transaction";
export { getLotteryEvents, createLotteryEvent, findLotteryEventById, updateLotteryEvent } from "./lotteryEvents/query";
export { createPaymentProductsWithTransaction } from "./paymentProducts/transaction";
export {
  getPaymentProductsByPaypayPaymentId,
  createPaymentProducts,
  findPaymentProductByPaypayPaymentIdAndProductId,
} from "./paymentProducts/query";
export {
  findAddressByUserId,
  createAddress,
  updateAddress,
} from "./addresses/query";
export { findUserByEmail, createUser } from "./users/query";
export { createShipmentWithTransaction } from "./shipments/transaction";
export {
  findShipmentByMerchantPaymentId,
  findShipmentByMerchantPaymentIdAndUserId,
  updateShipmentStatus,
  createShipment,
} from "./shipments/query";
