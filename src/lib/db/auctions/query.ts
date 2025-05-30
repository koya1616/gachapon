import type { Auction } from "@/types";
import { executeQuery } from "..";

export const createAuction = async (auction: Omit<Auction, "id" | "created_at">): Promise<Auction> => {
  const query = `
    INSERT INTO auctions (name, description, start_at, end_at, payment_deadline_at, status, is_sealed, allow_bid_retraction, need_payment_info, product_id, minimum_bid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    auction.minimum_bid,
  ];
  const auctions = await executeQuery<Auction>(query, params);
  return auctions[0];
};

export const getAuctions = async (): Promise<Auction[]> => {
  const query = "SELECT * FROM auctions";
  const auctions = await executeQuery<Auction>(query);
  return auctions;
};

export const findAuctionById = async (id: number): Promise<Auction | null> => {
  const query = "SELECT * FROM auctions WHERE id = $1";
  const params = [id];
  const auctions = await executeQuery<Auction>(query, params);
  return auctions[0] || null;
};

export const updateAuction = async (auction: Omit<Auction, "created_at">): Promise<Auction> => {
  const query = `
    UPDATE auctions
    SET name = $1, description = $2, start_at = $3, end_at = $4, payment_deadline_at = $5, status = $6, is_sealed = $7, allow_bid_retraction = $8, need_payment_info = $9, product_id = $10, minimum_bid = $11
    WHERE id = $12
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
    auction.minimum_bid,
    auction.id,
  ];
  const auctions = await executeQuery<Auction>(query, params);
  return auctions[0];
};

export const getAuctionsByProductId = async (productId: number): Promise<Auction[]> => {
  const query = "SELECT * FROM auctions WHERE product_id = $1";
  const params = [productId];
  const auctions = await executeQuery<Auction>(query, params);
  return auctions;
};
