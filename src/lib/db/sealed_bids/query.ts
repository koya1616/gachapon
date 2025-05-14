import type { SealedBid } from "@/types";
import { executeQuery } from "..";

export const findAuctionById = async (id: number): Promise<SealedBid | null> => {
  const query = "SELECT * FROM sealed_bids WHERE auction_id = $1";
  const params = [id];
  const sealedBids = await executeQuery<SealedBid>(query, params);
  return sealedBids[0] || null;
};
