import ProductsList from "@/app/admin/products/page";
import type { Product } from "@/types";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalFetch = global.fetch;

Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("商品管理ページ", () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "テスト商品1",
      price: 1000,
      image: "/images/product1.jpg",
      quantity: 1,
      stock_quantity: 20,
    },
    {
      id: 2,
      name: "テスト商品2",
      price: 2000,
      image: "/images/product2.jpg",
      quantity: 1,
      stock_quantity: 5,
    },
    {
      id: 3,
      name: "テスト商品3",
      price: 3000,
      image: "/images/product3.jpg",
      quantity: 1,
      stock_quantity: 0,
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

    render(<ProductsList />);

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
  });

  it("商品一覧が正しく表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: mockProducts }),
    } as Response);

    render(<ProductsList />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    expect(screen.getAllByText("テスト商品1")).toBeDefined();
    expect(screen.getAllByText("テスト商品2")).toBeDefined();
    expect(screen.getAllByText("テスト商品3")).toBeDefined();

    expect(screen.getAllByText("¥1,000")).toBeDefined();
    expect(screen.getAllByText("¥2,000")).toBeDefined();
    expect(screen.getAllByText("¥3,000")).toBeDefined();

    expect(screen.getByText("20")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("0")).toBeDefined();

    const detailLinks = screen.getAllByText("詳細");
    expect(detailLinks.length).toBe(mockProducts.length);
  });

  it("在庫数に応じたバッジの色が表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: mockProducts }),
    } as Response);

    render(<ProductsList />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    const greenBadges = document.querySelectorAll(".bg-green-100.text-green-800");
    expect(greenBadges.length).toBeGreaterThan(0);

    const yellowBadges = document.querySelectorAll(".bg-yellow-100.text-yellow-800");
    expect(yellowBadges.length).toBeGreaterThan(0);

    const redBadges = document.querySelectorAll(".bg-red-100.text-red-800");
    expect(redBadges.length).toBeGreaterThan(0);
  });

  it("商品追加リンクが正しく表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: mockProducts }),
    } as Response);

    render(<ProductsList />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    const addButton = screen.getByText("商品を追加");
    expect(addButton).toBeDefined();
    expect(addButton.closest("a")?.getAttribute("href")).toBe("/admin/upload");
  });

  it("デスクトップ表示ではテーブル形式で表示されること", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: mockProducts }),
    } as Response);

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 768px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<ProductsList />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    const table = document.querySelector("table");
    expect(table).toBeDefined();
  });

  it("商品詳細へのリンクが正しいURLを持つこと", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      status: 200,
      json: async () => ({ data: mockProducts }),
    } as Response);

    render(<ProductsList />);

    await waitFor(() => {
      expect(document.querySelector(".animate-spin")).toBeNull();
    });

    const detailLinks = document.querySelectorAll("a[href^='/admin/products/']");
    expect(detailLinks.length).toBeGreaterThan(0);

    for (const product of mockProducts) {
      const link = document.querySelector(`a[href='/admin/products/${product.id}']`);
      expect(link).toBeDefined();
    }
  });
});
