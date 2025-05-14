import { createSealedBid } from "@/lib/db/sealed_bids/query";
import type { SealedBid } from "@/types";
import { AuctionFactory } from "./auction";
import { UserFactory } from "./user";

export class SealedBidFactory {
  id: number;
  auction_id: number;
  user_id: number;
  amount: number;
  created_at: number;

  constructor(auction_id: number, user_id: number, amount: number) {
    this.id = 0;
    this.auction_id = auction_id;
    this.user_id = user_id;
    this.amount = amount;
    this.created_at = Date.now();
  }

  public static async create(
    amount?: number,
    options?: {
      auction?: Partial<Pick<SealedBid, "auction_id">>;
      user?: Partial<Pick<SealedBid, "user_id">>;
    },
  ): Promise<SealedBidFactory> {
    let auction_id = options?.auction?.auction_id;
    let user_id = options?.user?.user_id;

    if (!auction_id) {
      const auction = await AuctionFactory.create(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );
      auction_id = auction.id;
    }

    if (!user_id) {
      const user = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);
      user_id = user.id;
    }

    const sealedBid = await createSealedBid(auction_id, user_id, amount || 1000);

    const factory = new SealedBidFactory(sealedBid.auction_id, sealedBid.user_id, sealedBid.amount);
    factory.id = sealedBid.id;
    factory.created_at = sealedBid.created_at;

    return factory;
  }
}
