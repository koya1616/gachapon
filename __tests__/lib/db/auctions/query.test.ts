import { createAuction, getAuctions } from "@/lib/db";
import type { Auction } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";
import { AuctionFactory } from "../../../factory/auction";
import { ProductFactory } from "../../../factory/product";

let auction: AuctionFactory;

const setUpAuction = async () => {
  return await AuctionFactory.create();
};

type AuctionKeys = keyof Auction;
const expectedKeys: AuctionKeys[] = [
  "id",
  "name",
  "description",
  "start_at",
  "end_at",
  "payment_deadline_at",
  "status",
  "is_sealed",
  "allow_bid_retraction",
  "need_payment_info",
  "created_at",
  "product_id",
];

describe("Auctionsテーブルに関するテスト", () => {
  describe("createAuction", () => {
    it("オークションレコードが作成できること", async () => {
      const product = await ProductFactory.create("テスト商品", 1000, "test.jpg");

      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      const result = await createAuction({
        name: "テストオークション",
        description: "テスト用のオークションです",
        start_at: now,
        end_at: now + oneDay * 7,
        payment_deadline_at: now + oneDay * 14,
        status: 1,
        is_sealed: true,
        allow_bid_retraction: false,
        need_payment_info: true,
        product_id: product.id,
      });

      expect(result.id).not.toBeNull();
      expect(result.name).toBe("テストオークション");
      expect(result.description).toBe("テスト用のオークションです");
      expect(result.start_at).toBe(String(now));
      expect(result.end_at).toBe(String(now + oneDay * 7));
      expect(result.payment_deadline_at).toBe(String(now + oneDay * 14));
      expect(result.status).toBe(1);
      expect(result.is_sealed).toBe(true);
      expect(result.allow_bid_retraction).toBe(false);
      expect(result.need_payment_info).toBe(true);
      expect(result.product_id).toBe(product.id);
      expect(Number(result.created_at)).toBeGreaterThan(0);

      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("getAuctions", () => {
    beforeAll(async () => {
      auction = await setUpAuction();
    });

    it("オークションレコードが取得できること", async () => {
      const results = await getAuctions();
      const result = results.find((a) => a.id === auction.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(auction.id);
      expect(result?.name).toBe(auction.name);
      expect(result?.description).toBe(auction.description);
      expect(result?.start_at).toBe(auction.start_at);
      expect(result?.end_at).toBe(auction.end_at);
      expect(result?.payment_deadline_at).toBe(auction.payment_deadline_at);
      expect(result?.status).toBe(auction.status);
      expect(result?.is_sealed).toBe(auction.is_sealed);
      expect(result?.allow_bid_retraction).toBe(auction.allow_bid_retraction);
      expect(result?.need_payment_info).toBe(auction.need_payment_info);
      expect(result?.product_id).toBe(auction.product_id);
      expect(Number(result?.created_at)).toBeGreaterThan(0);
      expect(result?.created_at).toBe(auction.created_at);
      expect(result?.id).toBe(auction.id);

      expect(Object.keys(result ? result : {})).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
