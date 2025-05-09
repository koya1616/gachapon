import LotteriesPage from "@/app/admin/lotteries/page";
import { formatDate } from "@/lib/date";
import { type LotteryEvent, LotteryStatus } from "@/types";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalFetch = global.fetch;

Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("抽選管理ページ", () => {
  const mockLotteries: LotteryEvent[] = [
    {
      id: 1,
      name: "テスト抽選イベント1",
      description: "説明文1",
      start_at: Date.now(),
      end_at: Date.now() + 86400000,
      result_at: Date.now() + 172800000,
      payment_deadline_at: Date.now() + 259200000,
      status: LotteryStatus.DRAFT,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "テスト抽選イベント2",
      description: "説明文2",
      start_at: Date.now() + 100000,
      end_at: Date.now() + 96400000,
      result_at: Date.now() + 182800000,
      payment_deadline_at: Date.now() + 269200000,
      status: LotteryStatus.ACTIVE,
      created_at: Date.now(),
    },
  ];

  beforeEach(() => {
    cleanup();
    window.location.href = "";
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.fetch = originalFetch;
  });

  it("ロード中にLoadingコンポーネントが表示されること", async () => {
    vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

    render(<LotteriesPage />);

    expect(screen.getByText("抽選管理")).toBeDefined();
    expect(screen.getByTestId("loading")).toBeDefined();
  });

  it("抽選イベント一覧が正しく表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: mockLotteries }),
    } as Response);

    render(<LotteriesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).toBeNull();
    });

    expect(screen.getByText("テスト抽選イベント1")).toBeDefined();
    expect(screen.getByText("テスト抽選イベント2")).toBeDefined();
    expect(screen.getAllByText("詳細").length).toBe(2);
    expect(screen.getAllByRole("link", { name: "編集" }).length).toBe(2);

    for (const lottery of mockLotteries) {
      expect(screen.getByText(formatDate(lottery.start_at))).toBeDefined();
      expect(screen.getByText(formatDate(lottery.end_at))).toBeDefined();
      expect(screen.getByText(formatDate(lottery.result_at))).toBeDefined();
      expect(screen.getByText(formatDate(lottery.payment_deadline_at))).toBeDefined();
    }
  });

  it("401エラー時に管理者ログインページにリダイレクトすること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 401,
      json: async () => ({}),
    } as Response);

    render(<LotteriesPage />);

    await waitFor(() => {
      expect(window.location.href).toBe("/admin/login");
    });
  });

  it("抽選イベントが0件の場合、適切なメッセージが表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: [] }),
    } as Response);

    render(<LotteriesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).toBeNull();
    });

    expect(screen.getByText("抽選イベントはまだ作成されていません")).toBeDefined();
    expect(screen.getByText("抽選イベント作成")).toBeDefined();
  });

  it("各ステータスのバッジが正しく表示されること", async () => {
    const allStatusLotteries: LotteryEvent[] = [
      {
        id: 1,
        name: "下書きイベント",
        description: "説明文",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: LotteryStatus.DRAFT,
        created_at: Date.now(),
      },
      {
        id: 2,
        name: "実施中イベント",
        description: "説明文",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: LotteryStatus.ACTIVE,
        created_at: Date.now(),
      },
      {
        id: 3,
        name: "終了イベント",
        description: "説明文",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: LotteryStatus.FINISHED,
        created_at: Date.now(),
      },
      {
        id: 4,
        name: "キャンセルイベント",
        description: "説明文",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: LotteryStatus.CANCELLED,
        created_at: Date.now(),
      },
      {
        id: 5,
        name: "不明ステータスイベント",
        description: "説明文",
        start_at: Date.now(),
        end_at: Date.now() + 86400000,
        result_at: Date.now() + 172800000,
        payment_deadline_at: Date.now() + 259200000,
        status: 999,
        created_at: Date.now(),
      },
    ];

    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: allStatusLotteries }),
    } as Response);

    render(<LotteriesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).toBeNull();
    });

    expect(screen.getByText("下書き")).toBeDefined();
    expect(screen.getByText("実施中")).toBeDefined();
    expect(screen.getByText("終了")).toBeDefined();
    expect(screen.getByText("キャンセル")).toBeDefined();
    expect(screen.getByText("不明")).toBeDefined();
  });

  it("APIエラー時に空の配列を設定すること", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("API error"));

    render(<LotteriesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).toBeNull();
    });

    expect(screen.getByText("抽選イベントはまだ作成されていません")).toBeDefined();
  });
});
