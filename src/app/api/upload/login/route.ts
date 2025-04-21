import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_CODE = process.env.ADMIN_CODE;

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    return NextResponse.json(
      { success: code === ADMIN_CODE ? ADMIN_CODE : false },
      { status: code === ADMIN_CODE ? 200 : 403 },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
