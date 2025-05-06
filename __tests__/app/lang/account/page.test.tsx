import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AccountPage from "@/app/[lang]/account/page";
import * as db from "@/lib/db";
import type { Lang, Order } from "@/types";
import { redirect } from "next/navigation";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { USER_TOKEN } from "@/const/cookies";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/jwt";

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
  getPaypayPaymentsByUserId: vi.fn(),
}));

vi.mock("@/app/[lang]/_components/AddressForm", () => ({
  default: ({ lang }: { lang: Lang }) => <div data-testid="address-form">AddressForm - {lang}</div>,
}));

vi.mock("@/app/[lang]/account/_components/LogoutButton", () => ({
  default: ({ lang }: { lang: Lang }) => <div data-testid="logout-button">LogoutButton - {lang}</div>,
}));

vi.mock("@/components/OrderStatusBadge", () => ({
  default: ({ order, lang }: { order: Order; lang: Lang }) => {
    let status: string;
    if (order.payment_failed_at) {
      status = "payment_failed";
    } else if (order.cancelled_at) {
      status = "cancelled";
    } else if (order.delivered_at) {
      status = "delivered";
    } else if (order.shipped_at) {
      status = "shipped";
    } else {
      status = "processing";
    }
    return (
      <div data-testid="order-status-badge">
        Status: {status} - Lang: {lang}
      </div>
    );
  },
}));

vi.mock("@/lib/date", () => ({
  formatDate: vi.fn((date) => "2025-05-07"),
}));

describe("AccountPage", () => {
  const mockUser = { id: 1, email: "test@example.com" };

  const mockOrders = [
    {
      user_id: mockUser.id,
      paypay_payment_id: 1111,
      merchant_payment_id: "merchant1",
      address: "Tokyo, Japan",
      shipped_at: new Date().toISOString(),
      delivered_at: null,
      payment_failed_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    },
    {
      user_id: mockUser.id,
      paypay_payment_id: 2222,
      merchant_payment_id: "merchant2",
      address: "Osaka, Japan",
      shipped_at: new Date().toISOString(),
      delivered_at: new Date().toISOString(),
      payment_failed_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    cleanup();
    vi.mocked(db.getPaypayPaymentsByUserId).mockResolvedValue(mockOrders);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderAccountPageWithLang = async (lang: string, expectedLang?: Lang) => {
    render(await AccountPage({ params: Promise.resolve({ lang }) }));
    const l = lang === "en" ? "en" : lang === "zh" ? "zh" : "ja";
    const expectedL = expectedLang || l;

    expect(screen.getByTestId("address-form").textContent).toBe(`AddressForm - ${expectedL}`);
    expect(screen.getByTestId("logout-button").textContent).toBe(`LogoutButton - ${expectedL}`);

    return expectedL;
  };

  it("未認証の場合、ログインページにリダイレクトすること", async () => {
    mockCookieStore("invalid_token");

    await AccountPage({ params: Promise.resolve({ lang: "ja" }) });

    expect(redirect).toHaveBeenCalledWith("/ja/login");
  });

  it("日本語で注文履歴を表示すること", async () => {
    mockCookieStore(generateToken({ id: mockUser.id, type: "user" }));
    const l = await renderAccountPageWithLang("ja");

    expect(screen.getByText("アカウント詳細")).toBeDefined();
    expect(screen.getByText("注文履歴")).toBeDefined();

    expect(screen.getAllByRole("row").length).toBe(3);
    expect(screen.getByText("1111")).toBeDefined();
    expect(screen.getByText("2222")).toBeDefined();

    const statusBadges = screen.getAllByTestId("order-status-badge");
    expect(statusBadges.length).toBe(2);
    expect(statusBadges[0].textContent).toContain(`Lang: ${l}`);

    expect(db.getPaypayPaymentsByUserId).toHaveBeenCalledWith(mockUser.id);
  });

  it("英語で注文履歴を表示すること", async () => {
    mockCookieStore(generateToken({ id: mockUser.id, type: "user" }));
    await renderAccountPageWithLang("en");

    expect(screen.getByText("Account Details")).toBeDefined();
    expect(screen.getByText("Order History")).toBeDefined();
  });

  it("中国語で注文履歴を表示すること", async () => {
    mockCookieStore(generateToken({ id: mockUser.id, type: "user" }));
    await renderAccountPageWithLang("zh");

    expect(screen.getByText("账户详细信息")).toBeDefined();
    expect(screen.getByText("订单历史")).toBeDefined();
  });

  it("サポートされていない言語コードの場合、デフォルトで日本語を使用すること", async () => {
    mockCookieStore(generateToken({ id: mockUser.id, type: "user" }));
    await renderAccountPageWithLang("fr", "ja");

    expect(screen.getByText("アカウント詳細")).toBeDefined();
  });

  it("注文が無い場合のメッセージが表示されること", async () => {
    mockCookieStore(generateToken({ id: mockUser.id, type: "user" }));
    vi.mocked(db.getPaypayPaymentsByUserId).mockResolvedValue([]);

    await renderAccountPageWithLang("ja");

    expect(screen.getByText("注文履歴はありません")).toBeDefined();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
