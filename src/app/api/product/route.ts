import { createProducts, getProducts } from "@/lib/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";
import type { Product } from "@/types";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const productData: Omit<Product, "id" | "quantity" | "stock_quantity"> = await request.json();
    const product = await createProducts(productData);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ message: "OK", data: products }, { status: 200 });
}
