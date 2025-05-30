import Payment from "@/app/admin/payment/page";
import { ADMIN_CODE } from "@/const/cookies";
import * as db from "@/lib/db";
import type { Order } from "@/types";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getPaypayPayments: vi.fn(),
}));

vi.mock("@/components/OrderStatusBadge", () => ({
  default: ({ order }: { order: Order }) => {
    let status: string;
    if (order.payment_failed_at) {
      status = "決済失敗";
    } else if (order.cancelled_at) {
      status = "キャンセル済み";
    } else if (order.delivered_at) {
      status = "配達済み";
    } else if (order.shipped_at) {
      status = "発送済み";
    } else {
      status = "処理中";
    }
    return <div data-testid="order-status-badge">{status}</div>;
  },
}));

vi.stubEnv("ADMIN_CODE", "test_admin_code");

describe("管理者決済履歴ページ", () => {
  const mockOrders = [
    {
      user_id: 1,
      paypay_payment_id: 1111,
      merchant_payment_id: "merchant1",
      address: "東京都渋谷区...",
      shipped_at: null,
      delivered_at: null,
      payment_failed_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    },
    {
      user_id: 2,
      paypay_payment_id: 2222,
      merchant_payment_id: "merchant2",
      address: "大阪府大阪市...",
      shipped_at: new Date().toISOString(),
      delivered_at: null,
      payment_failed_at: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    },
    {
      user_id: 3,
      paypay_payment_id: 3333,
      merchant_payment_id: "merchant3",
      address: "北海道札幌市...",
      shipped_at: null,
      delivered_at: null,
      payment_failed_at: new Date().toISOString(),
      cancelled_at: null,
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.mocked(db.getPaypayPayments).mockResolvedValue(mockOrders);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("管理者権限がない場合、ログインページにリダイレクトすること", async () => {
    mockCookieStore("invalid_token");

    await Payment();

    expect(redirect).toHaveBeenCalledWith("/admin/login");
  });

  it("管理者権限がある場合、決済履歴が表示されること", async () => {
    mockCookieStore("test_admin_code");

    render(await Payment());

    expect(screen.getByText("決済履歴")).toBeDefined();

    const table = screen.getByRole("table");
    expect(table).toBeDefined();

    expect(screen.getByText("ユーザーID")).toBeDefined();
    expect(screen.getByText("決済ID")).toBeDefined();
    expect(screen.getByText("ステータス")).toBeDefined();

    expect(screen.getAllByText("1")).toBeDefined();
    expect(screen.getAllByText("2")).toBeDefined();
    expect(screen.getAllByText("3")).toBeDefined();
    expect(screen.getAllByText("merchant1")).toBeDefined();
    expect(screen.getAllByText("merchant2")).toBeDefined();
    expect(screen.getAllByText("merchant3")).toBeDefined();

    const statusBadges = screen.getAllByTestId("order-status-badge");
    expect(statusBadges.length).toBe(3);
    expect(statusBadges[0].textContent).toBe("処理中");
    expect(statusBadges[1].textContent).toBe("発送済み");
    expect(statusBadges[2].textContent).toBe("決済失敗");

    const detailLinks = screen.getAllByText("詳細");
    expect(detailLinks.length).toBe(3);
    detailLinks.forEach((link, index) => {
      const expectedMerchantId = mockOrders[index % mockOrders.length].merchant_payment_id;
      expect(link.closest("a")?.getAttribute("href")).toBe(`/admin/payment/paypay/${expectedMerchantId}`);
    });

    expect(db.getPaypayPayments).toHaveBeenCalled();
  });
});
