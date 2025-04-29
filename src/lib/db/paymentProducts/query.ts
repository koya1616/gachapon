import type { PaymentProduct } from "@/types";
import { executeQuery } from "..";

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

export async function createPaymentProducts(
  paymentProducts: Omit<PaymentProduct, "id" | "name" | "image">[],
): Promise<PaymentProduct[]> {
  const placeholders = paymentProducts
    .map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)
    .join(", ");

  const query = `
    INSERT INTO payment_products (paypay_payment_id, quantity, price, product_id)
    VALUES ${placeholders}
    RETURNING *
  `;
  const params = paymentProducts.flatMap((product) => [
    product.paypay_payment_id,
    product.quantity,
    product.price,
    product.product_id,
  ]);
  return await executeQuery<PaymentProduct>(query, params);
}

export async function findPaymentProductByPaypayPaymentIdAndProductId(
  paypay_payment_id: number,
  product_id: number,
): Promise<PaymentProduct | null> {
  const query = `
    SELECT *
    FROM payment_products
    WHERE payment_products.paypay_payment_id = $1 AND payment_products.product_id = $2
  `;
  const params = [paypay_payment_id, product_id];
  const result = await executeQuery<PaymentProduct>(query, params);
  return result.length > 0 ? result[0] : null;
}
