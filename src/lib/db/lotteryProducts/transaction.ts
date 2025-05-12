import type { LotteryProduct } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient, getLotteryProductsByLotteryEventId } from "..";

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

export const updateLotteryProductsWithTransaction = async (
  client: Client,
  lottery_event_id: number,
  lotteryProducts: Array<{
    product_id: number;
    quantity_available: number;
  }>,
): Promise<LotteryProduct[]> => {
  if (lotteryProducts.length === 0) return [];

  const existingProducts = await getLotteryProductsByLotteryEventId(lottery_event_id);

  const productsToCreate = lotteryProducts
    .filter((product) => !existingProducts.some((existing) => existing.product_id === product.product_id))
    .map((product) => ({
      lottery_event_id,
      product_id: product.product_id,
      quantity_available: product.quantity_available,
    }));

  const productsToUpdate = lotteryProducts.filter((product) =>
    existingProducts.some(
      (existing) =>
        existing.product_id === product.product_id && existing.quantity_available !== product.quantity_available,
    ),
  );

  const results: LotteryProduct[] = [];

  if (productsToCreate.length > 0) {
    const createdProducts = await createLotteryProductsWithTransaction(client, productsToCreate);
    results.push(...createdProducts);
  }

  if (productsToUpdate.length > 0) {
    const updatePromises = productsToUpdate.map(async (product) => {
      const query = `
        UPDATE lottery_products
        SET quantity_available = $1
        WHERE lottery_event_id = $2 AND product_id = $3
        RETURNING *
      `;
      const values = [product.quantity_available, lottery_event_id, product.product_id];
      const updatedProducts = await executeQueryWithClient<LotteryProduct>(client, query, values);
      return updatedProducts[0];
    });

    const updatedProducts = await Promise.all(updatePromises);
    results.push(...updatedProducts.filter((p): p is LotteryProduct => p !== null));
  }

  return results;
};
