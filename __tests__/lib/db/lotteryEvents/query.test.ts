import {
  createLotteryEvent,
  findLotteryEventById,
  getLotteryEvents,
  getLotteryEventsByProductId,
  updateLotteryEvent,
} from "@/lib/db";
import type { LotteryEvent } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";
import { LotteryEventFactory } from "../../../factory/lotteryEvent";
import { ProductFactory } from "../../../factory/product";

let lotteryEvent: LotteryEventFactory;

const setUpLotteryEvent = async () => {
  return await LotteryEventFactory.create();
};

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
      expect(Object.keys(result)).toEqual(expect.arrayContaining(typeKeys));
    });
  });

  describe("getLotteryEvents", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
    });

    it("全ての抽選イベントを取得できること", async () => {
      const result = await getLotteryEvents();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(typeKeys));
    });
  });

  describe("findLotteryEventById", () => {
    let createdLotteryEvent: LotteryEvent;

    beforeAll(async () => {
      createdLotteryEvent = await setUpLotteryEvent();
    });

    it("IDによって抽選イベントを取得できること", async () => {
      const result = await findLotteryEventById(createdLotteryEvent.id);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdLotteryEvent.id);
      expect(result?.name).toBe(createdLotteryEvent.name);
      expect(result?.description).toBe(createdLotteryEvent.description);
      expect(Object.keys(result as LotteryEvent)).toEqual(expect.arrayContaining(typeKeys));
    });

    it("存在しないIDの場合はnullを返すこと", async () => {
      const result = await findLotteryEventById(999999);
      expect(result).toBeNull();
    });
  });

  describe("updateLotteryEvent", () => {
    let createdLotteryEvent: LotteryEvent;

    beforeAll(async () => {
      createdLotteryEvent = await setUpLotteryEvent();
    });

    it("抽選イベントを更新できること", async () => {
      const updatedLotteryEvent = {
        name: "新しい名前",
        description: "新しい説明",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: 2,
      };
      const result = await updateLotteryEvent(createdLotteryEvent.id, updatedLotteryEvent);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdLotteryEvent.id);
      expect(result?.name).toBe(updatedLotteryEvent.name);
      expect(result?.description).toBe(updatedLotteryEvent.description);
      expect(result?.start_at).toBe(String(updatedLotteryEvent.start_at));
      expect(result?.end_at).toBe(String(updatedLotteryEvent.end_at));
      expect(result?.result_at).toBe(String(updatedLotteryEvent.result_at));
      expect(result?.payment_deadline_at).toBe(String(updatedLotteryEvent.payment_deadline_at));
      expect(result?.status).toBe(updatedLotteryEvent.status);
      expect(Object.keys(result as LotteryEvent)).toEqual(expect.arrayContaining(typeKeys));
    });
  });

  describe("findLotteryEventByProductId", () => {
    let product: ProductFactory;
    beforeAll(async () => {
      product = await ProductFactory.create();
      lotteryEvent = await LotteryEventFactory.create(
        "抽選イベント1",
        "抽選イベントの説明",
        Date.now(),
        Date.now(),
        Date.now(),
        Date.now(),
        0,
        {
          lotteryProducts: {
            value: [
              {
                product_id: product.id,
                quantity_available: 10,
              },
            ],
          },
        },
      );
    });

    it("商品IDによって抽選イベントを取得できること", async () => {
      const result = await getLotteryEventsByProductId(product.id);
      expect(result).not.toBeNull();
      expect(result?.[0]?.id).toBe(lotteryEvent.id);
      expect(result?.[0]?.name).toBe(lotteryEvent.name);
      expect(result?.[0]?.description).toBe(lotteryEvent.description);
      expect(Object.keys(result?.[0] as LotteryEvent)).toEqual(expect.arrayContaining(typeKeys));
    });
  });
});
