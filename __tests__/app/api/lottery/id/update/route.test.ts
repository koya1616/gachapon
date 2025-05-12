import { PUT, type UpdateLotteryEventApiRequestBody } from "@/app/api/lottery/[id]/update/route";
import { ADMIN_CODE } from "@/const/cookies";
import { findLotteryEventById, updateLotteryEvent } from "@/lib/db";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findLotteryEventById: vi.fn(),
  updateLotteryEvent: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

const createTestRequestBody = (overrides = {}): UpdateLotteryEventApiRequestBody => {
  const now = Date.now();
  return {
    name: "更新された抽選名",
    description: "更新された説明",
    startAt: now,
    endAt: now + 86400000,
    resultAt: now + 172800000,
    paymentDeadlineAt: now + 259200000,
    status: 1,
    ...overrides,
  };
};

const createTestRequest = (id: number, body: UpdateLotteryEventApiRequestBody) => {
  return new NextRequest(`http://localhost:3000/api/lottery/${id}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

describe("PUT /api/lottery/[id]/update", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("管理者が認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const requestBody = createTestRequestBody();
    const request = createTestRequest(1, requestBody);
    const response = await PUT(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("存在しない抽選イベントIDを更新しようとすると404を返す", async () => {
    mockCookieStore("test_admin_code");
    vi.mocked(findLotteryEventById).mockResolvedValue(null);

    const requestBody = createTestRequestBody();
    const request = createTestRequest(999, requestBody);
    const response = await PUT(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not found", data: null });
    expect(findLotteryEventById).toHaveBeenCalledWith(999);
  });

  it("抽選イベントの更新に失敗した場合は500を返す", async () => {
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

    vi.mocked(findLotteryEventById).mockResolvedValue(mockLotteryEvent);
    vi.mocked(updateLotteryEvent).mockResolvedValue(null);

    const requestBody = createTestRequestBody();
    const request = createTestRequest(1, requestBody);
    const response = await PUT(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ message: "Bad request", data: null });
  });

  it("抽選イベントの更新に成功した場合は200と更新されたデータを返す", async () => {
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

    const updatedLotteryEvent = {
      id: 1,
      name: "更新された抽選名",
      description: "更新された説明",
      start_at: now,
      end_at: now + 86400000,
      result_at: now + 172800000,
      payment_deadline_at: now + 259200000,
      status: 1,
      created_at: now,
    };

    vi.mocked(findLotteryEventById).mockResolvedValue(mockLotteryEvent);
    vi.mocked(updateLotteryEvent).mockResolvedValue(updatedLotteryEvent);

    const requestBody = createTestRequestBody();
    const request = createTestRequest(1, requestBody);
    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: updatedLotteryEvent });

    expect(updateLotteryEvent).toHaveBeenCalledWith(1, {
      name: requestBody.name,
      description: requestBody.description,
      start_at: requestBody.startAt,
      end_at: requestBody.endAt,
      result_at: requestBody.resultAt,
      payment_deadline_at: requestBody.paymentDeadlineAt,
      status: requestBody.status,
    });
  });

  it("部分的な更新が正しく行われること", async () => {
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

    const updatedLotteryEvent = {
      id: 1,
      name: "更新された抽選名",
      description: "テスト説明",
      start_at: now,
      end_at: now + 86400000,
      result_at: now + 172800000,
      payment_deadline_at: now + 259200000,
      status: 1,
      created_at: now,
    };

    vi.mocked(findLotteryEventById).mockResolvedValue(mockLotteryEvent);
    vi.mocked(updateLotteryEvent).mockResolvedValue(updatedLotteryEvent);

    const requestBody = {
      name: "更新された抽選名",
      status: 1,
    };

    const request = createTestRequest(1, requestBody);
    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: updatedLotteryEvent });

    expect(updateLotteryEvent).toHaveBeenCalledWith(1, {
      name: requestBody.name,
      description: undefined,
      start_at: undefined,
      end_at: undefined,
      result_at: undefined,
      payment_deadline_at: undefined,
      status: requestBody.status,
    });
  });

  it("エラーが発生した場合は500を返す", async () => {
    mockCookieStore("test_admin_code");

    vi.mocked(findLotteryEventById).mockImplementation(() => {
      throw new Error("Database error");
    });

    const requestBody = createTestRequestBody();
    const request = createTestRequest(1, requestBody);
    const response = await PUT(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ message: "Internal Server Error", data: null });
  });
});
