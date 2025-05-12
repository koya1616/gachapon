import {
  createLotteryProducts,
  deleteLotteryProductsByLotteryEventIdAndProductId,
  getLotteryProductsByLotteryEventId,
} from "@/lib/db";
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

describe("LotteryProductsテーブルに関するテスト", () => {
  describe("createLotteryProducts", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
      product = await setUpProduct();
    });

    it("抽選商品レコードが作成できること", async () => {
      const result = await createLotteryProducts([
        {
          lottery_event_id: lotteryEvent.id,
          product_id: product.id,
          quantity_available: 10,
        },
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].id).not.toBeNull();
      expect(result[0].lottery_event_id).toBe(lotteryEvent.id);
      expect(result[0].product_id).toBe(product.id);
      expect(result[0].quantity_available).toBe(10);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("getLotteryProductsByLotteryEventId", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
      product = await setUpProduct();
    });

    it("抽選商品レコードが取得できること", async () => {
      const lotteryProducts = await createLotteryProducts([
        {
          lottery_event_id: lotteryEvent.id,
          product_id: product.id,
          quantity_available: 10,
        },
      ]);

      const result = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(lotteryProducts[0].id);
      expect(result[0].lottery_event_id).toBe(lotteryEvent.id);
      expect(result[0].product_id).toBe(product.id);
      expect(result[0].quantity_available).toBe(10);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("deleteLotteryProductsByLotteryEventIdAndProductId", () => {
    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
      product = await setUpProduct();
    });

    it("抽選商品レコードが削除できること", async () => {
      await createLotteryProducts([
        {
          lottery_event_id: lotteryEvent.id,
          product_id: product.id,
          quantity_available: 10,
        },
      ]);

      await deleteLotteryProductsByLotteryEventIdAndProductId(lotteryEvent.id, product.id);

      const result = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      expect(result).toHaveLength(0);
    });
  });
});
