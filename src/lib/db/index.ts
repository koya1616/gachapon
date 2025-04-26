import type { Address, LotteryEvent, Order, PaymentProduct, PaypayPayment, Product, Shipment, User } from "@/types";
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

export async function createAndGetPaypayPaymentWithTransaction(
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

export async function createPaymentProductsWithTransaction(
  client: Client,
  paymentProducts: Omit<PaymentProduct, "id" | "name" | "image">[],
): Promise<void> {
  if (paymentProducts.length === 0) return;

  const placeholders = paymentProducts
    .map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)
    .join(", ");

  const query = `
    INSERT INTO payment_products (paypay_payment_id, quantity, price, product_id)
    VALUES ${placeholders}
  `;
  const params = paymentProducts.flatMap((product) => [
    product.paypay_payment_id,
    product.quantity,
    product.price,
    product.product_id,
  ]);
  await executeQueryWithClient(client, query, params);
}

export async function getPaymentProductsByPaypayPaymentId(paypay_payment_id: number): Promise<PaymentProduct[]> {
  const query = `
    SELECT
      pp.id AS id,
      pp.paypay_payment_id AS paypay_payment_id,
      pp.quantity AS quantity,
      pp.price AS price,
      pp.product_id AS product_id,
      p.name AS name,
      p.image AS image
    FROM payment_products pp
    INNER JOIN products p ON pp.product_id = p.id
    WHERE pp.paypay_payment_id = $1
  `;
  const params = [paypay_payment_id];
  return executeQuery<PaymentProduct>(query, params);
}

export async function findProductById(id: number): Promise<Product | null> {
  const query = "SELECT * FROM products WHERE id = $1 LIMIT 1";
  const params = [id];
  const products = await executeQuery<Product>(query, params);
  return products.length > 0 ? products[0] : null;
}

export async function updateProductById(id: number, productData: Partial<Product>): Promise<Product | null> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramCounter = 1;

  if (productData.name !== undefined) {
    updates.push(`name = $${paramCounter++}`);
    values.push(productData.name);
  }

  if (productData.price !== undefined) {
    updates.push(`price = $${paramCounter++}`);
    values.push(productData.price);
  }

  if (productData.stock_quantity !== undefined) {
    updates.push(`stock_quantity = $${paramCounter++}`);
    values.push(productData.stock_quantity);
  }

  if (updates.length === 0) {
    return findProductById(id);
  }

  values.push(id);

  const query = `
    UPDATE products
    SET ${updates.join(", ")}
    WHERE id = $${paramCounter}
    RETURNING *
  `;

  const products = await executeQuery<Product>(query, values);
  return products.length > 0 ? products[0] : null;
}

export async function getLotteryEvents(): Promise<LotteryEvent[]> {
  const query = `
    SELECT * FROM lottery_events
  `;
  return executeQuery<LotteryEvent>(query);
}

export async function createLotteryEventWithTransaction(
  client: Client,
  lotteryEvent: Omit<LotteryEvent, "id" | "created_at">,
): Promise<LotteryEvent> {
  const query = `
    INSERT INTO lottery_events (name, description, start_at, end_at, result_at, payment_deadline_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const params = [
    lotteryEvent.name,
    lotteryEvent.description,
    lotteryEvent.start_at,
    lotteryEvent.end_at,
    lotteryEvent.result_at,
    lotteryEvent.payment_deadline_at,
  ];
  const result = await executeQueryWithClient<LotteryEvent>(client, query, params);
  return result[0];
}

export async function createLotteryProductsWithTransaction(
  client: Client,
  lotteryProducts: Array<{
    lottery_event_id: number;
    product_id: number;
    quantity_available: number;
  }>,
): Promise<void> {
  if (lotteryProducts.length === 0) return;

  const placeholders = lotteryProducts.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(", ");

  const values = lotteryProducts.flatMap((product) => [
    product.lottery_event_id,
    product.product_id,
    product.quantity_available,
  ]);

  const query = `
    INSERT INTO lottery_products (lottery_event_id, product_id, quantity_available)
    VALUES ${placeholders}
  `;
  await executeQueryWithClient(client, query, values);
}

export { executeQuery };
