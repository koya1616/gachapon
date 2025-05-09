import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutButton from "@/app/[lang]/account/_components/LogoutButton";
import type { Lang } from "@/types";
import { LANGS } from "@/const/language";

const originalFetch = global.fetch;
const mockFetch = vi.fn();

Object.defineProperty(window, "location", {
  value: { href: "" },
  writable: true,
});

describe("LogoutButtonコンポーネント", () => {
  beforeEach(() => {
    cleanup();
    global.fetch = mockFetch;
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        finally: (cb: () => void) => {
          cb();
          return Promise.resolve({});
        },
      }),
    );
    window.location.href = "";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const renderLogoutButton = (lang: Lang = "ja") => {
    return render(<LogoutButton lang={lang} />);
  };

  const languages: { lang: Lang; description: string }[] = LANGS.map((lang) => {
    const descriptions: Record<Lang, string> = { ja: "日本語", en: "英語", zh: "中国語" };
    return { lang: lang as Lang, description: descriptions[lang as Lang] };
  });

  for (const { lang, description } of languages) {
    it(`${description}環境でボタンが正しくレンダリングされること`, () => {
      renderLogoutButton(lang);
      expect(screen.getByRole("button")).toBeDefined();
    });
  }

  it("ボタンをクリックするとログアウトAPIが呼ばれること", async () => {
    const user = userEvent.setup();
    renderLogoutButton();

    await user.click(screen.getByRole("button"));

    expect(mockFetch).toHaveBeenCalledWith("/api/auth/logout");
  });

  it("ボタンをクリック中はローディング状態になること", async () => {
    const user = userEvent.setup();
    renderLogoutButton();

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("loading")).toBeDefined();
    expect(mockFetch).toHaveBeenCalledWith("/api/auth/logout");
  });

  for (const { lang, description } of languages) {
    it(`${description}環境でログアウト後に正しいURLにリダイレクトされること`, async () => {
      const user = userEvent.setup();
      renderLogoutButton(lang);

      await user.click(screen.getByRole("button"));
      expect(window.location.href).toBe(`/${lang}/login`);
    });
  }
});
