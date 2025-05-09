import { POST } from "@/app/api/shipment/status/route";
import { ADMIN_CODE } from "@/const/cookies";
import { updateShipmentStatus } from "@/lib/db";
import type { ShipmentStatus } from "@/lib/db/shipments/query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  updateShipmentStatus: vi.fn(),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("POST /api/shipment/status", () => {
  beforeAll(() => {
    vi.resetAllMocks();
    process.env.ADMIN_CODE = "test_admin_code";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (shipmentId: number, status: ShipmentStatus) => {
    return new NextRequest("http://localhost:3000/api/shipment/status", {
      method: "POST",
      body: JSON.stringify({ shipmentId, status }),
    });
  };

  it("管理者認証が成功した場合に出荷ステータスが更新され200を返す", async () => {
    mockCookieStore("test_admin_code");

    const shipmentId = 1;
    const status: ShipmentStatus = "shipped";
    const request = createMockRequest(shipmentId, status);

    vi.mocked(updateShipmentStatus).mockResolvedValue();

    const response = await POST(request);

    expect(response.status).toBe(200);
    const responseData = await response.json();
    expect(responseData).toEqual({ message: "OK", data: null });

    expect(updateShipmentStatus).toHaveBeenCalledTimes(1);
    expect(updateShipmentStatus).toHaveBeenCalledWith(shipmentId, status);
  });

  it("管理者認証が失敗した場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const shipmentId = 1;
    const status: ShipmentStatus = "delivered";
    const request = createMockRequest(shipmentId, status);

    const response = await POST(request);

    expect(response.status).toBe(401);
    const responseData = await response.json();
    expect(responseData).toEqual({ message: "Unauthorized", data: null });

    expect(updateShipmentStatus).not.toHaveBeenCalled();
  });

  it("ステータス更新に失敗した場合は500を返す", async () => {
    mockCookieStore("test_admin_code");

    const shipmentId = 999;
    const status: ShipmentStatus = "cancelled";
    const request = createMockRequest(shipmentId, status);

    vi.mocked(updateShipmentStatus).mockRejectedValue(new Error("Database error"));

    const response = await POST(request);

    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toEqual({ message: "Internal server error", data: null });

    expect(updateShipmentStatus).toHaveBeenCalledTimes(1);
    expect(updateShipmentStatus).toHaveBeenCalledWith(shipmentId, status);
  });

  it("すべてのShipmentStatus型の値でテスト", async () => {
    mockCookieStore("test_admin_code");

    const shipmentId = 1;
    const statuses: ShipmentStatus[] = ["shipped", "delivered", "payment_failed", "cancelled"];

    for (const status of statuses) {
      vi.clearAllMocks();
      vi.mocked(updateShipmentStatus).mockResolvedValue();

      const request = createMockRequest(shipmentId, status);
      const response = await POST(request);

      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData).toEqual({ message: "OK", data: null });

      expect(updateShipmentStatus).toHaveBeenCalledTimes(1);
      expect(updateShipmentStatus).toHaveBeenCalledWith(shipmentId, status);
    }
  });
});
