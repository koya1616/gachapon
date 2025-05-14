import { ADMIN_CODE } from "@/const/cookies";
import { findAuctionById, findProductById, getSealedBidsAuctionId, updateAuction } from "@/lib/db";
import type { Auction, AuctionStatus, Product, SealedBid } from "@/types";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export type AuctionApiResponse = {
  auction: Auction;
  product: Product | null;
  bids: SealedBid[];
};

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const id = request.nextUrl.pathname.split("/").pop();

    const auction = await findAuctionById(Number(id));
    if (!auction) {
      return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
    }

    const product = await findProductById(auction.product_id);
    // TODO: 公開増価をする場合はis_sealedフラグでクエリを分ける
    const bids = await getSealedBidsAuctionId(auction.id);

    const data: AuctionApiResponse = { auction, product, bids };
    return NextResponse.json({ message: "OK", data: data }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0011:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}

export type UpdateAuctionApiRequestBody = {
  name?: string;
  description?: string;
  startAt?: number;
  endAt?: number;
  paymentDeadlineAt?: number;
  status?: AuctionStatus;
  isSealed?: boolean;
  allowBidRetraction?: boolean;
  needPaymentInfo?: boolean;
  productId?: number;
  minimumBid?: number;
};

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const id = request.nextUrl.pathname.split("/")[3];
    const data: UpdateAuctionApiRequestBody = await request.json();

    const existingAuction = await findAuctionById(Number(id));
    if (!existingAuction) {
      return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
    }

    const updateData: Omit<Auction, "created_at"> = {
      id: Number(id),
      name: data.name || existingAuction.name,
      description: data.description || existingAuction.description,
      start_at: data.startAt || existingAuction.start_at,
      end_at: data.endAt || existingAuction.end_at,
      payment_deadline_at: data.paymentDeadlineAt || existingAuction.payment_deadline_at,
      status: data.status !== undefined ? data.status : existingAuction.status,
      is_sealed: data.isSealed !== undefined ? data.isSealed : existingAuction.is_sealed,
      allow_bid_retraction:
        data.allowBidRetraction !== undefined ? data.allowBidRetraction : existingAuction.allow_bid_retraction,
      need_payment_info: data.needPaymentInfo !== undefined ? data.needPaymentInfo : existingAuction.need_payment_info,
      product_id: data.productId || existingAuction.product_id,
      minimum_bid: data.minimumBid || existingAuction.minimum_bid,
    };

    await updateAuction(updateData);

    return NextResponse.json({ message: "OK", data: null }, { status: 200 });
  } catch (error) {
    console.error(`ERROR_CODE_0012: ${error}`);
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}
