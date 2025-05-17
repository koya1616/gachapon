import { POST } from "@/app/api/auth/admin/login/route";
import { ADMIN_CODE } from "@/const/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

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
    expect(data).toEqual({ message: "OK", data: null });
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

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
    expect(setCookieMock).not.toHaveBeenCalled();
  });
});
