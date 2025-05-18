import AuctionDetailPage from "@/app/admin/auctions/[id]/page";
import { mockAuction, mockBids, mockProducts } from "@/mocks/data";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useParams: () => ({ id: "1" }),
}));

global.fetch = vi.fn();

describe("オークション詳細ページ", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    vi.mocked(fetch).mockReset();

    vi.mocked(fetch).mockImplementation((url) => {
      if (url === "/api/auction/1") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              data: {
                auction: mockAuction,
                product: mockProducts[0],
                bids: mockBids,
              },
            }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ページが正しくレンダリングされ、オークション情報が表示されること", async () => {
    render(<AuctionDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    expect(screen.getByText("レアアイテムオークション")).toBeDefined();

    expect(screen.getAllByText("実施中").length).toBe(2);

    expect(screen.getByRole("button", { name: "基本情報" })).toBeDefined();

    expect(screen.getByText("オークション方式")).toBeDefined();
    expect(screen.getByText("封印入札")).toBeDefined();
    expect(screen.getByText("入札取り消し")).toBeDefined();
    expect(screen.getByText("不許可")).toBeDefined();

    expect(screen.getByText("商品情報")).toBeDefined();
    expect(screen.getByText("ガチャポン - ドラゴンシリーズ")).toBeDefined();
    expect(screen.getByText("¥500")).toBeDefined();
  });

  it("入札状況タブに切り替えると入札リストが表示されること", async () => {
    render(<AuctionDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const bidsTab = screen.getByText("入札状況");
    bidsTab.click();

    await waitFor(() => {
      expect(screen.getByText("入札状況").closest("h2")).toBeDefined();
    });

    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("¥55,000")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("¥60,000")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("¥52,000")).toBeDefined();
  });

  it("オークションデータ取得に失敗した場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation((_url) => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "サーバーエラー" }),
      } as Response);
    });

    render(<AuctionDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    expect(screen.getByText("オークションデータの取得に失敗しました。")).toBeDefined();
  });

  it("認証エラーが発生した場合、ログインページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation((_url) => {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "認証エラー" }),
      } as Response);
    });

    render(<AuctionDetailPage />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("オークションが存在しない場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation((_url) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              auction: null,
              product: null,
              bids: [],
            },
          }),
      } as Response);
    });

    render(<AuctionDetailPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(screen.getByText("オークションが見つかりません")).toBeDefined();
  });

  it("入札データが存在しない場合、適切なメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation((_url) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            data: {
              auction: mockAuction,
              product: mockProducts[0],
              bids: [],
            },
          }),
      } as Response);
    });

    render(<AuctionDetailPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const bidsTab = screen.getByText("入札状況");
    bidsTab.click();

    await waitFor(() => {
      expect(screen.getByText("入札はありません。")).toBeDefined();
    });
  });
});
