import ProductDetail from "@/app/admin/products/[id]/page";
import { mockLotteryEvents } from "@/mocks/data";
import type { Product } from "@/types";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useParams: vi.fn().mockReturnValue({ id: "1" }),
}));

const originalFetch = global.fetch;

Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("商品詳細ページ", () => {
  const mockProduct: Product = {
    id: 1,
    name: "テスト商品",
    price: 1000,
    image: "/images/test-product.jpg",
    quantity: 1,
    stock_quantity: 20,
  };

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

    render(<ProductDetail />);

    expect(screen.getByText("← 商品一覧に戻る")).toBeDefined();
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
  });

  it("APIエラー時にエラーメッセージが表示されること", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("API Error"));

    render(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText("商品詳細の取得に失敗しました。")).toBeDefined();
    });
  });

  it("商品詳細が正しく表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    expect(screen.getByText("テスト商品")).toBeDefined();
    expect(screen.getByText("¥1,000")).toBeDefined();
    expect(screen.getByText("20")).toBeDefined();
    expect(screen.getByText("商品ID")).toBeDefined();
    expect(screen.getAllByText("1").length).toBe(2);
    expect(screen.getByText("画像URL")).toBeDefined();
    expect(screen.getByText("/images/test-product.jpg")).toBeDefined();
    expect(screen.getByRole("img")).toBeDefined();
    expect(screen.getByRole("img").getAttribute("src")).toBe("/images/test-product.jpg");
    expect(screen.getByRole("img").getAttribute("alt")).toBe("テスト商品");
    expect(screen.getByRole("button", { name: "編集" })).toBeDefined();
  });

  it("編集ボタンをクリックすると編集フォームが表示されること", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    const editButton = screen.getByRole("button", { name: "編集" });
    await user.click(editButton);

    expect(screen.getByText("商品情報を編集")).toBeDefined();
    expect(screen.getByLabelText("商品名")).toBeDefined();
    expect(screen.getByLabelText("価格 (円)")).toBeDefined();
    expect(screen.getByLabelText("在庫数")).toBeDefined();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeDefined();
    expect(screen.getByRole("button", { name: "更新する" })).toBeDefined();

    expect(screen.getByLabelText("商品名").getAttribute("value")).toBe("テスト商品");
    expect(screen.getByLabelText("価格 (円)").getAttribute("value")).toBe("1000");
    expect(screen.getByLabelText("在庫数").getAttribute("value")).toBe("20");
  });

  it("編集フォームでキャンセルボタンをクリックすると詳細表示に戻ること", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "編集" }));
    expect(screen.getByText("商品情報を編集")).toBeDefined();

    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(screen.queryByText("商品情報を編集")).toBeNull();
    expect(screen.getByText("テスト商品")).toBeDefined();
    expect(screen.getByRole("button", { name: "編集" })).toBeDefined();
  });

  it("編集フォームで値を変更して送信すると更新APIが呼ばれること", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    const updatedProduct = {
      ...mockProduct,
      name: "更新済み商品",
      price: 1500,
      stock_quantity: 25,
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      status: 200,
      json: async () => ({ data: updatedProduct }),
    } as Response);

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "編集" }));

    const nameInput = screen.getByLabelText("商品名");
    const priceInput = screen.getByLabelText("価格 (円)");
    const stockInput = screen.getByLabelText("在庫数");

    await user.clear(nameInput);
    await user.type(nameInput, "更新済み商品");
    await user.clear(priceInput);
    await user.type(priceInput, "1500");
    await user.clear(stockInput);
    await user.type(stockInput, "25");

    await user.click(screen.getByRole("button", { name: "更新する" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenLastCalledWith("/api/product/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "更新済み商品",
          price: 1500,
          stock_quantity: 25,
        }),
      });
    });

    expect(screen.getByText("商品情報が更新されました！")).toBeDefined();

    expect(screen.getByText("更新済み商品")).toBeDefined();
    expect(screen.getByText("¥1,500")).toBeDefined();
    expect(screen.getByText("25")).toBeDefined();
  });

  it("API更新時にエラーが発生した場合、エラーメッセージが表示されること", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Update failed"));

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "編集" }));

    await user.click(screen.getByRole("button", { name: "更新する" }));

    await waitFor(() => {
      expect(screen.getByText("商品情報の更新に失敗しました。")).toBeDefined();
    });
  });

  it("更新中はボタンが無効化され、テキストが変わること", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    vi.mocked(global.fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                status: 200,
                json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
              } as Response),
            100,
          ),
        ),
    );

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "編集" }));

    await user.click(screen.getByRole("button", { name: "更新する" }));

    expect(screen.getByTestId("loading")).toBeDefined();
  });

  it("認証エラー(401)の場合、ログインページにリダイレクトされること", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ data: { product: mockProduct, lotteryEvents: mockLotteryEvents } }),
    } as Response);

    vi.mocked(global.fetch).mockResolvedValueOnce({
      status: 401,
      json: async () => ({}),
    } as Response);

    render(<ProductDetail />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "編集" }));

    await user.click(screen.getByRole("button", { name: "更新する" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/admin/login");
    });
  });
});
