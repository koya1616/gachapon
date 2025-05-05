import { describe, it, expect, vi, beforeAll } from "vitest";
import { type CreateLotteryEventApiRequestBody, POST } from "@/app/api/lottery/create/route";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { ADMIN_CODE } from "@/const/cookies";
import { NextRequest } from "next/server";
import { createLotteryEventWithTransaction, createLotteryProductsWithTransaction, executeTransaction } from "@/lib/db";
import { ProductFactory } from "../../../../factory/product";
import type { Client } from "pg";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db/index", async () => {
  const actual = await vi.importActual("@/lib/db/index");
  return {
    ...actual,
    createLotteryEventWithTransaction: vi.fn(),
    createLotteryProductsWithTransaction: vi.fn(),
    executeTransaction: vi.fn(),
    findLotteryEventById: vi.fn(),
  };
});

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

const createTestRequestBody = (overrides = {}): CreateLotteryEventApiRequestBody => {
  const now = Date.now();
  return {
    name: "テスト抽選",
    description: "テスト説明",
    startAt: now,
    endAt: now + 86400000,
    resultAt: now + 172800000,
    paymentDeadlineAt: now + 259200000,
    status: 0,
    products: [{ productId: 1, quantity: 10 }],
    ...overrides,
  };
};

const createTestRequest = (body: CreateLotteryEventApiRequestBody) => {
  return new NextRequest("http://localhost/api/lottery/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

describe("POST /api/lottery/create", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const requestBody = createTestRequestBody();
    const response = await POST(createTestRequest(requestBody));

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("管理者が認証されている場合、抽選イベントと抽選商品を作成して200を返す", async () => {
    const product = await ProductFactory.create();
    mockCookieStore("test_admin_code");

    const now = Date.now();
    const mockLotteryEvent = {
      id: 1,
      name: "テスト抽選",
      description: "テスト説明",
      start_at: now,
      end_at: now + 86400000,
      result_at: now + 172800000,
      payment_deadline_at: now + 259200000,
      status: 0,
      created_at: now,
    };

    const mockLotteryProducts = [
      {
        id: 1,
        lottery_event_id: 1,
        product_id: product.id,
        quantity_available: 10,
        created_at: now,
      },
    ];

    vi.mocked(createLotteryEventWithTransaction).mockResolvedValue(mockLotteryEvent);
    vi.mocked(createLotteryProductsWithTransaction).mockResolvedValue(mockLotteryProducts);
    vi.mocked(executeTransaction).mockImplementation(async (callback) => {
      return await callback({} as unknown as Client);
    });

    const requestBody = createTestRequestBody({
      startAt: mockLotteryEvent.start_at,
      endAt: mockLotteryEvent.end_at,
      resultAt: mockLotteryEvent.result_at,
      paymentDeadlineAt: mockLotteryEvent.payment_deadline_at,
      products: [{ productId: product.id, quantity: 10 }],
    });

    const response = await POST(createTestRequest(requestBody));

    expect(executeTransaction).toHaveBeenCalled();
    expect(createLotteryEventWithTransaction).toHaveBeenCalledWith(expect.anything(), {
      name: requestBody.name,
      description: requestBody.description,
      start_at: requestBody.startAt,
      end_at: requestBody.endAt,
      result_at: requestBody.resultAt,
      payment_deadline_at: requestBody.paymentDeadlineAt,
      status: requestBody.status,
    });
    expect(createLotteryProductsWithTransaction).toHaveBeenCalledWith(expect.anything(), [
      {
        lottery_event_id: mockLotteryEvent.id,
        product_id: product.id,
        quantity_available: 10,
      },
    ]);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });
  });

  it("データベース処理中にエラーが発生した場合は500を返す", async () => {
    mockCookieStore("test_admin_code");
    vi.mocked(executeTransaction).mockRejectedValue(new Error("Database error"));

    const requestBody = createTestRequestBody();
    const response = await POST(createTestRequest(requestBody));

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ message: "Internal Server Error", data: null });
  });
});
