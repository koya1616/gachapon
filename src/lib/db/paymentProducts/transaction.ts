import type { PaymentProduct } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient } from "..";

export const createPaymentProductsWithTransaction = async (
  client: Client,
  paymentProducts: Omit<PaymentProduct, "id" | "name" | "image">[],
): Promise<PaymentProduct[]> => {
  if (paymentProducts.length === 0) return [];

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
  return await executeQueryWithClient(client, query, params);
};
