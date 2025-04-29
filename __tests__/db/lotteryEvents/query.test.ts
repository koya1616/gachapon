import { beforeAll, describe, expect, it } from "vitest";
import { LotteryEventFactory } from "../../factory/lotteryEvent";
import { createLotteryEvent, getLotteryEvents } from "@/lib/db";

let lotteryEvent: LotteryEventFactory;

const setUpLotteryEvent = async () => {
  return await LotteryEventFactory.create();
};

describe("LotteryEventsテーブルに関するテスト", () => {
  describe("createLotteryEvent", () => {
    it("抽選イベントレコードが作成できること", async () => {
      const result = await createLotteryEvent({
        name: "名前",
        description: "説明",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: 0,
      });
      expect(result.id).not.toBeNull();
      expect(result.name).toBe("名前");
      expect(result.description).toBe("説明");
      expect(Number(result.start_at)).toBeGreaterThan(0);
      expect(Number(result.end_at)).toBeGreaterThanOrEqual(Number(result.start_at));
      expect(Number(result.result_at)).toBeGreaterThanOrEqual(Number(result.end_at));
      expect(Number(result.payment_deadline_at)).toBeGreaterThanOrEqual(Number(result.result_at));
      expect(result.status).toBe(0);
    });
  });

  describe("getLotteryEvents", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
    });

    it("全ての商品情報を取得できること", async () => {
      const result = await getLotteryEvents();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
});
