import type { Address, PaypayPayment, Product, User } from "@/types";
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

export { executeQuery };
