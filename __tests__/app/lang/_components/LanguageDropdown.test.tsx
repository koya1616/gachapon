import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageDropdown from "@/app/[lang]/_components/LanguageDropdown";
import type { Lang } from "@/types";
import { LANGS } from "@/const/language";

const mockRouter = {
  push: vi.fn(),
};

let mockPathname = "/ja";
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

const renderLanguageDropdown = (language: Lang = "ja") => {
  return render(<LanguageDropdown lang={language} />);
};

describe("LanguageDropdownコンポーネント", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockPathname = "/ja";
    mockRouter.push.mockClear();
  });

  it("現在の言語が正しく表示されること", () => {
    renderLanguageDropdown("en");
    expect(screen.getByText("EN")).toBeDefined();
  });

  it("ドロップダウンを開くとすべての言語オプションが表示されること", async () => {
    const user = userEvent.setup();
    renderLanguageDropdown("ja");

    await user.click(screen.getByText("JA"));
    for (const lang of LANGS) {
      expect(screen.getAllByText(lang.toUpperCase()).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("ドロップダウンアイコンが正しく回転すること", async () => {
    const user = userEvent.setup();
    renderLanguageDropdown();

    const svgElement = document.querySelector("svg");
    expect(svgElement?.getAttribute("class")).not.toContain("rotate-180");

    await user.click(screen.getByText("JA"));
    expect(svgElement?.getAttribute("class")).toContain("rotate-180");

    await user.click(screen.getAllByText("JA")[1]);
    expect(svgElement?.getAttribute("class")).not.toContain("rotate-180");
  });

  it("異なる言語を選択すると、URLが適切に更新されること", async () => {
    const user = userEvent.setup();
    renderLanguageDropdown("ja");

    await user.click(screen.getByText("JA"));

    await user.click(screen.getByText("EN"));
    expect(mockRouter.push).toHaveBeenCalledWith("/en");
  });

  it("現在と同じ言語を選択した場合、URLは変更されないこと", async () => {
    const user = userEvent.setup();
    renderLanguageDropdown("ja");

    await user.click(screen.getByText("JA"));

    await user.click(screen.getAllByText("JA")[1]);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("深いパスの場合でも言語セグメントのみが変更されること", async () => {
    mockPathname = "/ja/account/settings";
    const user = userEvent.setup();
    renderLanguageDropdown("ja");

    await user.click(screen.getByText("JA"));

    await user.click(screen.getByText("ZH"));
    expect(mockRouter.push).toHaveBeenCalledWith("/zh/account/settings");
  });

  it("言語セグメントがない場合、パスに言語が追加されること", async () => {
    mockPathname = "/";
    const user = userEvent.setup();
    renderLanguageDropdown("ja");

    await user.click(screen.getByText("JA"));

    await user.click(screen.getByText("EN"));
    expect(mockRouter.push).toHaveBeenCalledWith("/en");
  });
});
