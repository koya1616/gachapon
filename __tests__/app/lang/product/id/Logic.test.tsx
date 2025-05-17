import Logic from "@/app/[lang]/product/[id]/_components/Logic";
import { mockLotteryEntries, mockLotteryEvents, mockProducts } from "@/mocks/data";
import type { Lang, LotteryEntry, LotteryEvent, Product } from "@/types";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/[lang]/product/[id]/_components/View", () => ({
  default: ({
    product,
    loadingEventId,
    successEventId,
    error,
    handleLotteryEntry,
  }: {
    product: Product | null;
    lang: Lang;
    lotteryEvents: LotteryEvent[];
    lotteryEntries: LotteryEntry[];
    isLogin: boolean;
    loadingEventId: number | null;
    successEventId: number | null;
    error: string | null;
    handleLotteryEntry: (eventId: number) => Promise<void>;
  }) => (
    <div data-testid="view-component">
      <div data-testid="product-name">{product?.name}</div>
      <div data-testid="loading-event-id">{loadingEventId}</div>
      <div data-testid="success-event-id">{successEventId}</div>
      <div data-testid="error-message">{error}</div>
      <button type="button" data-testid="lottery-entry-button" onClick={() => handleLotteryEntry(1)}>
        抽選に参加する
      </button>
    </div>
  ),
}));

describe("Logicコンポーネント", () => {
  const user = userEvent.setup();

  const mockCreateLotteryEntry = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("抽選エントリーボタンをクリックすると正しく処理が実行されること", async () => {
    render(
      <Logic
        product={mockProducts[0]}
        lang="ja"
        lotteryEvents={mockLotteryEvents}
        lotteryEntries={mockLotteryEntries}
        isLogin={true}
        createLotteryEntry={mockCreateLotteryEntry}
      />,
    );

    expect(screen.getByTestId("loading-event-id").textContent).toBe("");
    expect(screen.getByTestId("success-event-id").textContent).toBe("");
    expect(screen.getByTestId("error-message").textContent).toBe("");

    await user.click(screen.getByTestId("lottery-entry-button"));

    expect(mockCreateLotteryEntry).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(screen.getByTestId("loading-event-id").textContent).toBe("");
      expect(screen.getByTestId("success-event-id").textContent).toBe("1");
    });
  });

  it("エラーが発生した場合、エラーメッセージが表示されること", async () => {
    mockCreateLotteryEntry.mockRejectedValue("抽選に参加できませんでした");

    render(
      <Logic
        product={mockProducts[0]}
        lang="ja"
        lotteryEvents={mockLotteryEvents}
        lotteryEntries={mockLotteryEntries}
        isLogin={true}
        createLotteryEntry={mockCreateLotteryEntry}
      />,
    );

    await user.click(screen.getByTestId("lottery-entry-button"));

    expect(mockCreateLotteryEntry).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(screen.getByTestId("error-message").textContent).toBe("抽選に参加できませんでした");
    });
  });
});
