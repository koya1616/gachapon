import { GET } from "@/app/api/deploy/route";
import { ADMIN_CODE } from "@/const/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

process.env.VERCEL_API_TOKEN = "test-vercel-token";
process.env.VERCEL_PROJECT_ID = "test-project-id";
process.env.ADMIN_CODE = "test-admin-code";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

global.fetch = vi.fn();

const mockCookieStore = (token: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

const mockDeploymentData = {
  deployments: [
    {
      uid: "test-deployment-id",
      name: "test-deployment",
    },
  ],
};

describe("GET /api/deploy", () => {
  const mockRequest = new NextRequest("http://localhost:3000/api/deploy");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("管理者トークンが無効な場合、401 エラーを返す", async () => {
    mockCookieStore("invalid-admin-token");

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: "Unauthorized", data: null });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("有効な管理者トークンがある場合、デプロイをトリガーして200を返す", async () => {
    mockCookieStore(process.env.ADMIN_CODE || "");

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockDeploymentData),
      } as Response)
      .mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ success: true }),
      } as Response);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      `https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}`,
      expect.objectContaining({
        method: "get",
        headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`, "Content-Type": "application/json" },
      }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://api.vercel.com/v13/deployments",
      expect.objectContaining({
        method: "post",
        headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "gachapo",
          target: "production",
          deploymentId: "test-deployment-id",
        }),
      }),
    );
  });
});
