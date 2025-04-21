import { createProducts } from "@/lib/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminCode = cookieStore.get(ADMIN_CODE)?.value;

  if (!adminCode) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const productData = await request.json();
    await createProducts(productData);
    return NextResponse.json({ message: "Product created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
