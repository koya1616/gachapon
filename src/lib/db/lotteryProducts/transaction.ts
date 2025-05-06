import type { Client } from "pg";
import { executeQueryWithClient } from "..";
import type { LotteryProduct } from "@/types";

export const createLotteryProductsWithTransaction = async (
  client: Client,
  lotteryProducts: Array<{
    lottery_event_id: number;
    product_id: number;
    quantity_available: number;
  }>,
): Promise<LotteryProduct[]> => {
  if (lotteryProducts.length === 0) return [];

  const placeholders = lotteryProducts.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(", ");

  const values = lotteryProducts.flatMap((product) => [
    product.lottery_event_id,
    product.product_id,
    product.quantity_available,
  ]);

  const query = `
    INSERT INTO lottery_products (lottery_event_id, product_id, quantity_available)
    VALUES ${placeholders}
    RETURNING *
  `;
  return await executeQueryWithClient<LotteryProduct>(client, query, values);
};
