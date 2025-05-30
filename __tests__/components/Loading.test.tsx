import Loading from "@/components/Loading";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Loadingコンポーネント", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Loadingコンポーネントが正しくレンダリングされること", () => {
    const { container } = render(<Loading />);

    expect(container).toBeDefined();

    const outerDiv = container.querySelector("div");
    expect(outerDiv).toBeDefined();
    expect(outerDiv?.className).toEqual("text-center py-1");

    const spinner = outerDiv?.querySelector("div");
    expect(spinner).toBeDefined();
    expect(spinner?.className).toEqual(
      "inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500",
    );
  });
});
