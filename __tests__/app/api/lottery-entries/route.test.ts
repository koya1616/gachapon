import type { CreateLotteryEntryRequestBody } from "@/app/api/lottery-entries/route";
import { POST } from "@/app/api/lottery-entries/route";
import { USER_TOKEN } from "@/const/cookies";
import { createLotteryEntry } from "@/lib/db/lotteryEntries/query";
import { generateToken } from "@/lib/jwt";
import type { LotteryEntry } from "@/types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserFactory } from "../../../factory/user";

vi.mock("@/lib/db/lotteryEntries/query", () => ({
  createLotteryEntry: vi.fn(),
}));

vi.mock("next/server", async () => {
  const actual = await vi.importActual("next/server");
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({ data, options })),
    },
  };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const mockCookieStore = (token: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

let user: UserFactory;

describe("抽選エントリーAPI", () => {
  let mockRequest: NextRequest;
  let responseJson: LotteryEntry;

  beforeEach(() => {
    vi.resetAllMocks();

    responseJson = {
      id: 1,
      lottery_event_id: 1,
      user_id: 2,
      lottery_product_id: 3,
      result: 1,
      created_at: Date.now(),
    };

    const body: CreateLotteryEntryRequestBody = {
      lotteryEventId: 1,
      lotteryProductId: 3,
    };
    mockRequest = new NextRequest("http://localhost:3000/api/lottery-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    vi.mocked(createLotteryEntry).mockResolvedValue(responseJson);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザーが認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    await POST(mockRequest);
    expect(NextResponse.json).toHaveBeenCalledWith({ message: "Unauthorized", data: null }, { status: 401 });
  });

  it("正常に抽選エントリーを作成できること", async () => {
    user = await UserFactory.create();
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    await POST(mockRequest);

    expect(createLotteryEntry).toHaveBeenCalledWith(1, user.id, 3);
    expect(NextResponse.json).toHaveBeenCalledWith({ message: "OK", data: null }, { status: 200 });
  });

  it("必須フィールドが欠けている場合はエラーを返すこと", async () => {
    user = await UserFactory.create();
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    const invalidRequest = new NextRequest("http://localhost:3000/api/lottery-entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lotteryEventId: 1,
      }),
    });

    await POST(invalidRequest);

    expect(createLotteryEntry).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ message: "Bad Request", data: null }, { status: 400 });
  });

  it("データベースエラーが発生した場合は500エラーを返すこと", async () => {
    user = await UserFactory.create();
    mockCookieStore(generateToken({ id: user.id, type: "user" }));
    vi.mocked(createLotteryEntry).mockRejectedValue(new Error("Database error"));

    await POST(mockRequest);

    expect(createLotteryEntry).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ message: "Internal server error", data: null }, { status: 500 });
  });
});
