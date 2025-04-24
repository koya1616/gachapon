import type { Address, Order, PaypayPayment, Product, Shipment, User } from "@/types";
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

export async function getProducts(): Promise<Product[]> {
  return executeQuery<Product>("SELECT * FROM products");
}

export async function createProducts(product: Omit<Product, "id" | "quantity">): Promise<void> {
  const query = `
    INSERT INTO products (name, price, image)
    VALUES ($1, $2, $3)
  `;
  const params = [product.name, product.price, product.image];
  await executeQuery(query, params);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT * FROM users WHERE email = $1 LIMIT 1
  `;
  const params = [email];
  const users = await executeQuery<User>(query, params);
  return users.length > 0 ? users[0] : null;
}

export async function createUser(email: string): Promise<void> {
  const query = `
    INSERT INTO users (email)
    VALUES ($1)
  `;
  const params = [email];
  await executeQuery(query, params);
}

export async function findAddressByUserId(user_id: number): Promise<Address | null> {
  const query = `
    SELECT * FROM addresses WHERE user_id = $1
  `;
  const params = [user_id];
  const addresses = await executeQuery<Address>(query, params);
  return addresses.length > 0 ? addresses[0] : null;
}

export async function createAddress(address: Omit<Address, "id">): Promise<void> {
  const query = `
    INSERT INTO addresses (user_id, name, country, postal_code, address)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const params = [address.user_id, address.name, address.country, address.postal_code, address.address];
  await executeQuery(query, params);
}

export async function updateAddress(address: Address): Promise<void> {
  const query = `
    UPDATE addresses
    SET name = $1, country = $2, postal_code = $3, address = $4
    WHERE id = $5
  `;
  const params = [address.name, address.country, address.postal_code, address.address, address.id];
  await executeQuery(query, params);
}

export async function getPaypayPayments(): Promise<PaypayPayment[]> {
  return executeQuery<PaypayPayment>("SELECT * FROM paypay_payments");
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

export { executeQuery };
