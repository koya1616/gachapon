import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { USER_TOKEN } from "@/const/cookies";
import { createAddress, findAddressByUserId, updateAddress } from "@/lib/db";
import type { Address } from "@/types";

export async function GET() {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }
  const address = await findAddressByUserId(userToken.id);
  return NextResponse.json({ message: "OK", data: address }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");

  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body: Address = await request.json();

  if (body.id === 0) {
    await createAddress({ ...body, user_id: userToken.id });
  } else {
    await updateAddress({ ...body, user_id: userToken.id });
  }
  return NextResponse.json({ message: "ok" }, { status: 200 });
}
