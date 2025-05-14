import type { SealedBid } from "@/types";
import { executeQuery } from "..";

export const getSealedBidsAuctionId = async (auctionId: number): Promise<SealedBid[]> => {
  const query = "SELECT * FROM sealed_bids WHERE auction_id = $1";
  const params = [auctionId];
  return await executeQuery<SealedBid>(query, params);
};
