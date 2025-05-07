import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SignupPage from "@/app/[lang]/signup/page";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { USER_TOKEN } from "@/const/cookies";
import { generateToken } from "@/lib/jwt";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const mockCookieStore = (token: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("SignupPage", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSignupPage = async (lang: string, token: string) => {
    mockCookieStore(token);
    return render(await SignupPage({ params: Promise.resolve({ lang }) }));
  };

  it("日本語のサインアップページが正しくレンダリングされること", async () => {
    await renderSignupPage("ja", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeDefined();

    const googleAuthLink = screen.getByRole("link", { name: "Googleで登録" });
    expect(googleAuthLink.getAttribute("href")).toBe("/api/auth/google");

    const loginLink = screen.getByRole("link", { name: "新規登録" });
    expect(loginLink.getAttribute("href")).toBe("/ja/login");
  });

  it("英語のサインアップページが正しくレンダリングされること", async () => {
    await renderSignupPage("en", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeDefined();

    const accountText = screen.getByText(/Don't have an account/i);
    expect(accountText).toBeDefined();
  });

  it("中国語のサインアップページが正しくレンダリングされること", async () => {
    await renderSignupPage("zh", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeDefined();
  });

  it("サポートされていない言語コードの場合、デフォルトで日本語を使用すること", async () => {
    await renderSignupPage("fr", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeDefined();
  });

  it("すでにログインしている場合、トップページにリダイレクトされること", async () => {
    await renderSignupPage("ja", generateToken({ id: 1, type: "user" }));

    const { redirect } = await import("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/ja");
  });

  it("Googleアイコンが正しく表示されること", async () => {
    await renderSignupPage("ja", "");

    const googleIcon = screen.getByTitle("Google Icon");
    expect(googleIcon).toBeDefined();
  });
});
