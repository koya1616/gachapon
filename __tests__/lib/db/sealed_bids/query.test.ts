import { createSealedBid, getSealedBidsAuctionId } from "@/lib/db/sealed_bids/query";
import type { SealedBid } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";
import { AuctionFactory } from "../../../factory/auction";
import { SealedBidFactory } from "../../../factory/sealed_bid";
import { UserFactory } from "../../../factory/user";

let auction: AuctionFactory;
let user: UserFactory;
let sealedBid: SealedBidFactory;

const setUpSealedBid = async () => {
  auction = await AuctionFactory.create(undefined, undefined, undefined, undefined, undefined, undefined, true);
  user = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);
  return await SealedBidFactory.create(1500, {
    auction: { auction_id: auction.id },
    user: { user_id: user.id },
  });
};

type SealedBidKeys = keyof SealedBid;
const expectedKeys: SealedBidKeys[] = ["id", "auction_id", "user_id", "amount", "created_at"];

describe("SealedBidsテーブルに関するテスト", () => {
  describe("createSealedBid", () => {
    beforeAll(async () => {
      auction = await AuctionFactory.create(undefined, undefined, undefined, undefined, undefined, undefined, true);
      user = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);
    });

    it("封筒入札レコードが作成できること", async () => {
      const amount = 2000;

      const result = await createSealedBid(auction.id, user.id, amount);

      expect(result.id).not.toBeNull();
      expect(result.auction_id).toBe(auction.id);
      expect(result.user_id).toBe(user.id);
      expect(result.amount).toBe(amount);
      expect(Number(result.created_at)).toBeGreaterThan(0);

      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("getSealedBidsAuctionId", () => {
    beforeAll(async () => {
      sealedBid = await setUpSealedBid();
    });

    it("オークションIDで封筒入札レコードが取得できること", async () => {
      const results = await getSealedBidsAuctionId(sealedBid.auction_id);
      const result = results.find((bid) => bid.id === sealedBid.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(sealedBid.id);
      expect(result?.auction_id).toBe(sealedBid.auction_id);
      expect(result?.user_id).toBe(sealedBid.user_id);
      expect(result?.amount).toBe(sealedBid.amount);
      expect(Number(result?.created_at)).toBeGreaterThan(0);
      expect(result?.created_at).toBe(sealedBid.created_at);

      expect(Object.keys(result ? result : {})).toEqual(expect.arrayContaining(expectedKeys));
    });

    it("存在しないオークションIDの場合、空の配列が返されること", async () => {
      const results = await getSealedBidsAuctionId(99999999);
      expect(results).toHaveLength(0);
    });
  });
});
