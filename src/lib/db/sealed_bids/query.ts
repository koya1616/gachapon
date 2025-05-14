import type { SealedBid } from "@/types";
import { executeQuery } from "..";

export const getSealedBidsAuctionId = async (auctionId: number): Promise<SealedBid[]> => {
  const query = "SELECT * FROM sealed_bids WHERE auction_id = $1";
  const params = [auctionId];
  return await executeQuery<SealedBid>(query, params);
};

export const createSealedBid = async (auctionId: number, userId: number, amount: number): Promise<SealedBid> => {
  const query = "INSERT INTO sealed_bids (auction_id, user_id, amount) VALUES ($1, $2, $3) RETURNING *";
  const params = [auctionId, userId, amount];
  const result = await executeQuery<SealedBid>(query, params);
  return result[0];
};
