import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import LoginPage from "@/app/[lang]/login/page";
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

describe("LoginPage", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginPage = async (lang: string, token: string) => {
    mockCookieStore(token);
    return render(await LoginPage({ params: Promise.resolve({ lang }) }));
  };

  it("日本語のログインページが正しくレンダリングされること", async () => {
    await renderLoginPage("ja", "");

    const googleButton = screen.getByRole("button", { name: "Googleでログイン" });
    expect(googleButton).toBeDefined();

    const googleAuthLink = screen.getByRole("link", { name: "Googleでログイン" });
    expect(googleAuthLink.getAttribute("href")).toBe("/api/auth/google");

    const signupLink = screen.getByRole("link", { name: "新規登録" });
    expect(signupLink.getAttribute("href")).toBe("/ja/signup");
  });

  it("英語のログインページが正しくレンダリングされること", async () => {
    await renderLoginPage("en", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton.textContent).toContain("Sign in with Google");

    const signupText = screen.getByText(/Don't have an account/i);
    expect(signupText).toBeDefined();
  });

  it("中国語のログインページが正しくレンダリングされること", async () => {
    await renderLoginPage("zh", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton).toBeDefined();
  });

  it("サポートされていない言語コードの場合、デフォルトで日本語を使用すること", async () => {
    await renderLoginPage("fr", "");

    const googleButton = screen.getByRole("button");
    expect(googleButton.textContent).toContain("Googleでログイン");
  });

  it("すでにログインしている場合、トップページにリダイレクトされること", async () => {
    await renderLoginPage("ja", generateToken({ id: 1, type: "user" }));

    const { redirect } = await import("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/ja");
  });
});
