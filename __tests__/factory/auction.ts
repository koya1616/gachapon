import { createAuction } from "@/lib/db";
import type { Auction } from "@/types";
import { ProductFactory } from "./product";

export class AuctionFactory {
  id: number;
  name: string;
  description: string;
  start_at: number;
  end_at: number;
  payment_deadline_at: number;
  status: number;
  is_sealed: boolean;
  allow_bid_retraction: boolean;
  need_payment_info: boolean;
  created_at: number;
  product_id: number;

  constructor(
    name: string,
    description: string,
    start_at: number,
    end_at: number,
    payment_deadline_at: number,
    status: number,
    is_sealed: boolean,
    allow_bid_retraction: boolean,
    need_payment_info: boolean,
    product_id: number,
  ) {
    this.id = 0;
    this.name = name;
    this.description = description;
    this.start_at = start_at;
    this.end_at = end_at;
    this.payment_deadline_at = payment_deadline_at;
    this.status = status;
    this.is_sealed = is_sealed;
    this.allow_bid_retraction = allow_bid_retraction;
    this.need_payment_info = need_payment_info;
    this.created_at = Date.now();
    this.product_id = product_id;
  }

  public static async create(
    name?: string,
    description?: string,
    start_at?: number,
    end_at?: number,
    payment_deadline_at?: number,
    status?: number,
    is_sealed?: boolean,
    allow_bid_retraction?: boolean,
    need_payment_info?: boolean,
    options?: {
      product?: Partial<Pick<Auction, "product_id">>;
    },
  ): Promise<AuctionFactory> {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    let product_id = options?.product?.product_id;

    if (!product_id) {
      const product = await ProductFactory.create();
      product_id = product.id;
    }

    const auction = await createAuction({
      name: name || "オークション1",
      description: description || "テストオークション",
      start_at: start_at || now,
      end_at: end_at || now + oneDay * 7,
      payment_deadline_at: payment_deadline_at || now + oneDay * 14,
      status: status || 1,
      is_sealed: is_sealed !== undefined ? is_sealed : false,
      allow_bid_retraction: allow_bid_retraction !== undefined ? allow_bid_retraction : true,
      need_payment_info: need_payment_info !== undefined ? need_payment_info : false,
      product_id: product_id,
    });

    const factory = new AuctionFactory(
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
    );
    factory.id = auction.id;
    factory.created_at = auction.created_at;

    return factory;
  }
}
