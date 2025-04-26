import type { LotteryEvent } from "@/types";
import { executeQuery } from "..";

export async function getLotteryEvents(): Promise<LotteryEvent[]> {
  const query = `
    SELECT * FROM lottery_events
  `;
  return executeQuery<LotteryEvent>(query);
}
