import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Products from "@/app/[lang]/_components/Products";
import type { Product, Lang } from "@/types";

vi.mock("@/app/[lang]/_components/ProductCard", () => ({
  default: ({ product, lang }: { product: Product; lang: Lang }) => (
    <div data-testid={`product-card-${product.id}`}>
      <div data-testid="product-name">{product.name}</div>
      <div data-testid="product-price">{product.price}</div>
      <div data-testid="product-lang">{lang}</div>
    </div>
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className: string }) => (
    <a data-testid="checkout-link" href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockProducts: Product[] = [
  { id: 1, name: "商品1", price: 1000, image: "image1.jpg", quantity: 0, stock_quantity: 10 },
  { id: 2, name: "商品2", price: 2000, image: "image2.jpg", quantity: 0, stock_quantity: 5 },
];

describe.skip("Productsコンポーネント", () => {
  beforeEach(() => {
    cleanup();
  });

  it("すべての商品をProductCardコンポーネントでレンダリングすること", () => {
    render(<Products products={mockProducts} lang="ja" />);

    expect(screen.getByTestId("product-card-1")).toBeDefined();
    expect(screen.getByTestId("product-card-2")).toBeDefined();

    const productLangElements = screen.getAllByTestId("product-lang");
    for (const element of productLangElements) {
      expect(element.textContent).toBe("ja");
    }
  });

  it("購入画面へのリンクが正しくレンダリングされること", () => {
    render(<Products products={mockProducts} lang="ja" />);

    const checkoutLink = screen.getByTestId("checkout-link");
    expect(checkoutLink).toBeDefined();
    expect(checkoutLink.getAttribute("href")).toBe("/ja/checkout");
    expect(checkoutLink.textContent).toBe("購入画面へ");
  });

  it("他の言語でリンクのURLが正しく設定されること", () => {
    render(<Products products={mockProducts} lang="en" />);

    const checkoutLink = screen.getByTestId("checkout-link");
    expect(checkoutLink.getAttribute("href")).toBe("/en/checkout");
  });

  it("商品がない場合でも正しくレンダリングされること", () => {
    render(<Products products={[]} lang="ja" />);

    expect(screen.queryAllByTestId(/product-card-/).length).toBe(0);
    expect(screen.getByTestId("checkout-link")).toBeDefined();
  });
});
