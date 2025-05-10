import ProductCard from "@/app/[lang]/_components/ProductCard";
import * as CartContext from "@/context/CartContext";
import type { Product } from "@/types";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// モックのカート状態
const mockCartContext = {
  cart: [],
  add_to_cart: vi.fn(),
  isCartOpen: false,
  totalPrice: 0,
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clear_cart: vi.fn(),
  toggleCart: vi.fn(),
  closeCart: vi.fn(),
};

describe("ProductCardコンポーネント", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.spyOn(CartContext, "useCart").mockReturnValue(mockCartContext);
  });

  const mockProduct: Product = {
    id: 1,
    name: "テスト商品",
    price: 1000,
    image: "test-image.jpg",
    quantity: 0,
    stock_quantity: 10,
  };

  it("商品情報が正しく表示されること", () => {
    render(<ProductCard product={mockProduct} lang="ja" />);

    expect(screen.getByText("テスト商品")).toBeDefined();
    expect(screen.getByText("¥ 1,000")).toBeDefined();
    expect(screen.getByRole("button").textContent).toBe("カートに追加");
    expect(screen.getByRole("img").getAttribute("src")).toBe("test-image.jpg");
    expect(screen.getByRole("img").getAttribute("alt")).toBe("テスト商品");
  });

  it("英語表示の場合、ボタンテキストが英語で表示されること", () => {
    render(<ProductCard product={mockProduct} lang="en" />);

    expect(screen.getByRole("button").textContent).toBe("Add to Cart");
  });

  it("カートに追加ボタンをクリックすると、add_to_cart関数が呼ばれること", async () => {
    const user = userEvent.setup();

    render(<ProductCard product={mockProduct} lang="ja" />);

    await user.click(screen.getByRole("button"));

    expect(mockCartContext.add_to_cart).toHaveBeenCalledWith(mockProduct);
    expect(mockCartContext.add_to_cart).toHaveBeenCalledTimes(1);
  });

  it("カート内の商品が在庫数に達した場合、ボタンが無効化されること", () => {
    vi.spyOn(CartContext, "useCart").mockReturnValue({
      ...mockCartContext,
      cart: [{ ...mockProduct, quantity: 10 }],
    });

    render(<ProductCard product={mockProduct} lang="ja" />);

    const button = screen.getByRole("button");
    expect(button.getAttribute("disabled")).toBe("");
    expect(button.textContent).toBe("在庫切れ");
    expect(button.classList.contains("opacity-50")).toBe(true);
    expect(button.classList.contains("cursor-not-allowed")).toBe(true);
  });

  it("カート内の商品が在庫数未満の場合、ボタンが有効であること", () => {
    vi.spyOn(CartContext, "useCart").mockReturnValue({
      ...mockCartContext,
      cart: [{ ...mockProduct, quantity: 5 }],
    });

    render(<ProductCard product={mockProduct} lang="ja" />);

    const button = screen.getByRole("button");
    expect(button.getAttribute("disabled")).toBe(null);
    expect(button.textContent).toBe("カートに追加");
    expect(button.classList.contains("cursor-pointer")).toBe(true);
  });
});
