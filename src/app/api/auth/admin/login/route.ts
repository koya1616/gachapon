import { ADMIN_CODE } from "@/const/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const ENV_ADMIN_CODE = process.env.ADMIN_CODE;

  const cookieStore = await cookies();
  const { code } = await request.json();

  if (!ENV_ADMIN_CODE || code !== ENV_ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 100);

  cookieStore.set(ADMIN_CODE, ENV_ADMIN_CODE, {
    path: "/",
    expires: expirationDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return NextResponse.json({ message: "OK", data: null }, { status: 200 });
}
