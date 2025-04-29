import { createProducts, findProductById, getProducts, updateProductById } from "@/lib/db";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { ProductFactory } from "../../factory/product";
import type { Product } from "@/types";

let product: ProductFactory;

const setUpProduct = async () => {
  return await ProductFactory.create();
};

type ProductKeys = keyof ProductFactory;
const expectedKeys: ProductKeys[] = ["id", "name", "price", "image", "stock_quantity"];

describe("Productsテーブルに関するテスト", () => {
  describe("getProducts", () => {
    beforeAll(async () => {
      product = await setUpProduct();
    });

    it("全ての商品情報を取得できること", async () => {
      const result = await getProducts();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("createProducts", () => {
    it("商品レコードが作成できること", async () => {
      const result = await createProducts({ name: "名前", price: 10, image: "test.jpg" });
      expect(result.id).not.toBeNull();
      expect(result.name).toBe("名前");
      expect(result.price).toBe(10);
      expect(result.image).toBe("test.jpg");
      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("findProductById", () => {
    beforeAll(async () => {
      product = await setUpProduct();
    });

    it("存在するProduct IDの場合、商品情報を取得できること", async () => {
      const result = await findProductById(product.id);
      expect(result).not.toBeNull();
      expect(result?.name).toBe(product.name);
      expect(result?.price).toBe(product.price);
      expect(result?.stock_quantity).toBe(0);
      expect(Object.keys(result as Product)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("updateProductById", () => {
    beforeEach(async () => {
      product = await setUpProduct();
    });

    it("指定したカラムを更新できること", async () => {
      const result = await updateProductById(product.id, {
        name: "更新する商品",
        price: 1919,
        stock_quantity: 9191,
      });
      expect(result).not.toBeNull;
      expect(result?.name).toBe("更新する商品");
      expect(result?.price).toBe(1919);
      expect(result?.stock_quantity).toBe(9191);
      expect(Object.keys(result as Product)).toEqual(expect.arrayContaining(expectedKeys));
    });

    it("更新するカラムを指定しない場合、更新されないで商品が取得できること", async () => {
      const result = await updateProductById(product.id, {});
      expect(result).not.toBeNull;
      expect(result?.name).toBe(product.name);
      expect(result?.price).toBe(product.price);
      expect(result?.stock_quantity).toBe(0);
      expect(Object.keys(result as Product)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
