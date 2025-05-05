import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/paypay/route";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { USER_TOKEN } from "@/const/cookies";
import { NextRequest } from "next/server";
import { generateToken } from "@/lib/jwt";
import { PAYPAY_GET_CODE_PAYMENT_DETAILS, PAYPAY_QR_CODE_CREATE, PAYPAY_TYPE } from "@/const/header";
import {
  executeTransaction,
  findAddressByUserId,
  createPaypayPaymentWithTransaction,
  createShipmentWithTransaction,
  createPaymentProductsWithTransaction,
} from "@/lib/db";
import { paypayGetCodePaymentDetails, paypayQRCodeCreate, type PaypayQRCodeCreateRequest } from "@/lib/paypay";
import type { Client } from "pg";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  executeTransaction: vi.fn(),
  findAddressByUserId: vi.fn(),
  createPaypayPaymentWithTransaction: vi.fn(),
  createShipmentWithTransaction: vi.fn(),
  createPaymentProductsWithTransaction: vi.fn(),
}));

vi.mock("@/lib/paypay", () => ({
  paypayQRCodeCreate: vi.fn(),
  paypayGetCodePaymentDetails: vi.fn(),
}));

const mockCookieStore = (token: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("POST /api/paypay", () => {
  const user = { id: 1, email: "test@example.com" };

  beforeEach(async () => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザーが認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const mockRequest = new NextRequest("http://localhost:3000/api/paypay", {
      method: "POST",
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  describe("QRコード作成", () => {
    it("QRコード作成が成功した場合は200とURLを返す", async () => {
      mockCookieStore(generateToken({ id: user.id, type: "user" }));

      const mockPayload: PaypayQRCodeCreateRequest = {
        merchantPaymentId: "test-merchant-payment-id",
        orderItems: [
          {
            quantity: 1,
            unitPrice: { amount: 1000, currency: "JPY" },
            name: "テスト商品",
            productId: "1",
          },
        ],
      };

      const mockRequest = new NextRequest("http://localhost:3000/api/paypay", {
        method: "POST",
        headers: {
          [PAYPAY_TYPE]: PAYPAY_QR_CODE_CREATE,
        },
        body: JSON.stringify(mockPayload),
      });

      vi.mocked(findAddressByUserId).mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        name: "テストユーザー",
        country: "Japan",
        postal_code: "123-4567",
        address: "Tokyo",
      });

      vi.mocked(createPaypayPaymentWithTransaction).mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        merchant_payment_id: "test-merchant-payment-id",
      });

      vi.mocked(executeTransaction).mockImplementation(async (callback) => {
        return await callback({} as unknown as Client);
      });

      vi.mocked(paypayQRCodeCreate).mockResolvedValueOnce({
        data: {
          url: "https://example.com/qr-code",
        },
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ message: "OK", data: { url: "https://example.com/qr-code" } });

      expect(executeTransaction).toHaveBeenCalledTimes(1);
      expect(findAddressByUserId).toHaveBeenCalledWith(1);
      expect(createPaypayPaymentWithTransaction).toHaveBeenCalledWith(expect.anything(), {
        user_id: 1,
        merchant_payment_id: "test-merchant-payment-id",
      });
      expect(createShipmentWithTransaction).toHaveBeenCalledTimes(1);
      expect(createPaymentProductsWithTransaction).toHaveBeenCalledTimes(1);
      expect(paypayQRCodeCreate).toHaveBeenCalledWith(mockPayload);
    });

    it("アドレスが見つからない場合は500を返す", async () => {
      mockCookieStore(generateToken({ id: user.id, type: "user" }));

      const mockPayload = {
        merchantPaymentId: "test-merchant-payment-id",
        orderItems: [
          {
            quantity: 1,
            unitPrice: { amount: 1000 },
            productId: "1",
          },
        ],
      };

      const mockRequest = new NextRequest("http://localhost:3000/api/paypay", {
        method: "POST",
        headers: {
          [PAYPAY_TYPE]: PAYPAY_QR_CODE_CREATE,
        },
        body: JSON.stringify(mockPayload),
      });

      // アドレスが見つからないケース
      vi.mocked(findAddressByUserId).mockResolvedValueOnce(null);
      vi.mocked(executeTransaction).mockImplementation(async (callback) => {
        return await callback({} as unknown as Client);
      });
      // vi.mocked(executeTransaction).mockImplementation(async (callback) => {
      //   try {
      //     return await callback({} as any);
      //   } catch (error) {
      //     throw error;
      //   }
      // });

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        message: "Internal Server Error",
        data: null,
      });
    });
  });

  describe("決済詳細の取得", () => {
    it("決済詳細の取得が成功した場合は200とステータスを返す", async () => {
      mockCookieStore(generateToken({ id: user.id, type: "user" }));

      const mockRequest = new NextRequest("http://localhost:3000/api/paypay", {
        method: "POST",
        headers: {
          [PAYPAY_TYPE]: PAYPAY_GET_CODE_PAYMENT_DETAILS,
        },
        body: JSON.stringify({ merchantPaymentId: "test-merchant-payment-id" }),
      });

      vi.mocked(paypayGetCodePaymentDetails).mockResolvedValueOnce({
        data: {
          status: "COMPLETED",
          requestedAt: 0,
          acceptedAt: 0,
          amount: {
            amount: 0,
          },
        },
      });

      const response = await POST(mockRequest);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
        message: "OK",
        data: { status: "COMPLETED" },
      });

      expect(paypayGetCodePaymentDetails).toHaveBeenCalledWith("test-merchant-payment-id");
    });

    it("決済詳細の取得に失敗した場合は500を返す", async () => {
      mockCookieStore(generateToken({ id: user.id, type: "user" }));

      const mockRequest = new NextRequest("http://localhost:3000/api/paypay", {
        method: "POST",
        headers: {
          [PAYPAY_TYPE]: PAYPAY_GET_CODE_PAYMENT_DETAILS,
        },
        body: JSON.stringify({ merchantPaymentId: "test-merchant-payment-id" }),
      });

      vi.mocked(paypayGetCodePaymentDetails).mockResolvedValueOnce(null);

      const response = await POST(mockRequest);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ message: "Internal Server Error", data: null });
    });
  });

  it("不明なPayPayタイプの場合は400を返す", async () => {
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    const mockRequest = new NextRequest("http://localhost:3000/api/paypay", {
      method: "POST",
      headers: {
        [PAYPAY_TYPE]: "UNKNOWN_TYPE",
      },
      body: JSON.stringify({}),
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ message: "Bad Request", data: null });
  });
});
