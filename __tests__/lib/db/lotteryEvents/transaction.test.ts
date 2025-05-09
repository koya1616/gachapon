import { createLotteryEventWithTransaction, executeTransaction, getLotteryEvents } from "@/lib/db";
import type { LotteryEvent } from "@/types";
import { describe, expect, it } from "vitest";

type LotteryEventKeys = keyof LotteryEvent;
const typeKeys: LotteryEventKeys[] = [
  "id",
  "name",
  "description",
  "start_at",
  "end_at",
  "result_at",
  "payment_deadline_at",
  "status",
  "created_at",
];

describe("LotteryEventsテーブルのトランザクションに関するテスト", () => {
  describe("createLotteryEventWithTransaction", () => {
    it("トランザクション内でエラーが発生しない場合、抽選イベントレコードが作成されること", async () => {
      const result = await executeTransaction(async (client) => {
        return await createLotteryEventWithTransaction(client, {
          name: "名前",
          description: "説明",
          start_at: Date.now(),
          end_at: Date.now() + 86400000,
          result_at: Date.now() + 172800000,
          payment_deadline_at: Date.now() + 259200000,
          status: 0,
        });
      });
      expect(result.id).not.toBeNull();
      expect(result.name).toBe("名前");
      expect(result.description).toBe("説明");
      expect(Number(result.start_at)).toBeGreaterThan(0);
      expect(Number(result.end_at)).toBeGreaterThanOrEqual(Number(result.start_at));
      expect(Number(result.result_at)).toBeGreaterThanOrEqual(Number(result.end_at));
      expect(Number(result.payment_deadline_at)).toBeGreaterThanOrEqual(Number(result.result_at));
      expect(result.status).toBe(0);
      expect(Object.keys(result)).toEqual(expect.arrayContaining(typeKeys));
    });

    it("トランザクション内でエラーが発生した場合、抽選イベントレコードが作成されないこと", async () => {
      await expect(
        executeTransaction(async (client) => {
          await createLotteryEventWithTransaction(client, {
            name: "名前",
            description: "説明",
            start_at: Date.now(),
            end_at: Date.now() + 86400000,
            result_at: Date.now() + 172800000,
            payment_deadline_at: Date.now() + 259200000,
            status: 0,
          });

          throw new Error("トランザクション内でエラーが発生しました");
        }),
      ).rejects.toThrow("トランザクション内でエラーが発生しました");
    });
  });
});
