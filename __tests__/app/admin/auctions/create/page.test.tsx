import CreateAuctionPage from "@/app/admin/auctions/create/page";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

global.fetch = vi.fn();

describe("オークション作成ページ", () => {
  const mockProducts = [
    { id: 1, name: "商品1", price: 1000, image: "image1.jpg", description: "説明1", stock: 10 },
    { id: 2, name: "商品2", price: 2000, image: "image2.jpg", description: "説明2", stock: 5 },
  ];

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    vi.mocked(fetch).mockReset();

    vi.mocked(fetch).mockImplementation((url) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
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

  it("フォームが正しくレンダリングされること", async () => {
    render(<CreateAuctionPage />);

    expect(screen.getByLabelText("オークション名 *")).toBeDefined();
    expect(screen.getByLabelText("説明")).toBeDefined();
    expect(screen.getByLabelText("開始日時 *")).toBeDefined();
    expect(screen.getByLabelText("終了日時 *")).toBeDefined();
    expect(screen.getByLabelText("支払期限 *")).toBeDefined();
    expect(screen.getByLabelText("ステータス *")).toBeDefined();

    expect(screen.getByLabelText("封印入札")).toBeDefined();
    expect(screen.getByLabelText("入札取り消し許可")).toBeDefined();
    expect(screen.getByLabelText("支払い情報必須")).toBeDefined();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    expect(screen.getByLabelText("商品 *")).toBeDefined();

    const saveButton = screen.getByText("保存する");
    expect(saveButton).toBeDefined();
  });

  it("フォーム入力の検証が正しく機能すること", async () => {
    render(<CreateAuctionPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const saveButton = screen.getByText("保存する");

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "テストオークション" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("商品を選択してください")).toBeDefined();
    });

    const productSelect = screen.getByLabelText("商品 *");
    fireEvent.change(productSelect, { target: { value: "1" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auction", expect.any(Object));
    });
  });

  it("日付の検証が正しく機能すること", async () => {
    render(<CreateAuctionPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "テストオークション" } });

    const productSelect = screen.getByLabelText("商品 *");
    fireEvent.change(productSelect, { target: { value: "1" } });

    const startAtInput = screen.getByLabelText("開始日時 *");
    const endAtInput = screen.getByLabelText("終了日時 *");

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 20);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() + 10);

    fireEvent.change(startAtInput, {
      target: {
        value: futureDate.toISOString().slice(0, 16),
      },
    });

    fireEvent.change(endAtInput, {
      target: {
        value: pastDate.toISOString().slice(0, 16),
      },
    });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("開始日時は終了日時より前である必要があります")).toBeDefined();
    });
  });

  it("オークション作成が成功した場合、オークション一覧ページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/auction") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateAuctionPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "テストオークション" } });

    const productSelect = screen.getByLabelText("商品 *");
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("オークションが正常に作成されました。オークション一覧ページにリダイレクトします..."),
      ).toBeDefined();
    });

    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/admin/auctions");
      },
      { timeout: 2000 },
    );
  });

  it("APIエラーが発生した場合、エラーメッセージが表示されること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/auction") {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateAuctionPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "テストオークション" } });

    const productSelect = screen.getByLabelText("商品 *");
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("オークションの作成に失敗しました")).toBeDefined();
    });
  });

  it("認証エラーが発生した場合、ログインページにリダイレクトされること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/auction") {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({}),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateAuctionPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "テストオークション" } });

    const productSelect = screen.getByLabelText("商品 *");
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("フォーム送信中はボタンが無効化されること", async () => {
    vi.mocked(fetch).mockImplementation((url, options) => {
      if (url === "/api/product") {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockProducts }),
        } as Response);
      }
      if (url === "/api/auction") {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({}),
            } as Response);
          }, 100);
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });

    render(<CreateAuctionPage />);

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeDefined();
    });

    const nameInput = screen.getByLabelText("オークション名 *");
    fireEvent.change(nameInput, { target: { value: "テストオークション" } });

    const productSelect = screen.getByLabelText("商品 *");
    fireEvent.change(productSelect, { target: { value: "1" } });

    const saveButton = screen.getByText("保存する");
    fireEvent.click(saveButton);

    expect(screen.getByTestId("loading")).toBeDefined();
  });
});
