import type { LotteryEvent } from "@/types";
import { executeQuery } from "..";

export async function getLotteryEvents(): Promise<LotteryEvent[]> {
  const query = `
    SELECT * FROM lottery_events
  `;
  return executeQuery<LotteryEvent>(query);
}

export async function createLotteryEvent(lotteryEvent: Omit<LotteryEvent, "id" | "created_at">): Promise<LotteryEvent> {
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
}
