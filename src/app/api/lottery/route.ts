import { ADMIN_CODE } from "@/const/cookies";
import {
  createLotteryEventWithTransaction,
  createLotteryProductsWithTransaction,
  executeTransaction,
  getLotteryEvents,
} from "@/lib/db/index";
import type { LotteryStatus } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const lotteryEvents = await getLotteryEvents();
  return NextResponse.json({ message: "OK", data: lotteryEvents }, { status: 200 });
}

export type CreateLotteryEventApiRequestBody = {
  startAt: number;
  endAt: number;
  resultAt: number;
  paymentDeadlineAt: number;
  products: {
    productId: number;
    quantity: number;
  }[];
  name: string;
  description: string;
  status: LotteryStatus;
};
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const data: CreateLotteryEventApiRequestBody = await request.json();
    await executeTransaction(async (client) => {
      const lotteryEvent = await createLotteryEventWithTransaction(client, {
        name: data.name,
        description: data.description,
        start_at: data.startAt,
        end_at: data.endAt,
        result_at: data.resultAt,
        payment_deadline_at: data.paymentDeadlineAt,
        status: data.status,
      });

      const lotteryProductsData = data.products.map((product: { productId: number; quantity: number }) => ({
        lottery_event_id: lotteryEvent.id,
        product_id: product.productId,
        quantity_available: product.quantity,
      }));

      await createLotteryProductsWithTransaction(client, lotteryProductsData);
    });

    return NextResponse.json({ message: "OK", data: null }, { status: 200 });
  } catch (error) {
    console.error(`ERROR_CODE_0004: ${error}`);
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}
