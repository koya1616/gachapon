import AuctionsPage from "@/app/admin/auctions/page";
import { mockAuctionData } from "@/mocks/data";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

global.fetch = vi.fn();

Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("オークション一覧ページ", () => {
  const setupComponent = () => {
    render(<AuctionsPage />);

    expect(screen.getByTestId("loading")).toBeDefined();
  };

  const setupSuccessMocks = () => {
    vi.mocked(fetch).mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: mockAuctionData }),
      } as Response);
    });
  };

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    window.location.href = "";
    vi.mocked(fetch).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("オークション一覧が正しく表示されること", async () => {
    setupSuccessMocks();
    setupComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/api/auction");

      expect(screen.getByText("オークション一覧")).toBeDefined();
      expect(screen.getByText("新規作成")).toBeDefined();
      expect(screen.getAllByRole("row").length).toBe(mockAuctionData.length + 1);

      expect(screen.getByText(mockAuctionData[0].name)).toBeDefined();
      expect(screen.getByText("開催中")).toBeDefined();

      expect(screen.getByText(mockAuctionData[1].name)).toBeDefined();
      expect(screen.getByText("下書き")).toBeDefined();
    });
  });

  it("認証エラーが発生した場合、ログインページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation(() => {
      return Promise.resolve({ status: 401 } as Response);
    });

    render(<AuctionsPage />);

    await waitFor(() => {
      expect(window.location.href).toBe("/admin/login");
    });
  });

  it("APIからデータの取得に失敗した場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation(() => {
      return Promise.reject(new Error("API error"));
    });

    render(<AuctionsPage />);

    await waitFor(() => {
      expect(screen.getByText("オークションの取得に失敗しました。")).toBeDefined();
    });
  });

  it("オークションデータが空の場合、メッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [] }),
      } as Response);
    });

    render(<AuctionsPage />);

    await waitFor(() => {
      expect(screen.getByText("オークションがありません")).toBeDefined();
    });
  });

  it("各ステータスに対応するバッジが正しく表示されること", async () => {
    const testData = [
      { ...mockAuctionData[0], id: 1, status: 0 },
      { ...mockAuctionData[0], id: 2, status: 1 },
      { ...mockAuctionData[0], id: 3, status: 2 },
      { ...mockAuctionData[0], id: 4, status: 3 },
      { ...mockAuctionData[0], id: 5, status: 999 },
    ];

    vi.mocked(fetch).mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: testData }),
      } as Response);
    });

    render(<AuctionsPage />);

    await waitFor(() => {
      expect(screen.getByText("下書き")).toBeDefined();
      expect(screen.getByText("開催中")).toBeDefined();
      expect(screen.getByText("終了")).toBeDefined();
      expect(screen.getByText("キャンセル")).toBeDefined();
      expect(screen.getByText("不明")).toBeDefined();
    });
  });
});
