import type { LotteryEvent } from "@/types";
import { executeQuery } from "..";

export const getLotteryEvents = async (): Promise<LotteryEvent[]> => {
  const query = `
    SELECT * FROM lottery_events
  `;
  return executeQuery<LotteryEvent>(query);
};

export const createLotteryEvent = async (
  lotteryEvent: Omit<LotteryEvent, "id" | "created_at">,
): Promise<LotteryEvent> => {
  const query = `
    INSERT INTO lottery_events (name, description, start_at, end_at, result_at, payment_deadline_at, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const params = [
    lotteryEvent.name,
    lotteryEvent.description,
    lotteryEvent.start_at,
    lotteryEvent.end_at,
    lotteryEvent.result_at,
    lotteryEvent.payment_deadline_at,
    lotteryEvent.status,
  ];
  const events = await executeQuery<LotteryEvent>(query, params);
  return events[0];
};

export const findLotteryEventById = async (id: number): Promise<LotteryEvent | null> => {
  const query = `
    SELECT * FROM lottery_events WHERE id = $1 LIMIT 1
  `;
  const params = [id];
  const result = await executeQuery<LotteryEvent>(query, params);
  return result.length > 0 ? result[0] : null;
};

export const updateLotteryEvent = async (
  id: number,
  lotteryEvent: Partial<Omit<LotteryEvent, "id" | "created_at">>,
): Promise<LotteryEvent | null> => {
  const updateFields: string[] = [];
  const values: (string | number | Date | null)[] = [];
  let paramIndex = 1;

  if (lotteryEvent.name !== undefined) {
    updateFields.push(`name = $${paramIndex++}`);
    values.push(lotteryEvent.name);
  }
  if (lotteryEvent.description !== undefined) {
    updateFields.push(`description = $${paramIndex++}`);
    values.push(lotteryEvent.description);
  }
  if (lotteryEvent.start_at !== undefined) {
    updateFields.push(`start_at = $${paramIndex++}`);
    values.push(lotteryEvent.start_at);
  }
  if (lotteryEvent.end_at !== undefined) {
    updateFields.push(`end_at = $${paramIndex++}`);
    values.push(lotteryEvent.end_at);
  }
  if (lotteryEvent.result_at !== undefined) {
    updateFields.push(`result_at = $${paramIndex++}`);
    values.push(lotteryEvent.result_at);
  }
  if (lotteryEvent.payment_deadline_at !== undefined) {
    updateFields.push(`payment_deadline_at = $${paramIndex++}`);
    values.push(lotteryEvent.payment_deadline_at);
  }
  if (lotteryEvent.status !== undefined) {
    updateFields.push(`status = $${paramIndex++}`);
    values.push(lotteryEvent.status);
  }

  if (updateFields.length === 0) {
    return findLotteryEventById(id);
  }

  values.push(id);

  const query = `
    UPDATE lottery_events
    SET ${updateFields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await executeQuery<LotteryEvent>(query, values);
  return result.length > 0 ? result[0] : null;
};

export const getLotteryEventsByProductId = async (productId: number): Promise<LotteryEvent[]> => {
  const query = `
    SELECT lottery_events.* FROM lottery_events
    JOIN lottery_products ON lottery_events.id = lottery_products.lottery_event_id
    WHERE lottery_products.product_id = $1
  `;
  const params = [productId];
  const result = await executeQuery<LotteryEvent>(query, params);
  return result;
};
