import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Shipment } from "@/types";
import type { ShipmentStatus } from "@/lib/db/shipments/query";
import ShipmentStatusActions from "@/app/admin/payment/paypay/[id]/_components/ShipmentStatusActions";

const mockRouter = {
  refresh: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("ShipmentStatusActionsコンポーネント", () => {
  const originalFetch = global.fetch;
  const mockFetch = vi.fn();

  beforeEach(() => {
    cleanup();
    global.fetch = mockFetch;
    mockFetch.mockReset();

    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const createMockShipment = (overrides: Partial<Shipment> = {}): Shipment => ({
    id: 1,
    paypay_payment_id: 1,
    address: "東京都渋谷区",
    shipped_at: null,
    delivered_at: null,
    payment_failed_at: null,
    cancelled_at: null,
    created_at: Date.now(),
    ...overrides,
  });

  it("初期状態で配達済み以外のすべてのボタンが表示されること", () => {
    const shipment = createMockShipment();
    render(<ShipmentStatusActions shipment={shipment} />);

    expect(screen.getByText("発送済みにする")).toBeDefined();
    expect(screen.getByText("決済失敗にする")).toBeDefined();
    expect(screen.getByText("キャンセルする")).toBeDefined();
    expect(screen.queryByText("配達済みにする")).toBeNull();
  });

  it("shipped_atが設定されている場合、配達済みボタンのみが表示されること", () => {
    const shipment = createMockShipment({ shipped_at: Date.now() });
    render(<ShipmentStatusActions shipment={shipment} />);

    expect(screen.getByText("配達済みにする")).toBeDefined();
    expect(screen.queryByText("発送済みにする")).toBeNull();
    expect(screen.queryByText("決済失敗にする")).toBeNull();
    expect(screen.queryByText("キャンセルする")).toBeNull();
  });

  it("cancelled_atが設定されている場合、どのボタンも表示されないこと", () => {
    const shipment = createMockShipment({ cancelled_at: Date.now() });
    render(<ShipmentStatusActions shipment={shipment} />);

    expect(screen.queryByText("発送済みにする")).toBeNull();
    expect(screen.queryByText("配達済みにする")).toBeNull();
    expect(screen.queryByText("決済失敗にする")).toBeNull();
    expect(screen.queryByText("キャンセルする")).toBeNull();
  });

  it("payment_failed_atが設定されている場合、キャンセルボタン以外は表示されないこと", () => {
    const shipment = createMockShipment({ payment_failed_at: Date.now() });
    render(<ShipmentStatusActions shipment={shipment} />);

    expect(screen.queryByText("発送済みにする")).toBeNull();
    expect(screen.queryByText("配達済みにする")).toBeNull();
    expect(screen.queryByText("決済失敗にする")).toBeNull();
    expect(screen.queryByText("キャンセルする")).toBeDefined();
  });

  it("delivered_atが設定されている場合、どのボタンも表示されないこと", () => {
    const shipment = createMockShipment({ shipped_at: Date.now(), delivered_at: Date.now() });
    render(<ShipmentStatusActions shipment={shipment} />);

    expect(screen.queryByText("発送済みにする")).toBeNull();
    expect(screen.queryByText("配達済みにする")).toBeNull();
    expect(screen.queryByText("決済失敗にする")).toBeNull();
    expect(screen.queryByText("キャンセルする")).toBeNull();
  });

  const statusConfigs: { label: string; status: ShipmentStatus }[] = [
    { label: "発送済みにする", status: "shipped" },
    { label: "配達済みにする", status: "delivered" },
    { label: "決済失敗にする", status: "payment_failed" },
    { label: "キャンセルする", status: "cancelled" },
  ];

  for (const { label, status } of statusConfigs) {
    it(`${label}ボタンをクリックすると正しいAPIリクエストが送信されること`, async () => {
      const user = userEvent.setup();
      const shipment = createMockShipment();

      if (status === "delivered") {
        shipment.shipped_at = Date.now();
      }

      render(<ShipmentStatusActions shipment={shipment} />);

      const button = screen.queryByText(label);

      await user.click(button as HTMLElement);
      expect(mockFetch).toHaveBeenCalledWith("/api/shipment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipmentId: shipment.id, status }),
      });
    });
  }

  it("ボタンクリック中はローディング状態が表示されること", async () => {
    const user = userEvent.setup();
    const shipment = createMockShipment();

    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({}),
            });
          }, 100);
        }),
    );

    render(<ShipmentStatusActions shipment={shipment} />);

    await user.click(screen.getByText("発送済みにする"));

    for (const loading of screen.getAllByText("⏳")) {
      expect(loading).toBeDefined();
    }

    for (const button of screen.getAllByRole("button")) {
      expect(button.getAttribute("disabled")).toBe("");
    }

    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("APIレスポンスが失敗した場合、アラートが表示されること", async () => {
    const user = userEvent.setup();
    const shipment = createMockShipment();

    mockFetch.mockImplementation(() => Promise.resolve({ ok: false }));

    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<ShipmentStatusActions shipment={shipment} />);

    await user.click(screen.getByText("発送済みにする"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("更新に失敗しました。再度お試しください。");
    });
  });

  it("APIリクエストが例外をスローした場合、アラートが表示されること", async () => {
    const user = userEvent.setup();
    const shipment = createMockShipment();

    mockFetch.mockImplementation(() => Promise.reject(new Error("Network error")));

    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<ShipmentStatusActions shipment={shipment} />);

    await user.click(screen.getByText("発送済みにする"));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("更新に失敗しました。再度お試しください。");
    });
  });

  it("処理完了後にローディング状態が解除されること", async () => {
    const user = userEvent.setup();
    const shipment = createMockShipment();

    render(<ShipmentStatusActions shipment={shipment} />);

    await user.click(screen.getByText("発送済みにする"));

    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
      expect(screen.queryByText("⏳")).toBeNull();

      for (const button of screen.getAllByRole("button")) {
        expect(button.getAttribute("disabled")).toBe(null);
      }
    });
  });
});
