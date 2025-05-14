import { GET, PUT, type UpdateAuctionApiRequestBody } from "@/app/api/auction/[id]/route";
import { ADMIN_CODE } from "@/const/cookies";
import { findAuctionById, findProductById, getSealedBidsAuctionId, updateAuction } from "@/lib/db";
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
  updateAuction: vi.fn(),
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

const createMockPutRequest = (id: number, data: UpdateAuctionApiRequestBody) => {
  const url = new URL(`http://localhost:3000/api/auction/${id}`);
  return new NextRequest(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
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

describe("PUT /api/auction/[id]", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const auctionData: UpdateAuctionApiRequestBody = {
      name: "更新されたオークション",
      description: "説明が更新されました",
    };
    const request = createMockPutRequest(1, auctionData);
    const response = await PUT(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
    expect(updateAuction).not.toHaveBeenCalled();
  });

  it("存在するオークションを更新して200を返すこと", async () => {
    mockCookieStore("test_admin_code");

    const auctionId = 1;
    const existingAuction = mockAuctionData[0];
    const auctionData: UpdateAuctionApiRequestBody = {
      name: "更新されたオークション",
      description: "説明が更新されました",
      isSealed: true,
    };

    const updatedAuction = {
      ...existingAuction,
      name: auctionData.name || existingAuction.name,
      description: auctionData.description || existingAuction.description,
      is_sealed: auctionData.isSealed !== undefined ? auctionData.isSealed : existingAuction.is_sealed,
    };

    vi.mocked(findAuctionById).mockResolvedValue(existingAuction);
    vi.mocked(updateAuction).mockResolvedValue(updatedAuction);

    const request = createMockPutRequest(auctionId, auctionData);
    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });

    expect(findAuctionById).toHaveBeenCalledTimes(1);
    expect(findAuctionById).toHaveBeenCalledWith(auctionId);

    expect(updateAuction).toHaveBeenCalledTimes(1);
    expect(updateAuction).toHaveBeenCalledWith({
      id: auctionId,
      name: auctionData.name,
      description: auctionData.description,
      start_at: existingAuction.start_at,
      end_at: existingAuction.end_at,
      payment_deadline_at: existingAuction.payment_deadline_at,
      status: existingAuction.status,
      is_sealed: auctionData.isSealed,
      allow_bid_retraction: existingAuction.allow_bid_retraction,
      need_payment_info: existingAuction.need_payment_info,
      product_id: existingAuction.product_id,
      minimum_bid: existingAuction.minimum_bid,
    });
  });

  it("存在しないオークションIDの場合は404を返すこと", async () => {
    mockCookieStore("test_admin_code");

    const auctionId = 999;
    const auctionData: UpdateAuctionApiRequestBody = {
      name: "存在しないオークション",
      description: "このオークションは存在しません",
    };

    vi.mocked(findAuctionById).mockResolvedValue(null);

    const request = createMockPutRequest(auctionId, auctionData);
    const response = await PUT(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not found", data: null });

    expect(findAuctionById).toHaveBeenCalledTimes(1);
    expect(findAuctionById).toHaveBeenCalledWith(auctionId);
    expect(updateAuction).not.toHaveBeenCalled();
  });

  it("データ更新中にエラーが発生した場合は500を返すこと", async () => {
    mockCookieStore("test_admin_code");

    const auctionId = 1;
    const existingAuction = mockAuctionData[0];
    const auctionData: UpdateAuctionApiRequestBody = {
      name: "エラーが発生するオークション",
    };

    vi.mocked(findAuctionById).mockResolvedValue(existingAuction);
    vi.mocked(updateAuction).mockRejectedValue(new Error("Database error"));

    const request = createMockPutRequest(auctionId, auctionData);
    const response = await PUT(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ message: "Internal Server Error", data: null });

    expect(findAuctionById).toHaveBeenCalledTimes(1);
    expect(updateAuction).toHaveBeenCalledTimes(1);
  });

  it("複数のフィールドを更新できること", async () => {
    mockCookieStore("test_admin_code");

    const auctionId = 1;
    const existingAuction = mockAuctionData[0];
    const auctionData: UpdateAuctionApiRequestBody = {
      name: "複数更新オークション",
      description: "複数のフィールドを更新します",
      startAt: 1720000000000,
      endAt: 1730000000000,
      status: 2,
      isSealed: false,
      allowBidRetraction: false,
      needPaymentInfo: true,
      productId: 3,
      minimumBid: existingAuction.minimum_bid,
    };

    const updatedAuction = {
      id: auctionId,
      name: "複数更新オークション",
      description: "複数のフィールドを更新します",
      start_at: 1720000000000,
      end_at: 1730000000000,
      payment_deadline_at: existingAuction.payment_deadline_at,
      status: 2,
      is_sealed: false,
      allow_bid_retraction: false,
      need_payment_info: true,
      product_id: 3,
      minimum_bid: existingAuction.minimum_bid,
      created_at: existingAuction.created_at,
    };

    vi.mocked(findAuctionById).mockResolvedValue(existingAuction);
    vi.mocked(updateAuction).mockResolvedValue(updatedAuction);

    const request = createMockPutRequest(auctionId, auctionData);
    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });

    expect(updateAuction).toHaveBeenCalledWith({
      id: auctionId,
      name: auctionData.name,
      description: auctionData.description,
      start_at: auctionData.startAt,
      end_at: auctionData.endAt,
      payment_deadline_at: existingAuction.payment_deadline_at,
      status: auctionData.status,
      is_sealed: auctionData.isSealed,
      allow_bid_retraction: auctionData.allowBidRetraction,
      need_payment_info: auctionData.needPaymentInfo,
      product_id: auctionData.productId,
      minimum_bid: existingAuction.minimum_bid,
    });
  });
});
