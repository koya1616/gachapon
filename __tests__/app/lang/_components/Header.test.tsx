import Header from "@/app/[lang]/_components/Header";
import * as CartContext from "@/context/CartContext";
import type { Lang } from "@/types";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

const mockRouter = {
  push: vi.fn(),
};

let mockPathname = "/ja";
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

const BUTTON_INDEX = {
  LOGO: 0,
  LANGUAGE_DROPDOWN: 1,
  ACCOUNT: 2,
  CART: 3,
} as const;

const renderHeader = (language: Lang = "ja") => {
  return render(<Header lang={language} />);
};

const clickButton = async (buttonName: keyof typeof BUTTON_INDEX) => {
  const user = userEvent.setup();
  await user.click(screen.getAllByRole("button")[BUTTON_INDEX[buttonName]]);
  return user;
};

describe("Headerコンポーネント", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockPathname = "/ja";
    vi.spyOn(CartContext, "useCart").mockReturnValue(mockCartContext);
  });

  it("ロゴとナビゲーションアイテムが正しく表示されること", () => {
    renderHeader();

    expect(screen.getByText("gasyaponpon")).toBeDefined();
    expect(screen.getByAltText("Logo")).toBeDefined();
    expect(screen.getAllByRole("button")[BUTTON_INDEX.ACCOUNT]).toBeDefined();
    expect(screen.getAllByRole("button")[BUTTON_INDEX.CART]).toBeDefined();
  });

  it("ロゴをクリックすると、ホームページへのナビゲーションが実行されること", async () => {
    renderHeader();
    await clickButton("LOGO");

    expect(mockRouter.push).toHaveBeenCalledWith("/ja");
  });

  it("アカウントアイコンをクリックすると、アカウントページへのナビゲーションが実行されること", async () => {
    renderHeader();
    await clickButton("ACCOUNT");

    expect(mockRouter.push).toHaveBeenCalledWith("/ja/account");
  });

  it("カートアイコンをクリックすると、カートの開閉が切り替わること", async () => {
    renderHeader();
    await clickButton("CART");

    expect(mockCartContext.toggleCart).toHaveBeenCalledTimes(1);
  });

  it("ログイン、サインアップ、アカウントページではカートアイコンが表示されないこと", () => {
    mockPathname = "/ja/login";
    renderHeader();

    expect(screen.getAllByRole("button")[BUTTON_INDEX.CART]).toBeUndefined();
  });

  it("カート内にアイテムがある場合、カウントバッジが表示されること", () => {
    vi.spyOn(CartContext, "useCart").mockReturnValue({
      ...mockCartContext,
      cart: [
        { id: 1, name: "商品1", price: 1000, quantity: 2, image: "image1.jpg", stock_quantity: 10 },
        { id: 2, name: "商品2", price: 2000, quantity: 1, image: "image2.jpg", stock_quantity: 5 },
      ],
    });

    renderHeader();

    const badge = screen.getByText("3");
    expect(badge).toBeDefined();
    expect(badge.classList.contains("rounded")).toBe(true);
    expect(badge.classList.contains("bg-blue-600")).toBe(true);
  });

  it("異なる言語でレンダリングされた場合も適切に動作すること", async () => {
    renderHeader("en");
    const user = userEvent.setup();

    const logoButton = screen.getByText("gasyaponpon").closest("button") as HTMLButtonElement;
    await user.click(logoButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/en");
  });
});
