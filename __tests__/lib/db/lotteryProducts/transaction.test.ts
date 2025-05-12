import {
  createLotteryProductsWithTransaction,
  executeTransaction,
  getLotteryProductsByLotteryEventId,
  updateLotteryProductsWithTransaction,
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

describe("LotteryProductsテーブルのトランザクションに関するテスト", () => {
  describe("createLotteryProductsWithTransaction", () => {
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

  describe("updateLotteryProductsWithTransaction", () => {
    let product2: ProductFactory;

    beforeAll(async () => {
      lotteryEvent = await setUpLotteryEvent();
      product = await setUpProduct();
      product2 = await setUpProduct();

      await executeTransaction(async (client) => {
        return await createLotteryProductsWithTransaction(client, [
          { lottery_event_id: lotteryEvent.id, product_id: product.id, quantity_available: 10 },
        ]);
      });
    });

    it("新しい商品を追加できること", async () => {
      const result = await executeTransaction(async (client) => {
        return await updateLotteryProductsWithTransaction(client, lotteryEvent.id, [
          { product_id: product2.id, quantity_available: 5 },
        ]);
      });

      expect(result).toHaveLength(1);
      expect(result[0].lottery_event_id).toBe(lotteryEvent.id);
      expect(result[0].product_id).toBe(product2.id);
      expect(result[0].quantity_available).toBe(5);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));

      const products = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      expect(products.length).toBe(2);
    });

    it("既存の商品の数量を更新できること", async () => {
      const result = await executeTransaction(async (client) => {
        return await updateLotteryProductsWithTransaction(client, lotteryEvent.id, [
          { product_id: product.id, quantity_available: 20 },
        ]);
      });

      expect(result).toHaveLength(1);
      expect(result[0].lottery_event_id).toBe(lotteryEvent.id);
      expect(result[0].product_id).toBe(product.id);
      expect(result[0].quantity_available).toBe(20);

      const products = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      const updatedProduct = products.find((p) => p.product_id === product.id);
      expect(updatedProduct?.quantity_available).toBe(20);
    });

    it("既存の商品と新しい商品を同時に処理できること", async () => {
      const newProduct = await setUpProduct();

      const result = await executeTransaction(async (client) => {
        return await updateLotteryProductsWithTransaction(client, lotteryEvent.id, [
          { product_id: product.id, quantity_available: 30 },
          { product_id: newProduct.id, quantity_available: 15 },
        ]);
      });

      expect(result).toHaveLength(2);

      const updatedProduct = result.find((p) => p.product_id === product.id);
      expect(updatedProduct?.quantity_available).toBe(30);

      const createdProduct = result.find((p) => p.product_id === newProduct.id);
      expect(createdProduct?.quantity_available).toBe(15);

      const products = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      expect(products.length).toBe(3);
    });

    it("変更がない場合は更新されないこと", async () => {
      const products = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      const currentProduct = products.find((p) => p.product_id === product.id);

      if (!currentProduct) {
        throw new Error("Test setup failed: product not found");
      }

      const result = await executeTransaction(async (client) => {
        return await updateLotteryProductsWithTransaction(client, lotteryEvent.id, [
          { product_id: product.id, quantity_available: currentProduct.quantity_available },
        ]);
      });

      expect(result).toHaveLength(0);
    });

    it("空の配列を渡した場合は何も変更されないこと", async () => {
      const result = await executeTransaction(async (client) => {
        return await updateLotteryProductsWithTransaction(client, lotteryEvent.id, []);
      });

      expect(result).toHaveLength(0);
    });

    it("トランザクション内でエラーが発生した場合、変更がロールバックされること", async () => {
      const beforeProducts = await getLotteryProductsByLotteryEventId(lotteryEvent.id);

      await expect(
        executeTransaction(async (client) => {
          await updateLotteryProductsWithTransaction(client, lotteryEvent.id, [
            { product_id: product.id, quantity_available: 100 },
          ]);
          throw new Error("トランザクション内でエラーが発生しました");
        }),
      ).rejects.toThrow("トランザクション内でエラーが発生しました");

      const afterProducts = await getLotteryProductsByLotteryEventId(lotteryEvent.id);
      expect(afterProducts).toEqual(beforeProducts);
    });
  });
});
