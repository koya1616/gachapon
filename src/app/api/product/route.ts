import { createProducts } from "@/lib/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    await createProducts(productData);
    return NextResponse.json({ message: "Product created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
