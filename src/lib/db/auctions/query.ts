import type { Auction } from "@/types";
import { executeQuery } from "..";

export const createAuction = async (auction: Omit<Auction, "id" | "created_at">): Promise<Auction> => {
  const query = `
    INSERT INTO auctions (name, description, start_at, end_at, payment_deadline_at, status, is_sealed, allow_bid_retraction, need_payment_info, product_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const params = [
    auction.name,
    auction.description,
    auction.start_at,
    auction.end_at,
    auction.payment_deadline_at,
    auction.status,
    auction.is_sealed,
    auction.allow_bid_retraction,
    auction.need_payment_info,
    auction.product_id,
  ];
  const auctions = await executeQuery<Auction>(query, params);
  return auctions[0];
};

export const getAuctions = async (): Promise<Auction[]> => {
  const query = "SELECT * FROM auctions";
  const auctions = await executeQuery<Auction>(query);
  return auctions;
};
