import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProductsPage from "@/app/[lang]/page";
import * as db from "@/lib/db";
import type { Lang, Product } from "@/types";
import { CartProvider } from "@/context/CartContext";

vi.mock("@/lib/db", () => ({
  getProducts: vi.fn(),
}));

vi.mock("@/app/[lang]/_components/Products", () => ({
  default: ({ products, lang }: { products: Product[]; lang: Lang }) => (
    <div data-testid="products-component">
      <div data-testid="products-count">{products.length}</div>
      <div data-testid="lang">{lang}</div>
    </div>
  ),
}));

const mockProducts: Product[] = [
  { id: 1, name: "Product 1", price: 1000, image: "image1.jpg", quantity: 0, stock_quantity: 10 },
  { id: 2, name: "Product 2", price: 2000, image: "image2.jpg", quantity: 0, stock_quantity: 5 },
];

describe("ProductsPage", () => {
  vi.mocked(db.getProducts).mockResolvedValue(mockProducts);

  beforeEach(() => {
    cleanup();
  });

  const renderProductsPageWithLang = async (lang: string, expectedLang?: Lang) => {
    render(<CartProvider>{await ProductsPage({ params: Promise.resolve({ lang }) })}</CartProvider>);

    expect(screen.getByTestId("products-component")).toBeDefined();
    expect(screen.getByTestId("products-count").textContent).toBe("2");
    expect(screen.getByTestId("lang").textContent).toBe(expectedLang || lang);
  };

  it("デフォルトで日本語のProductsコンポーネントをレンダリングすること", async () => {
    await renderProductsPageWithLang("ja");
    expect(db.getProducts).toHaveBeenCalledTimes(1);
  });

  it("英語のProductsコンポーネントをレンダリングすること", async () => {
    await renderProductsPageWithLang("en");
  });

  it("中国語のProductsコンポーネントをレンダリングすること", async () => {
    await renderProductsPageWithLang("zh");
  });

  it("サポートされていない言語コードの場合、デフォルトで日本語を使用すること", async () => {
    await renderProductsPageWithLang("fr", "ja");
  });
});
