import { GET } from "@/app/api/auction/[id]/route";
import { ADMIN_CODE } from "@/const/cookies";
import { findAuctionById, findProductById, getSealedBidsAuctionId } from "@/lib/db";
import { mockAuctionData, mockProducts } from "@/mocks/data";
import type { SealedBid } from "@/types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findAuctionById: vi.fn(),
  findProductById: vi.fn(),
  getSealedBidsAuctionId: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

const createMockRequest = (id: number) => {
  const url = new URL(`http://localhost:3000/api/auction/${id}`);
  return new NextRequest(url);
};

const mockSealedBids: SealedBid[] = [
  {
    id: 1,
    auction_id: 1,
    user_id: 101,
    amount: 5000,
    created_at: new Date("2025-06-02T10:00:00").getTime(),
  },
  {
    id: 2,
    auction_id: 1,
    user_id: 102,
    amount: 6000,
    created_at: new Date("2025-06-03T15:30:00").getTime(),
  },
];

describe("GET /api/auction/[id]", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const request = createMockRequest(1);
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("存在するオークションIDを送信して200とオークション情報を返すこと", async () => {
    const mockAuction = mockAuctionData[0];
    const mockProduct = mockProducts[0];

    vi.mocked(findAuctionById).mockResolvedValue(mockAuction);
    vi.mocked(findProductById).mockResolvedValue(mockProduct);
    vi.mocked(getSealedBidsAuctionId).mockResolvedValue(mockSealedBids);
    mockCookieStore("test_admin_code");

    const request = createMockRequest(1);
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: "OK",
      data: {
        auction: mockAuction,
        product: mockProduct,
        bids: mockSealedBids,
      },
    });

    expect(findAuctionById).toHaveBeenCalledTimes(1);
    expect(findAuctionById).toHaveBeenCalledWith(1);
    expect(findProductById).toHaveBeenCalledTimes(1);
    expect(findProductById).toHaveBeenCalledWith(mockAuction.product_id);
    expect(getSealedBidsAuctionId).toHaveBeenCalledTimes(1);
    expect(getSealedBidsAuctionId).toHaveBeenCalledWith(mockAuction.id);
  });

  it("存在しないオークションIDを送信して404を返すこと", async () => {
    vi.mocked(findAuctionById).mockResolvedValue(null);
    mockCookieStore("test_admin_code");

    const request = createMockRequest(999);
    const response = await GET(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not found", data: null });
    expect(findAuctionById).toHaveBeenCalledTimes(1);
    expect(findAuctionById).toHaveBeenCalledWith(999);
  });

  it("データ取得中にエラーが発生した場合は500を返す", async () => {
    mockCookieStore("test_admin_code");
    vi.mocked(findAuctionById).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(1);
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ message: "Internal server error", data: null });
  });
});
