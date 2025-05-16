import { createLotteryEntry, getLotteryEntriesByLotteryEventId, getLotteryEntriesByUserIdAndProductId } from "@/lib/db";
import type { LotteryEntry } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";
import { LotteryEventFactory } from "../../../factory/lotteryEvent";
import { ProductFactory } from "../../../factory/product";
import { UserFactory } from "../../../factory/user";

let lotteryEvent: LotteryEventFactory;
let user: UserFactory;

const setUpLotteryEvent = async (withLotteryEntries: boolean) => {
  const product = await ProductFactory.create();
  return await LotteryEventFactory.create(
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
        options: {
          withLotteryEntries: withLotteryEntries,
        },
      },
    },
  );
};

type LotteryEntryKeys = keyof LotteryEntry;
const expectedKeys: LotteryEntryKeys[] = [
  "id",
  "lottery_event_id",
  "user_id",
  "lottery_product_id",
  "result",
  "created_at",
];

describe("LotteryEntriesテーブルに関するテスト", () => {
  describe("createLotteryEntry", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent(false);
      user = await UserFactory.create();
    });

    it("抽選エントリーレコードが作成できること", async () => {
      const result = await createLotteryEntry(lotteryEvent.id, user.id, lotteryEvent.lotteryProducts?.[0].id as number);
      expect(result).not.toBeNull();
      expect(result.id).not.toBeNull();
      expect(result.user_id).toBe(user.id);
      expect(result.lottery_event_id).toBe(lotteryEvent.id);
      expect(result.lottery_product_id).toBe(lotteryEvent.lotteryProducts?.[0].id);
      expect(result.result).toBe(0);
      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("getLotteryEntriesByLotteryEventId", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent(true);
    });

    it("抽選エントリーレコードが取得できること", async () => {
      const result = await getLotteryEntriesByLotteryEventId(lotteryEvent.id);
      const filteredEntries = result.filter((entry) => {
        return entry.lottery_event_id === lotteryEvent.id;
      });
      expect(filteredEntries).toHaveLength(1);
      expect(filteredEntries[0].lottery_event_id).toBe(lotteryEvent.id);
      expect(Object.keys(filteredEntries[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("getLotteryEntriesByUserIdAndProductId", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent(true);
    });

    it("抽選エントリーレコードが取得できること", async () => {
      expect(lotteryEvent.lotteryEntries).not.toBeNull();
      const result = await getLotteryEntriesByUserIdAndProductId(
        Number(lotteryEvent.lotteryEntries?.[0].user_id),
        Number(lotteryEvent.lotteryProducts?.[0].id),
      );
      expect(result).toHaveLength(1);
      expect(result[0].user_id).toBe(Number(lotteryEvent.lotteryEntries?.[0].user_id));
      expect(result[0].lottery_product_id).toBe(Number(lotteryEvent.lotteryProducts?.[0].id));
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
