import { findProductById, updateProductById } from "@/lib/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";
import type { Product } from "@/types";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const product = await findProductById(Number(id));
  if (!product) {
    return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
  }
  return NextResponse.json({ message: "OK", data: product }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.pathname.split("/").pop();
  const productId = Number(id);
  const productData: Partial<Product> = await request.json();

  const updatedProduct = await updateProductById(productId, productData);
  if (!updatedProduct) {
    return NextResponse.json({ message: "Not found", data: null }, { status: 404 });
  }

  return NextResponse.json({ message: "OK", data: updatedProduct }, { status: 200 });
}
