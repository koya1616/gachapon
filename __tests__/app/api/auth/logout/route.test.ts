import { GET } from "@/app/api/auth/logout/route";
import { USER_TOKEN } from "@/const/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const mockCookieStore = () => {
  const deleteCookieMock = vi.fn();
  vi.mocked(cookies).mockResolvedValue({
    delete: deleteCookieMock,
  } as unknown as ReadonlyRequestCookies);
  return deleteCookieMock;
};

describe("GET /api/auth/logout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("USERトークンのクッキーが削除され、成功レスポンスが返される", async () => {
    const deleteCookieMock = mockCookieStore();

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });
    expect(deleteCookieMock).toHaveBeenCalledTimes(1);
    expect(deleteCookieMock).toHaveBeenCalledWith(USER_TOKEN);
  });
});
