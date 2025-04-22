import type { Product, User } from "@/types";
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

export { executeQuery };
