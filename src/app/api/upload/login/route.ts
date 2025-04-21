import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  try {
    const { code } = await request.json();
    if (ENV_ADMIN_CODE && code === ENV_ADMIN_CODE) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 100);

      cookieStore.set(ADMIN_CODE, ENV_ADMIN_CODE, {
        path: "/",
        expires: expirationDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return NextResponse.json({ success: code === ENV_ADMIN_CODE, status: code === ENV_ADMIN_CODE ? 200 : 403 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
