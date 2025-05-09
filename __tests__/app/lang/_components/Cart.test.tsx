import Cart from "@/app/[lang]/_components/Cart";
import type { Product } from "@/types";
import type { Lang } from "@/types";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("Cartコンポーネント", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockProducts: Product[] = [
    { id: 1, name: "商品1", price: 1000, image: "image1.jpg", quantity: 2, stock_quantity: 10 },
    { id: 2, name: "商品2", price: 2000, image: "image2.jpg", quantity: 1, stock_quantity: 5 },
  ];

  const mockHandlers = {
    onClose: vi.fn(),
    onUpdateQuantity: vi.fn(),
    onRemoveItem: vi.fn(),
    onClearCart: vi.fn(),
  };

  const renderCart = (
    props: {
      isOpen?: boolean;
      cart?: Product[];
      totalPrice?: number;
      lang?: Lang;
    } = {},
  ) => {
    const defaultProps = {
      isOpen: true,
      cart: mockProducts,
      totalPrice: 4000,
      lang: "ja" as Lang,
      ...mockHandlers,
    };

    return render(<Cart {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    user = userEvent.setup();

    for (const key of Object.keys(mockHandlers)) {
      mockHandlers[key as keyof typeof mockHandlers].mockClear();
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("カートが閉じている場合、何も表示されないこと", () => {
    renderCart({ isOpen: false });
    expect(screen.queryByText(/カート/)).toBeNull();
  });

  it("カートが空の場合、「カートは空です」と表示されること", () => {
    renderCart({ cart: [], totalPrice: 0 });
    expect(screen.getByText("カートは空です")).toBeDefined();
  });

  it("カートアイテムが正しく表示されること", () => {
    renderCart();

    expect(screen.getByText("商品1")).toBeDefined();
    expect(screen.getByText("¥1,000")).toBeDefined();
    expect(screen.getByText("商品2")).toBeDefined();
    expect(screen.getByText("¥2,000")).toBeDefined();

    const quantityElements = screen.getAllByText(/\d+/).filter((el) => el.className.includes("border-t"));
    expect(quantityElements[0].textContent).toBe("2");
    expect(quantityElements[1].textContent).toBe("1");

    expect(screen.getByText("¥4,000")).toBeDefined();
  });

  it("閉じるボタンをクリックすると、onClose関数が呼ばれること", async () => {
    renderCart();

    const closeButton = screen.getByText("✕");
    await user.click(closeButton);

    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it("数量増加ボタンをクリックすると、onUpdateQuantity関数が呼ばれること", async () => {
    renderCart();

    const incrementButtons = screen.getAllByText("+");
    await user.click(incrementButtons[0]);

    expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it("数量減少ボタンをクリックすると、onUpdateQuantity関数が呼ばれること", async () => {
    renderCart();

    const decrementButtons = screen.getAllByText("-");
    await user.click(decrementButtons[0]);

    expect(mockHandlers.onUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it("在庫上限に達した場合、数量増加ボタンが無効化されること", () => {
    const updatedProducts = [{ ...mockProducts[0], quantity: 10, stock_quantity: 10 }, mockProducts[1]];

    renderCart({ cart: updatedProducts });

    const incrementButtons = screen.getAllByText("+");
    expect(incrementButtons[0].getAttribute("disabled")).toBe("");
    expect(incrementButtons[0].classList.contains("bg-gray-200")).toBe(true);
    expect(incrementButtons[0].classList.contains("cursor-not-allowed")).toBe(true);

    expect(incrementButtons[1].getAttribute("disabled")).toBe(null);
  });

  it("削除ボタンをクリックすると、onRemoveItem関数が呼ばれること", async () => {
    renderCart();

    const removeButtons = screen.getAllByText("削除");
    await user.click(removeButtons[0]);

    expect(mockHandlers.onRemoveItem).toHaveBeenCalledWith(1);
  });

  it("カートをクリアボタンをクリックすると、onClearCart関数が呼ばれること", async () => {
    renderCart();

    const clearButton = screen.getByText("カートを空にする");
    await user.click(clearButton);

    expect(mockHandlers.onClearCart).toHaveBeenCalledTimes(1);
  });

  it("チェックアウトボタンをクリックすると、カートが閉じられ、チェックアウトページに遷移すること", async () => {
    renderCart();

    const checkoutButton = screen.getByText("購入手続きへ");
    await user.click(checkoutButton);

    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/ja/checkout");
  });

  it("英語表示の場合、テキストが英語で表示されること", () => {
    renderCart({ lang: "en" });

    expect(screen.getByText("Cart")).toBeDefined();
    expect(screen.getByText("Proceed to Checkout")).toBeDefined();
    expect(screen.getByText("Clear Cart")).toBeDefined();

    const removeButtons = screen.getAllByText("Remove");
    expect(removeButtons.length).toBe(2);
  });
});
