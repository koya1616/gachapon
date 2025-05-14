import { ADMIN_CODE } from "@/const/cookies";
import { findAuctionById, findProductById, getSealedBidsAuctionId } from "@/lib/db";
import type { Auction, Product, SealedBid } from "@/types";
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
