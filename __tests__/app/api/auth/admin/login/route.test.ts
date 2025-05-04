import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { POST } from "@/app/api/auth/admin/login/route";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { ADMIN_CODE } from "@/const/cookies";

process.env.ADMIN_CODE = "test_admin_code";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const mockCookieStore = () => {
  const setCookieMock = vi.fn();
  vi.mocked(cookies).mockResolvedValue({
    set: setCookieMock,
  } as unknown as ReadonlyRequestCookies);
  return setCookieMock;
};

describe("POST /api/auth/admin/login", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });

  it("正しい管理者コードが提供された場合、クッキーを設定して成功レスポンスを返す", async () => {
    const setCookieMock = mockCookieStore();

    const response = await POST(
      new NextRequest("http://localhost/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({
          code: "test_admin_code",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ success: true });
    expect(setCookieMock).toHaveBeenCalledWith(
      ADMIN_CODE,
      "test_admin_code",
      expect.objectContaining({
        path: "/",
        expires: expect.any(Date),
        httpOnly: true,
        secure: false,
      }),
    );
  });

  it("不正な管理者コードが提供された場合、クッキーを設定せずに失敗レスポンスを返す", async () => {
    const setCookieMock = mockCookieStore();

    const response = await POST(
      new NextRequest("http://localhost/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({
          code: "wrong_admin_code",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data).toEqual({ success: false });
    expect(setCookieMock).not.toHaveBeenCalled();
  });
});
