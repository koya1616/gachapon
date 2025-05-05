import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/paypay/callback/route";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { USER_TOKEN } from "@/const/cookies";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { findPaypayPaymentByMerchantPaymentId } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { UserFactory } from "../../../../factory/user";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((url) => {
    return NextResponse.redirect(url);
  }),
}));

vi.mock("@/lib/db", async () => {
  const actual = await vi.importActual("@/lib/db");
  return {
    ...actual,
    findPaypayPaymentByMerchantPaymentId: vi.fn(),
  };
});

const mockCookieStore = (token: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("GET /api/paypay/callback", () => {
  let user: UserFactory;
  const merchantPaymentId = "test-merchant-payment-id";
  const mockRequest = new NextRequest(
    `http://localhost:3000/api/paypay/callback?merchantPaymentId=${merchantPaymentId}`,
  );

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザーが認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const response = await GET(mockRequest);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("PayPay決済情報が見つからない場合は404を返す", async () => {
    user = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    vi.mocked(findPaypayPaymentByMerchantPaymentId).mockResolvedValueOnce(null);

    const response = await GET(mockRequest);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toEqual({ message: "Not Found", data: null });
  });

  it("PayPay決済情報のユーザーIDと認証されたユーザーIDが一致しない場合は401を返す", async () => {
    user = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);
    const otherUserId = user.id + 1;
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    vi.mocked(findPaypayPaymentByMerchantPaymentId).mockResolvedValueOnce({
      id: 1,
      user_id: otherUserId,
      merchant_payment_id: merchantPaymentId,
    });

    const response = await GET(mockRequest);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("PayPay決済情報のユーザーIDと認証されたユーザーIDが一致する場合は結果画面にリダイレクトする", async () => {
    user = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    vi.mocked(findPaypayPaymentByMerchantPaymentId).mockResolvedValueOnce({
      id: 1,
      user_id: user.id,
      merchant_payment_id: merchantPaymentId,
    });

    await GET(mockRequest);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(`/ja/payment/paypay/${merchantPaymentId}`);
  });
});
