import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import UserPayPayPage from "@/app/[lang]/payment/paypay/[id]/page";
import * as db from "@/lib/db";
import * as paypay from "@/lib/paypay";
import { cookies } from "next/headers";
import { USER_TOKEN } from "@/const/cookies";
import type { Lang, PaymentProduct, Shipment } from "@/types";
import { redirect } from "next/navigation";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { generateToken } from "@/lib/jwt";
import type { PaypayGetCodePaymentDetailsResponse } from "@/lib/paypay";

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

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findShipmentByMerchantPaymentIdAndUserId: vi.fn(),
  getPaymentProductsByPaypayPaymentId: vi.fn(),
}));

vi.mock("@/lib/paypay", () => ({
  paypayGetCodePaymentDetails: vi.fn(),
}));

vi.mock("@/components/Order", () => ({
  default: ({
    paymentDetails,
    shipment,
    paymentProducts,
    lang,
  }: {
    paymentDetails: PaypayGetCodePaymentDetailsResponse | null;
    shipment: Shipment | null;
    paymentProducts: PaymentProduct[];
    lang: Lang;
  }) => (
    <div data-testid="order-component">
      <div data-testid="payment-details">{JSON.stringify(paymentDetails)}</div>
      <div data-testid="shipment">{JSON.stringify(shipment)}</div>
      <div data-testid="payment-products">{JSON.stringify(paymentProducts)}</div>
      <div data-testid="lang">{lang}</div>
    </div>
  ),
}));

describe("UserPayPayPage", () => {
  const mockPaymentId = "test-payment-id";
  const mockUserId = 1;

  const mockShipment: Shipment = {
    id: 1,
    paypay_payment_id: 1,
    address: "東京都渋谷区...",
    created_at: 1620000000,
    shipped_at: 1620010000,
    delivered_at: null,
    cancelled_at: null,
    payment_failed_at: null,
  };

  const mockPaymentProducts: PaymentProduct[] = [
    { id: 1, name: "商品1", price: 1000, image: "image1.jpg", quantity: 2, product_id: 1, paypay_payment_id: 1 },
  ];

  const mockPaymentDetails: PaypayGetCodePaymentDetailsResponse = {
    data: {
      status: "COMPLETED",
      amount: { amount: 2000 },
      requestedAt: 1630000000,
      acceptedAt: 1640001000,
    },
  };

  const createUserToken = (userId: number = mockUserId) => {
    return generateToken({ id: userId, type: "user" });
  };

  const renderUserPayPayPage = async (lang: string, token: string = createUserToken()) => {
    mockCookieStore(token);
    return render(await UserPayPayPage({ params: Promise.resolve({ lang, id: mockPaymentId }) }));
  };

  const assertOrderComponentRendered = (expectedLang: string) => {
    expect(screen.getByTestId("order-component")).toBeDefined();
    expect(JSON.parse(screen.getByTestId("payment-details").textContent || "")).toEqual(mockPaymentDetails);
    expect(JSON.parse(screen.getByTestId("shipment").textContent || "")).toEqual(mockShipment);
    expect(JSON.parse(screen.getByTestId("payment-products").textContent || "")).toEqual(mockPaymentProducts);
    expect(screen.getByTestId("lang").textContent).toBe(expectedLang);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();

    vi.mocked(db.findShipmentByMerchantPaymentIdAndUserId).mockResolvedValue(mockShipment);
    vi.mocked(db.getPaymentProductsByPaypayPaymentId).mockResolvedValue(mockPaymentProducts);
    vi.mocked(paypay.paypayGetCodePaymentDetails).mockResolvedValue(mockPaymentDetails);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("正常にページがレンダリングされること", async () => {
    await renderUserPayPayPage("ja");

    assertOrderComponentRendered("ja");
    expect(db.findShipmentByMerchantPaymentIdAndUserId).toHaveBeenCalledWith(mockPaymentId, mockUserId);
    expect(paypay.paypayGetCodePaymentDetails).toHaveBeenCalledWith(mockPaymentId);
    expect(db.getPaymentProductsByPaypayPaymentId).toHaveBeenCalledWith(mockShipment.paypay_payment_id);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("トークンが無効な場合、ログインページにリダイレクトすること", async () => {
    await renderUserPayPayPage("ja", "invalid-token");

    expect(redirect).toHaveBeenCalledWith("/ja/login");
    expect(db.findShipmentByMerchantPaymentIdAndUserId).not.toHaveBeenCalled();
  });

  it("配送情報が見つからない場合、アカウントページにリダイレクトすること", async () => {
    mockCookieStore(createUserToken());
    vi.mocked(db.findShipmentByMerchantPaymentIdAndUserId).mockResolvedValue(null);

    await UserPayPayPage({ params: Promise.resolve({ lang: "ja", id: mockPaymentId }) });

    expect(redirect).toHaveBeenCalledWith("/ja/account");
    expect(paypay.paypayGetCodePaymentDetails).not.toHaveBeenCalled();
  });

  it.each([
    ["en", "en"],
    ["zh", "zh"],
    ["fr", "ja"],
  ])("%s ロケールが正しく処理されること", async (inputLang, expectedLang) => {
    await renderUserPayPayPage(inputLang);
    assertOrderComponentRendered(expectedLang);
  });
});
