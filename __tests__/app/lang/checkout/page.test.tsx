import CheckoutPage from "@/app/[lang]/checkout/page";
import * as CartContext from "@/context/CartContext";
import { CartProvider } from "@/context/CartContext";
import type { Lang } from "@/types";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn(),
};

const mockParams = {
  lang: "ja",
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useParams: () => mockParams,
}));

vi.mock("@/app/[lang]/_components/AddressForm", () => ({
  default: ({ lang }: { lang: Lang }) => <div data-testid="address-form">AddressForm - {lang}</div>,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className: string }) => (
    <a data-testid="checkout-link" href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockCartContext = {
  cart: [
    { id: 1, name: "商品1", price: 1000, quantity: 2, image: "image1.jpg", stock_quantity: 10 },
    { id: 2, name: "商品2", price: 2000, quantity: 1, image: "image2.jpg", stock_quantity: 5 },
  ],
  totalPrice: 4000,
  clear_cart: vi.fn(),
  isCartOpen: false,
  add_to_cart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  toggleCart: vi.fn(),
  closeCart: vi.fn(),
};

const originalFetch = global.fetch;
const mockFetch = vi.fn();

describe("CheckoutPageコンポーネント", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
    mockRouter.push.mockClear();
    vi.spyOn(CartContext, "useCart").mockReturnValue(mockCartContext);
    global.fetch = mockFetch;
    user = userEvent.setup();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  const renderCheckoutPage = (paramOverrides = {}) => {
    const defaultParams = { lang: "ja" };
    Object.assign(mockParams, { ...defaultParams, ...paramOverrides });
    return render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>,
    );
  };

  it("チェックアウトページが正しくレンダリングされること", () => {
    renderCheckoutPage();

    expect(screen.getByText("決済確認")).toBeDefined();
    expect(screen.getByText("カート")).toBeDefined();
    expect(screen.getByText("支払い方法")).toBeDefined();
    expect(screen.getByText("お支払い前のお知らせ")).toBeDefined();

    expect(screen.getByText("商品1")).toBeDefined();
    expect(screen.getByText("商品2")).toBeDefined();
    expect(screen.getByText("¥4,000")).toBeDefined();

    expect(screen.getByText("クレジットカード")).toBeDefined();
    expect(screen.getByText("PayPay logo")).toBeDefined();

    expect(screen.getByTestId("address-form")).toBeDefined();

    const payButton = screen.getByRole("button", { name: "決済する" });
    expect(payButton.getAttribute("disabled")).toBe("");
  });

  it("言語が正しく適用されること", () => {
    renderCheckoutPage({ lang: "en" });

    expect(screen.getByText("Checkout Confirmation")).toBeDefined();
    expect(screen.getByText("Cart")).toBeDefined();
    expect(screen.getByText("Payment Method")).toBeDefined();
    expect(screen.getByText("Notice Before Payment")).toBeDefined();
    expect(screen.getByText("Pay Now")).toBeDefined();
  });

  it("支払い方法を選択できること", async () => {
    renderCheckoutPage();

    const paypayButton = screen.getByText("PayPay logo").closest("button");
    await user.click(paypayButton as HTMLElement);

    expect(paypayButton?.classList.contains("border-blue-500")).toBe(true);
    expect(paypayButton?.classList.contains("bg-blue-50")).toBe(true);

    const payButton = screen.getByRole("button", { name: "決済する" });
    expect(payButton.getAttribute("disabled")).toBeNull();
  });

  it("PayPay決済が正常に実行されること", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { url: "https://paypay.ne.jp/payment" } }),
    });

    renderCheckoutPage();

    const paypayButton = screen.getByText("PayPay logo").closest("button");
    await user.click(paypayButton as HTMLElement);

    const payButton = screen.getByRole("button", { name: "決済する" });
    await user.click(payButton);

    expect(screen.getByTestId("loading")).toBeDefined();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/paypay",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.any(String),
        }),
      );
    });

    expect(mockCartContext.clear_cart).toHaveBeenCalled();

    expect(mockRouter.push).toHaveBeenCalledWith("https://paypay.ne.jp/payment");
  });

  it("PayPay決済がエラーの場合、エラーメッセージが表示されること", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Error" }),
    });

    renderCheckoutPage();

    const paypayButton = screen.getByText("PayPay logo").closest("button");
    await user.click(paypayButton as HTMLElement);

    const payButton = screen.getByRole("button", { name: "決済する" });
    await user.click(payButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to process PayPay payment. Please try again.");
    });

    expect(screen.queryByText("処理中")).toBeNull();
    expect(screen.getByText("ショッピングを続ける")).toBeDefined();
  });

  it("ストアに戻るリンクが正しく動作すること", async () => {
    renderCheckoutPage();

    const checkoutLink = screen.getByTestId("checkout-link");
    expect(checkoutLink).toBeDefined();
    expect(checkoutLink.getAttribute("href")).toBe("/ja");
    expect(checkoutLink.textContent).toBe("ショッピングを続ける");
  });

  it("カートが空の場合、支払いボタンが無効になっていること", async () => {
    vi.spyOn(CartContext, "useCart").mockReturnValue({
      ...mockCartContext,
      cart: [],
      totalPrice: 0,
    });

    renderCheckoutPage();

    const paypayButton = screen.getByText("PayPay logo").closest("button");
    await user.click(paypayButton as HTMLElement);

    const payButton = screen.getByRole("button", { name: "決済する" });
    expect(payButton.getAttribute("disabled")).toBe("");
  });
});
