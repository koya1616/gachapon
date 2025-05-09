import Badge from "@/components/Badge";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Badgeコンポーネント", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Badgeコンポーネントが正しくレンダリングされること", () => {
    const text = "テストバッジ";
    const { container } = render(<Badge text={text} color="green" />);

    expect(container).toBeDefined();

    const badge = container.querySelector("span");
    expect(badge).toBeDefined();
    expect(badge?.innerHTML).toContain(text);
    expect(badge?.className).toContain("bg-green-100");
    expect(badge?.className).toContain("text-green-800");
  });

  it("各色のバッジが正しいクラス名を持つこと", () => {
    const testColor = (color: "green" | "red" | "blue" | "gray") => {
      const { container } = render(<Badge text="テスト" color={color} />);
      const badge = container.querySelector("span");
      expect(badge?.className).toContain(`bg-${color}-100`);
      expect(badge?.className).toContain(`text-${color}-800`);
    };

    testColor("green");
    testColor("red");
    testColor("blue");
    testColor("gray");
  });

  it("長いテキストでも正しくレンダリングされること", () => {
    const longText = "これは非常に長いテキストのバッジです。";
    const { container } = render(<Badge text={longText} color="blue" />);

    const badge = container.querySelector("span");
    expect(badge).toBeDefined();
    expect(badge?.innerHTML).toContain(longText);
  });
});
