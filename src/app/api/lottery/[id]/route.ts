import { ADMIN_CODE } from "@/const/cookies";
import {
  deleteLotteryProductsByLotteryEventIdAndProductId,
  executeTransaction,
  findLotteryEventById,
  getLotteryProductsByLotteryEventId,
  updateLotteryEvent,
  updateLotteryProductsWithTransaction,
} from "@/lib/db";
import type { LotteryStatus } from "@/types";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const id = request.nextUrl.pathname.split("/").pop();

    const lottery = await findLotteryEventById(Number(id));
    if (!lottery) {
      return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
    }

    const products = await getLotteryProductsByLotteryEventId(Number(id));

    return NextResponse.json({ message: "OK", data: { lottery, products } }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0006:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}

export type UpdateLotteryEventApiRequestBody = {
  name?: string;
  description?: string;
  startAt?: number;
  endAt?: number;
  resultAt?: number;
  paymentDeadlineAt?: number;
  status?: LotteryStatus;
  products: {
    productId: number;
    quantity: number;
  }[];
};

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const id = request.nextUrl.pathname.split("/")[3];
    const data: UpdateLotteryEventApiRequestBody = await request.json();

    const existingLottery = await findLotteryEventById(Number(id));
    if (!existingLottery) {
      return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
    }

    const updateData = {
      name: data.name,
      description: data.description,
      start_at: data.startAt,
      end_at: data.endAt,
      result_at: data.resultAt,
      payment_deadline_at: data.paymentDeadlineAt,
      status: data.status,
    };

    const updatedLottery = await updateLotteryEvent(Number(id), updateData);

    if (!updatedLottery) {
      return NextResponse.json({ message: "Bad request", data: null }, { status: 400 });
    }

    await executeTransaction(async (client) => {
      const lotteryProductsData = data.products.map((product) => ({
        product_id: product.productId,
        quantity_available: product.quantity,
      }));
      await updateLotteryProductsWithTransaction(client, Number(id), lotteryProductsData);
    });

    return NextResponse.json({ message: "OK", data: updatedLottery }, { status: 200 });
  } catch (error) {
    console.error(`ERROR_CODE_0007: ${error}`);
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}

export type DeleteLotteryEventApiRequestBody = {
  productId: number;
};

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const id = request.nextUrl.pathname.split("/")[3];
    const data: DeleteLotteryEventApiRequestBody = await request.json();

    const existingLottery = await findLotteryEventById(Number(id));
    if (!existingLottery) {
      return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
    }

    await deleteLotteryProductsByLotteryEventIdAndProductId(existingLottery.id, data.productId);
    return NextResponse.json({ message: "OK", data: null }, { status: 200 });
  } catch (error) {
    console.error(`ERROR_CODE_0008: ${error}`);
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}
1;
