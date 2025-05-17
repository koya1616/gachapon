import { GET } from "@/app/api/auth/google/callback/route";
import { USER_TOKEN } from "@/const/cookies";
import { findUserByEmail } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserFactory } from "./../../../../../factory/user";

process.env.GOOGLE_CLIENT_ID = "test_client_id";
process.env.GOOGLE_CLIENT_SECRET = "test_client_secret";
process.env.GOOGLE_AUTH_REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((url) => {
    return NextResponse.redirect(url);
  }),
}));

global.fetch = vi.fn();

const mockCookieStore = () => {
  const setCookieMock = vi.fn();
  vi.mocked(cookies).mockResolvedValue({
    set: setCookieMock,
  } as unknown as ReadonlyRequestCookies);
  return setCookieMock;
};

const mockTokenData = { access_token: "test-access-token" };

const setupGoogleApiMocks = (email: string) => {
  vi.mocked(fetch)
    .mockResolvedValueOnce({
      json: () => Promise.resolve(mockTokenData),
    } as Response)
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ email }),
    } as Response);
};

const verifyApiCalls = () => {
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenNthCalledWith(
    1,
    "https://oauth2.googleapis.com/token",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: "test-code",
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URI || "",
        grant_type: "authorization_code",
      }).toString(),
    }),
  );
  expect(fetch).toHaveBeenNthCalledWith(
    2,
    "https://www.googleapis.com/oauth2/v3/userinfo",
    expect.objectContaining({
      headers: { Authorization: `Bearer ${mockTokenData.access_token}` },
    }),
  );
};

const verifyUserAuthentication = async (setCookieMock: ReturnType<typeof vi.fn>, email: string) => {
  const user = await findUserByEmail(email);
  expect(user).not.toBeNull();

  expect(setCookieMock).toHaveBeenCalledWith(
    USER_TOKEN,
    generateToken({ id: Number(user?.id), type: "user" }),
    expect.objectContaining({
      path: "/",
      expires: expect.any(Date),
      httpOnly: true,
      secure: false,
    }),
  );

  expect(redirect).toHaveBeenCalledTimes(1);
  expect(redirect).toHaveBeenCalledWith("/ja/account");
};

describe("GET /api/auth/google/callback", () => {
  const mockRequest = new NextRequest("http://localhost:3000/api/auth/google/callback?code=test-code");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("新規ユーザーの場合、ユーザーを作成してトークンを設定し、アカウントページにリダイレクトする", async () => {
    const setCookieMock = mockCookieStore();
    const email = "test@example.com";

    setupGoogleApiMocks(email);
    await GET(mockRequest);

    verifyApiCalls();
    await verifyUserAuthentication(setCookieMock, email);
  });

  it("既存ユーザーの場合、ユーザーを取得してトークンを設定し、アカウントページにリダイレクトする", async () => {
    const setCookieMock = mockCookieStore();
    const userFactory = await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`);

    setupGoogleApiMocks(userFactory.email);
    await GET(mockRequest);

    verifyApiCalls();
    await verifyUserAuthentication(setCookieMock, userFactory.email);
  });
});
