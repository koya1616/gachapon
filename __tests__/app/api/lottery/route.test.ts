import { GET } from "@/app/api/lottery/route";
import { ADMIN_CODE } from "@/const/cookies";
import { findLotteryEventById } from "@/lib/db";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { LotteryEventFactory } from "../../../factory/lotteryEvent";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("GET /api/lottery", () => {
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

  it("管理者が認証されている場合は200と抽選イベントデータを返す", async () => {
    const lotteryEventFactory = await LotteryEventFactory.create();
    mockCookieStore("test_admin_code");

    const response = await GET();
    expect(response.status).toBe(200);
    const { data } = await response.json();
    const lotteryEvent = await findLotteryEventById(lotteryEventFactory.id);
    expect(data).toContainEqual(lotteryEvent);
  });
});
