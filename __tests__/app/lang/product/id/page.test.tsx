import ProductDetailPage from "@/app/[lang]/product/[id]/page";
import { USER_TOKEN } from "@/const/cookies";
import { CartProvider } from "@/context/CartContext";
import * as db from "@/lib/db";
import * as jwt from "@/lib/jwt";
import { mockLotteryEntries, mockLotteryEvents, mockProducts } from "@/mocks/data";
import type { Lang, LotteryEntry, LotteryEvent, Product } from "@/types";
import { cleanup, render, screen } from "@testing-library/react";
import { revalidatePath } from "next/cache";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/jwt", () => ({
  verifyToken: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  findProductById: vi.fn(),
  getLotteryEventsByProductId: vi.fn(),
  getLotteryEntriesByUserIdAndProductId: vi.fn(),
  createLotteryEntry: vi.fn(),
}));

vi.mock("@/app/[lang]/product/[id]/_view/ProductDetailClient", () => ({
  default: ({
    product,
    lang,
    lotteryEvents,
    lotteryEntries,
    isLogin,
    createLotteryEntry,
  }: {
    product: Product | null;
    lang: Lang;
    lotteryEvents: LotteryEvent[];
    lotteryEntries: LotteryEntry[];
    isLogin: boolean;
    createLotteryEntry: (lotteryEventId: number, lotteryProductId: number) => Promise<void>;
  }) => (
    <div data-testid="product-detail-client">
      <div data-testid="product-name">{product?.name || "No product"}</div>
      <div data-testid="lang">{lang}</div>
      <div data-testid="lottery-events-count">{lotteryEvents.length}</div>
      <div data-testid="lottery-entries-count">{lotteryEntries.length}</div>
      <div data-testid="is-login">{isLogin ? "ログイン済み" : "未ログイン"}</div>
      <button type="button" data-testid="lottery-entry-button" onClick={() => createLotteryEntry(1, product?.id || 0)}>
        抽選に参加する
      </button>
    </div>
  ),
}));

const mockCookieStore = (token: string | null) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN && token ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("商品詳細ページ", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();

    vi.mocked(db.findProductById).mockResolvedValue(mockProducts[0]);
    vi.mocked(db.getLotteryEventsByProductId).mockResolvedValue(mockLotteryEvents);
    vi.mocked(db.getLotteryEntriesByUserIdAndProductId).mockResolvedValue([]);
    vi.mocked(db.createLotteryEntry).mockResolvedValue(mockLotteryEntries[1]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderProductDetailPage = async (lang: string, id: string, isLoggedIn: boolean) => {
    const token = isLoggedIn ? "valid-token" : null;
    mockCookieStore(token);

    if (isLoggedIn) {
      vi.mocked(jwt.verifyToken).mockReturnValue({ id: 1, type: "user" });
      vi.mocked(db.getLotteryEntriesByUserIdAndProductId).mockResolvedValue(mockLotteryEntries);
    } else {
      vi.mocked(jwt.verifyToken).mockReturnValue(null);
    }

    return render(<CartProvider>{await ProductDetailPage({ params: Promise.resolve({ lang, id }) })}</CartProvider>);
  };

  it("日本語の商品詳細ページが正しくレンダリングされること", async () => {
    await renderProductDetailPage("ja", "1", false);

    expect(screen.getByTestId("product-detail-client")).toBeDefined();
    expect(screen.getByTestId("product-name").textContent).toBe("ガチャポン - ドラゴンシリーズ");
    expect(screen.getByTestId("lang").textContent).toBe("ja");
    expect(screen.getByTestId("lottery-events-count").textContent).toBe("4");
    expect(screen.getByTestId("lottery-entries-count").textContent).toBe("0");
    expect(screen.getByTestId("is-login").textContent).toBe("未ログイン");

    expect(db.findProductById).toHaveBeenCalledWith(1);
    expect(db.getLotteryEventsByProductId).toHaveBeenCalledWith(1);
    expect(db.getLotteryEntriesByUserIdAndProductId).not.toHaveBeenCalled();
  });

  it("ログイン済みのユーザーに対して抽選エントリー情報が表示されること", async () => {
    await renderProductDetailPage("ja", "1", true);

    expect(screen.getByTestId("is-login").textContent).toBe("ログイン済み");
    expect(screen.getByTestId("lottery-entries-count").textContent).toBe("1");
    expect(db.getLotteryEntriesByUserIdAndProductId).toHaveBeenCalledWith(1, 1);
  });

  it("未ログイン状態で抽選エントリーを実行するとログインページにリダイレクトされること", async () => {
    await renderProductDetailPage("ja", "1", false);

    screen.getByTestId("lottery-entry-button").click();

    expect(redirect).toHaveBeenCalledWith("/ja/login");
    expect(db.createLotteryEntry).not.toHaveBeenCalled();
  });

  it("ログイン済み状態で抽選エントリーを実行すると正常に処理されること", async () => {
    await renderProductDetailPage("ja", "1", true);

    await screen.getByTestId("lottery-entry-button").click();

    expect(db.createLotteryEntry).toHaveBeenCalledWith(1, 1, 1);
    expect(redirect).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/ja/product/1");
  });
});
