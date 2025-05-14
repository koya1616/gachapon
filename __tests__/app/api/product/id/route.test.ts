import { GET, PUT } from "@/app/api/product/[id]/route";
import { ADMIN_CODE } from "@/const/cookies";
import { findProductById, getLotteryEventsByProductId, updateProductById } from "@/lib/db";
import { mockLotteryEvents, mockProducts } from "@/mocks/data";
import type { Product } from "@/types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findProductById: vi.fn(),
  updateProductById: vi.fn(),
  getLotteryEventsByProductId: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

const createMockGetRequest = (id: number) => {
  const url = new URL(`http://localhost:3000/api/product/${id}`);
  return new NextRequest(url);
};

const createMockPutRequest = (id: number, productData: Partial<Product>) => {
  const url = new URL(`http://localhost:3000/api/product/${id}`);
  return new NextRequest(url, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

describe("GET /api/product/[id]", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("存在する商品IDを送信して200と商品情報を返すこと", async () => {
    vi.mocked(findProductById).mockResolvedValue(mockProducts[0]);
    vi.mocked(getLotteryEventsByProductId).mockResolvedValue(mockLotteryEvents);

    const request = createMockGetRequest(1);
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: { product: mockProducts[0], lotteryEvents: mockLotteryEvents } });
    expect(findProductById).toHaveBeenCalledTimes(1);
    expect(findProductById).toHaveBeenCalledWith(1);
    expect(getLotteryEventsByProductId).toHaveBeenCalledTimes(1);
    expect(getLotteryEventsByProductId).toHaveBeenCalledWith(1);
  });

  it("存在しない商品IDを送信して404を返すこと", async () => {
    vi.mocked(findProductById).mockResolvedValue(null);

    const request = createMockGetRequest(999);
    const response = await GET(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not found", data: null });
    expect(findProductById).toHaveBeenCalledTimes(1);
    expect(findProductById).toHaveBeenCalledWith(999);
  });
});

describe("PUT /api/product/[id]", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("管理者が認証されていない場合、401を返すこと", async () => {
    mockCookieStore("invalid_token");

    const productData = { name: "更新商品", price: 2000 };
    const request = createMockPutRequest(1, productData);

    const response = await PUT(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
    expect(updateProductById).not.toHaveBeenCalled();
  });

  it("管理者が認証されていて有効なデータの場合、商品を更新して200を返すこと", async () => {
    mockCookieStore("test_admin_code");

    const productId = 1;
    const productData = { name: "更新商品", price: 2000 };
    const updatedProduct = {
      id: productId,
      name: "更新商品",
      price: 2000,
      image: "test.jpg",
      stock_quantity: 10,
      quantity: 0,
    };

    vi.mocked(updateProductById).mockResolvedValue(updatedProduct);

    const request = createMockPutRequest(productId, productData);
    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: updatedProduct });
    expect(updateProductById).toHaveBeenCalledTimes(1);
    expect(updateProductById).toHaveBeenCalledWith(productId, productData);
  });

  it("存在しない商品IDの場合、404を返すこと", async () => {
    mockCookieStore("test_admin_code");

    const productId = 999;
    const productData = { name: "存在しない商品", price: 3000 };

    vi.mocked(updateProductById).mockResolvedValue(null);

    const request = createMockPutRequest(productId, productData);
    const response = await PUT(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not found", data: null });
    expect(updateProductById).toHaveBeenCalledTimes(1);
    expect(updateProductById).toHaveBeenCalledWith(productId, productData);
  });
});
