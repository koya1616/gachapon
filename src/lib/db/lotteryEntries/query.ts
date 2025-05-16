import type { LotteryEntry } from "@/types";
import { executeQuery } from "..";

export const createLotteryEntry = async (
  lotteryEventId: number,
  userId: number,
  lotteryProductId: number,
): Promise<LotteryEntry> => {
  const query = `
    INSERT INTO lottery_entries (lottery_event_id, user_id, lottery_product_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const params = [lotteryEventId, userId, lotteryProductId];
  const result = await executeQuery<LotteryEntry>(query, params);
  return result[0];
};

export const getLotteryEntriesByLotteryEventId = async (lotteryEventId: number): Promise<LotteryEntry[]> => {
  const query = "SELECT * FROM lottery_entries WHERE lottery_event_id = $1";
  const params = [lotteryEventId];
  return executeQuery<LotteryEntry>(query, params);
};

export const getLotteryEntriesByUserIdAndProductId = async (
  userId: number,
  productId: number,
): Promise<LotteryEntry[]> => {
  const query = `
    SELECT * FROM lottery_entries
    WHERE user_id = $1 AND lottery_product_id = $2
  `;
  const params = [userId, productId];
  return executeQuery<LotteryEntry>(query, params);
};
