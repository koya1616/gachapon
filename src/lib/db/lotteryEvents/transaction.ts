import type { LotteryEvent } from "@/types";
import type { Client } from "pg";
import { executeQueryWithClient } from "..";

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
