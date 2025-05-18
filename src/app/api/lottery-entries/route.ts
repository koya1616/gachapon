import { USER_TOKEN } from "@/const/cookies";
import { createLotteryEntry } from "@/lib/db/lotteryEntries/query";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export type CreateLotteryEntryRequestBody = {
  lotteryEventId: number;
  lotteryProductId: number;
};
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
    if (!userToken) {
      return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
    }

    const data: CreateLotteryEntryRequestBody = await request.json();

    if (!data.lotteryEventId || !data.lotteryProductId) {
      return NextResponse.json({ message: "Bad Request", data: null }, { status: 400 });
    }

    await createLotteryEntry(data.lotteryEventId, userToken.id, data.lotteryProductId);

    return NextResponse.json({ message: "OK", data: null }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0013:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}
