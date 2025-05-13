import { ADMIN_CODE } from "@/const/cookies";
import { createAuction, getAuctions } from "@/lib/db/auctions/query";
import type { AuctionStatus } from "@/types";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const auctions = await getAuctions();
    return NextResponse.json({ message: "OK", data: auctions }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0009:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}

export interface CreateAuctionApiRequestBody {
  name: string;
  description: string;
  startAt: number;
  endAt: number;
  paymentDeadlineAt: number;
  status: AuctionStatus;
  isSealed: boolean;
  allowBidRetraction: boolean;
  needPaymentInfo: boolean;
  productId: number;
}
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const body: CreateAuctionApiRequestBody = await request.json();

    const auction = await createAuction({
      name: body.name,
      description: body.description,
      start_at: body.startAt,
      end_at: body.endAt,
      payment_deadline_at: body.paymentDeadlineAt,
      status: body.status,
      is_sealed: body.isSealed,
      allow_bid_retraction: body.allowBidRetraction,
      need_payment_info: body.needPaymentInfo,
      product_id: body.productId,
    });

    return NextResponse.json({ message: "オークションが作成されました", data: auction }, { status: 201 });
  } catch (error) {
    console.error("ERROR_CODE_0010:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}
