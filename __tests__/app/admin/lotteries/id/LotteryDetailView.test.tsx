import LotteryDetailView from "@/app/admin/lotteries/[id]/_components/PageView/LotteryDetailView";
import { formatDate } from "@/lib/date";
import { mockLotteryEvents, mockProducts } from "@/mocks/data";
import { type LotteryEvent, LotteryStatus } from "@/types";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

describe("LotteryDetailViewコンポーネント", () => {
  const mockLottery: LotteryEvent = mockLotteryEvents[0];

  const getStatusBadge = (status: number) => {
    switch (status) {
      case LotteryStatus.DRAFT:
        return (
          <span data-testid="status-badge" className="bg-gray-100 text-gray-800">
            下書き
          </span>
        );
      case LotteryStatus.ACTIVE:
        return (
          <span data-testid="status-badge" className="bg-green-100 text-green-800">
            実施中
          </span>
        );
      case LotteryStatus.FINISHED:
        return (
          <span data-testid="status-badge" className="bg-blue-100 text-blue-800">
            終了
          </span>
        );
      case LotteryStatus.CANCELLED:
        return (
          <span data-testid="status-badge" className="bg-red-100 text-red-800">
            キャンセル
          </span>
        );
      default:
        return (
          <span data-testid="status-badge" className="bg-gray-100 text-gray-800">
            不明
          </span>
        );
    }
  };

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Loading状態が正しく表示されること", () => {
    render(
      <LotteryDetailView lottery={null} products={[]} loading={true} error={null} getStatusBadge={getStatusBadge} />,
    );

    expect(screen.getByTestId("loading")).toBeDefined();
  });

  it("エラー状態が正しく表示されること", () => {
    const errorMessage = "テストエラーメッセージ";

    render(
      <LotteryDetailView
        lottery={null}
        products={[]}
        loading={false}
        error={errorMessage}
        getStatusBadge={getStatusBadge}
      />,
    );

    expect(screen.getByText("エラーが発生しました")).toBeDefined();
    expect(screen.getByText(errorMessage)).toBeDefined();
    expect(screen.getByText("抽選一覧に戻る")).toBeDefined();
  });

  it("抽選情報が見つからない場合のメッセージが表示されること", () => {
    render(
      <LotteryDetailView lottery={null} products={[]} loading={false} error={null} getStatusBadge={getStatusBadge} />,
    );

    expect(screen.getByText("抽選情報が見つかりませんでした。")).toBeDefined();
    expect(screen.getByText("抽選一覧に戻る")).toBeDefined();
  });

  it("抽選情報が正しく表示されること", () => {
    render(
      <LotteryDetailView
        lottery={mockLottery}
        products={mockProducts}
        loading={false}
        error={null}
        getStatusBadge={getStatusBadge}
      />,
    );

    expect(screen.getByText(mockLottery.name)).toBeDefined();
    expect(screen.getByText(`ID: ${mockLottery.id}`)).toBeDefined();
    expect(screen.getByText("戻る")).toBeDefined();
    expect(screen.getByText("編集")).toBeDefined();

    expect(screen.getAllByText("基本情報").length).toBe(2);
    expect(screen.getByText("商品一覧")).toBeDefined();
    expect(screen.getByText("応募状況")).toBeDefined();

    expect(screen.getByText("ステータス")).toBeDefined();
    expect(screen.getByText("開始日時")).toBeDefined();
    expect(screen.getByText("終了日時")).toBeDefined();
    expect(screen.getByText("当選結果発表")).toBeDefined();
    expect(screen.getByText("支払期限")).toBeDefined();
    expect(screen.getByText("作成日時")).toBeDefined();

    expect(screen.getByText(formatDate(mockLottery.start_at))).toBeDefined();
    expect(screen.getByText(formatDate(mockLottery.end_at))).toBeDefined();
    expect(screen.getByText(formatDate(mockLottery.result_at))).toBeDefined();
    expect(screen.getByText(formatDate(mockLottery.payment_deadline_at))).toBeDefined();
    expect(screen.getByText(formatDate(mockLottery.created_at))).toBeDefined();
  });

  it("商品一覧タブが正しく機能すること", async () => {
    const user = userEvent.setup();

    render(
      <LotteryDetailView
        lottery={mockLottery}
        products={mockProducts}
        loading={false}
        error={null}
        getStatusBadge={getStatusBadge}
      />,
    );

    await user.click(screen.getByText("商品一覧"));

    expect(screen.getAllByText("商品一覧").length).toBe(2);
    expect(screen.getByText("商品ID")).toBeDefined();
    expect(screen.getByText("商品名")).toBeDefined();
    expect(screen.getByText("商品画像")).toBeDefined();
    expect(screen.getByText("価格")).toBeDefined();

    for (const product of mockProducts) {
      expect(screen.getByText(product.id)).toBeDefined();
      expect(screen.getByText(product.name)).toBeDefined();
      expect(screen.getByAltText(product.name)).toBeDefined();
      expect(screen.getByText(`¥${product.price?.toLocaleString()}`)).toBeDefined();
    }
  });

  it("応募状況タブが正しく機能すること", async () => {
    const user = userEvent.setup();

    render(
      <LotteryDetailView
        lottery={mockLottery}
        products={mockProducts}
        loading={false}
        error={null}
        getStatusBadge={getStatusBadge}
      />,
    );

    await user.click(screen.getByText("応募状況"));

    expect(screen.getByText("この機能は現在開発中です。")).toBeDefined();
    expect(screen.getByText("今後のアップデートでご利用いただけるようになります。")).toBeDefined();
  });

  it("商品がない場合のメッセージが表示されること", async () => {
    const user = userEvent.setup();

    render(
      <LotteryDetailView
        lottery={mockLottery}
        products={[]}
        loading={false}
        error={null}
        getStatusBadge={getStatusBadge}
      />,
    );

    await user.click(screen.getByText("商品一覧"));

    expect(screen.getByText("商品はありません。")).toBeDefined();
  });
});
