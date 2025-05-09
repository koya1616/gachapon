import { GET, POST } from "@/app/api/product/route";
import { ADMIN_CODE } from "@/const/cookies";
import { createProducts, getProducts } from "@/lib/db";
import type { Product } from "@/types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getProducts: vi.fn(),
  createProducts: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("GET /api/product", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("製品一覧を取得して200を返す", async () => {
    const mockProducts = [
      { id: 1, name: "製品1", price: 100, image: "test1.jpg", stock_quantity: 10, quantity: 0 },
      { id: 2, name: "製品2", price: 200, image: "test2.jpg", stock_quantity: 5, quantity: 0 },
    ];
    vi.mocked(getProducts).mockResolvedValue(mockProducts);

    const response = await GET();
    expect(response.status).toBe(200);

    const { message, data } = await response.json();
    expect(message).toBe("OK");
    expect(data).toEqual(mockProducts);
    expect(getProducts).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/product", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (productData: Omit<Product, "id" | "quantity" | "stock_quantity">) => {
    return new NextRequest("http://localhost:3000/api/product", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  };

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const productData = { name: "新製品", price: 300, image: "new.jpg" };
    const request = createMockRequest(productData);

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
    expect(createProducts).not.toHaveBeenCalled();
  });

  it("管理者が認証されていて有効なデータの場合は製品を作成して200を返す", async () => {
    mockCookieStore("test_admin_code");

    const productData = { name: "新製品", price: 300, image: "new.jpg", quantity: 0 };
    const createdProduct = { ...productData, id: 3, stock_quantity: 0 };

    vi.mocked(createProducts).mockResolvedValue(createdProduct);

    const request = createMockRequest(productData);
    const response = await POST(request);

    expect(response.status).toBe(200);
    const responseData = await response.json();
    expect(responseData).toEqual({ message: "OK", data: createdProduct });

    expect(createProducts).toHaveBeenCalledTimes(1);
    expect(createProducts).toHaveBeenCalledWith(productData);
  });

  it("製品作成に失敗した場合は500を返す", async () => {
    mockCookieStore("test_admin_code");

    const productData = { name: "エラー製品", price: 999, image: "error.jpg" };
    vi.mocked(createProducts).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(productData);
    const response = await POST(request);

    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({ message: "Internal server error", data: null });

    expect(createProducts).toHaveBeenCalledTimes(1);
    expect(createProducts).toHaveBeenCalledWith(productData);
  });
});
