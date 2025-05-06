import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { GET } from "@/app/api/auth/google/route";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { USER_TOKEN } from "@/const/cookies";
import { generateToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

process.env.GOOGLE_CLIENT_ID = "test_client_id";
process.env.GOOGLE_AUTH_REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((url) => {
    return NextResponse.redirect(url);
  }),
}));

const mockCookieStore = (token: string | null) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN && token ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("GET /api/auth/google", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("ユーザーが認証されていない場合、Googleの認証ページにリダイレクトされる", async () => {
    mockCookieStore(null);

    await GET();

    const OAUTH_PARAMS = new URLSearchParams({
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
      include_granted_scopes: "true",
      response_type: "code",
      state: "state_parameter_passthrough_value",
      redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URI || "",
      client_id: process.env.GOOGLE_CLIENT_ID || "",
    });
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(`https://accounts.google.com/o/oauth2/v2/auth?${OAUTH_PARAMS.toString()}`);
  });

  it("ユーザーが既に認証されている場合、ホームページにリダイレクトされる", async () => {
    mockCookieStore(generateToken({ id: 1, type: "user" }));

    await GET();
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/ja");
  });
});
