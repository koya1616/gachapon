import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import type { Order } from "@/types";

describe("OrderStatusBadgeコンポーネント", () => {
  const baseOrder: Order = {
    user_id: 1,
    paypay_payment_id: 1,
    merchant_payment_id: "1",
    address: "東京都渋谷区...",
    created_at: "1620000000",
    shipped_at: null,
    delivered_at: null,
    cancelled_at: null,
    payment_failed_at: null,
  };

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const testStatus = (status: string, orderProps: Partial<Order>, expectedClass: string) => {
    it(`ステータスが${status}の場合、正しく表示されること`, () => {
      const order = { ...baseOrder, ...orderProps };
      render(<OrderStatusBadge order={order} lang="ja" />);

      const badge = screen.getByText(status);
      expect(badge).toBeDefined();
      expect(badge.className).toContain(expectedClass);
    });
  };

  testStatus("処理中", {}, "bg-yellow-100 text-yellow-800");
  testStatus("発送済み", { shipped_at: "1620010000" }, "bg-blue-100 text-blue-800");
  testStatus("配達済み", { delivered_at: "1620020000" }, "bg-green-100 text-green-800");
  testStatus("決済失敗", { payment_failed_at: "1620030000" }, "bg-red-100 text-red-800");
  testStatus("キャンセル済み", { cancelled_at: "1620040000" }, "bg-gray-100 text-gray-800");

  it("ステータスの優先順位が正しいこと", () => {
    const order = {
      ...baseOrder,
      shipped_at: "1620010000",
      delivered_at: "1620020000",
      cancelled_at: "1620030000",
      payment_failed_at: "1620040000",
    };

    render(<OrderStatusBadge order={order} lang="ja" />);

    expect(screen.getByText("決済失敗")).toBeDefined();
  });

  it("英語表示の場合、テキストが英語で表示されること", () => {
    render(<OrderStatusBadge order={baseOrder} lang="en" />);
    expect(screen.getByText("Processing")).toBeDefined();
  });

  it("中国語表示の場合、テキストが中国語で表示されること", () => {
    render(<OrderStatusBadge order={baseOrder} lang="zh" />);
    expect(screen.getByText("处理中")).toBeDefined();
  });

  it("日本語表示の場合、テキストが日本語で表示されること", () => {
    render(<OrderStatusBadge order={baseOrder} lang="ja" />);
    expect(screen.getByText("処理中")).toBeDefined();
  });
});
