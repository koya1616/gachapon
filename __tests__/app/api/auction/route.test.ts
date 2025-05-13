import { GET } from "@/app/api/auction/route";
import { ADMIN_CODE } from "@/const/cookies";
import { getAuctions } from "@/lib/db/auctions/query";
import { mockAuctionData } from "@/mocks/data";
import type { Auction } from "@/types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db/auctions/query", () => ({
  getAuctions: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("GET /api/auction", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const response = await GET();
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("管理者が認証されている場合は200とオークションデータを返す", async () => {
    vi.mocked(getAuctions).mockResolvedValue(mockAuctionData);
    mockCookieStore("test_admin_code");

    const response = await GET();
    expect(response.status).toBe(200);
    const { data } = await response.json();
    expect(data).toEqual(mockAuctionData);
    expect(getAuctions).toHaveBeenCalledTimes(1);
  });

  it("データ取得中にエラーが発生した場合は500を返す", async () => {
    mockCookieStore("test_admin_code");
    vi.mocked(getAuctions).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ message: "Internal server error", data: null });
  });
});
