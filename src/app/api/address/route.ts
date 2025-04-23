import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { USER_TOKEN } from "@/const/cookies";
import { redirect } from "next/navigation";
import { createAddress, findAddressByUserId, updateAddress } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");
  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const address = await findAddressByUserId(userToken.id);
  return NextResponse.json(address, { status: 200 });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const userToken = verifyToken(cookieStore.get(USER_TOKEN)?.value || "");

  if (!userToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.id === 0) {
    await createAddress({ ...body, user_id: userToken.id });
  } else {
    await updateAddress({ ...body, user_id: userToken.id });
  }
  return NextResponse.json({ message: "ok" }, { status: 200 });
}
