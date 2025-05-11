import { ADMIN_CODE } from "@/const/cookies";
import { findLotteryEventById, getLotteryProductsByLotteryEventId } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const id = Number(params.id);

    const lottery = await findLotteryEventById(id);
    if (!lottery) {
      return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
    }

    const products = await getLotteryProductsByLotteryEventId(id);

    return NextResponse.json({ message: "OK", data: { lottery, products } }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0006:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}
