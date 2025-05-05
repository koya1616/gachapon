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
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const productData: Omit<Product, "id" | "quantity" | "stock_quantity"> = await request.json();
  try {
    const product = await createProducts(productData);
    return NextResponse.json({ message: "OK", data: product }, { status: 200 });
  } catch (error) {
    console.error(`ERROR_CODE_0005: ${productData}`);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ message: "OK", data: products }, { status: 200 });
}
