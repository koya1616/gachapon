import { ADMIN_CODE } from "@/const/cookies";
import { findLotteryEventById, getLotteryProductsByLotteryEventId } from "@/lib/db";
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
