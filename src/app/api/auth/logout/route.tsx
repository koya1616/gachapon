import { USER_TOKEN } from "@/const/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_TOKEN);
  return new NextResponse(null, { status: 204 });
}
