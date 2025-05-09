import { createLotteryProductsWithTransaction, executeTransaction } from "@/lib/db";
import type { LotteryProduct } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";
import { LotteryEventFactory } from "../../../factory/lotteryEvent";
import { ProductFactory } from "../../../factory/product";

let lotteryEvent: LotteryEventFactory;
let product: ProductFactory;

const setUpLotteryEvent = async () => {
  return await LotteryEventFactory.create();
};

const setUpProduct = async () => {
  return await ProductFactory.create();
};

type LotteryProductKeys = keyof LotteryProduct;
const expectedKeys: LotteryProductKeys[] = ["id", "lottery_event_id", "product_id", "quantity_available", "created_at"];

describe("LotteryEventsテーブルのトランザクションに関するテスト", () => {
  describe("createLotteryEventWithTransaction", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
      product = await setUpProduct();
    });

    it("トランザクション内でエラーが発生しない場合、抽選イベントレコードが作成されること", async () => {
      const result = await executeTransaction(async (client) => {
        return await createLotteryProductsWithTransaction(client, [
          { lottery_event_id: lotteryEvent.id, product_id: product.id, quantity_available: 10 },
        ]);
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).not.toBeNull();
      expect(result[0].lottery_event_id).toBe(lotteryEvent.id);
      expect(result[0].product_id).toBe(product.id);
      expect(result[0].quantity_available).toBe(10);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });

    it("トランザクション内でエラーが発生した場合、抽選イベントレコードが作成されないこと", async () => {
      await expect(
        executeTransaction(async (client) => {
          await createLotteryProductsWithTransaction(client, [
            { lottery_event_id: lotteryEvent.id, product_id: product.id, quantity_available: 10 },
          ]);
          throw new Error("トランザクション内でエラーが発生しました");
        }),
      ).rejects.toThrow("トランザクション内でエラーが発生しました");
    });
  });
});
