import { GET } from "@/app/api/lottery/[id]/route";
import { ADMIN_CODE } from "@/const/cookies";
import { findLotteryEventById, getLotteryProductsByLotteryEventId } from "@/lib/db";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findLotteryEventById: vi.fn(),
  getLotteryProductsByLotteryEventId: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("GET /api/lottery/[id]", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const request = new NextRequest("http://localhost:3000/api/lottery/1");
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("存在する抽選イベントIDを送信して200と抽選イベントデータと商品を返すこと", async () => {
    mockCookieStore("test_admin_code");

    const mockLotteryEvent = {
      id: 1,
      name: "テスト抽選",
      description: "テスト説明",
      start_at: Date.now(),
      end_at: Date.now() + 86400000,
      result_at: Date.now() + 172800000,
      payment_deadline_at: Date.now() + 259200000,
      status: 0,
      created_at: Date.now(),
    };

    const mockLotteryProducts = [
      {
        id: 1,
        lottery_event_id: 1,
        product_id: 1,
        quantity_available: 10,
        created_at: Date.now(),
      },
    ];

    vi.mocked(findLotteryEventById).mockResolvedValue(mockLotteryEvent);
    vi.mocked(getLotteryProductsByLotteryEventId).mockResolvedValue(mockLotteryProducts);

    const request = new NextRequest("http://localhost:3000/api/lottery/1");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: "OK",
      data: {
        lottery: mockLotteryEvent,
        products: mockLotteryProducts,
      },
    });
    expect(findLotteryEventById).toHaveBeenCalledTimes(1);
    expect(findLotteryEventById).toHaveBeenCalledWith(1);
    expect(getLotteryProductsByLotteryEventId).toHaveBeenCalledTimes(1);
    expect(getLotteryProductsByLotteryEventId).toHaveBeenCalledWith(1);
  });

  it("存在しない抽選イベントIDを送信して404を返すこと", async () => {
    mockCookieStore("test_admin_code");
    vi.mocked(findLotteryEventById).mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/lottery/999");
    const response = await GET(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not found", data: null });
    expect(findLotteryEventById).toHaveBeenCalledTimes(1);
    expect(findLotteryEventById).toHaveBeenCalledWith(999);
    expect(getLotteryProductsByLotteryEventId).not.toHaveBeenCalled();
  });

  it("例外が発生した場合は500を返すこと", async () => {
    mockCookieStore("test_admin_code");
    vi.mocked(findLotteryEventById).mockRejectedValue(new Error("DB error"));

    const request = new NextRequest("http://localhost:3000/api/lottery/1");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ message: "Internal server error", data: null });
    expect(findLotteryEventById).toHaveBeenCalledTimes(1);
  });
});
