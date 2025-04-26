import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";
import {
  createLotteryEventWithTransaction,
  createLotteryProductsWithTransaction,
  executeTransaction,
} from "@/lib/db/index";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE || "";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== ENV_ADMIN_CODE) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    await executeTransaction(async (client) => {
      const lotteryEvent = await createLotteryEventWithTransaction(client, {
        name: data.name,
        description: data.description || null,
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

    return NextResponse.json({ message: "抽選イベントが作成されました" }, { status: 201 });
  } catch (error) {
    console.error("Error creating lottery event:", error);
    return NextResponse.json({ message: "抽選イベントの作成に失敗しました" }, { status: 500 });
  }
}
