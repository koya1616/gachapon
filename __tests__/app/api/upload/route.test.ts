import { POST } from "@/app/api/upload/route";
import { ADMIN_CODE } from "@/const/cookies";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn().mockImplementation(() => ({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  })),
}));

vi.mock("@aws-sdk/lib-storage", () => ({
  Upload: vi.fn().mockImplementation(() => ({
    done: vi.fn().mockResolvedValue({}),
  })),
}));

const mockCookieStore = (adminToken: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === ADMIN_CODE ? { name: ADMIN_CODE, value: adminToken } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

describe("POST /api/upload", () => {
  beforeAll(() => {
    process.env.ADMIN_CODE = "test_admin_code";
    process.env.R2_ACCOUNT_ID = "test_r2_account_id";
    process.env.R2_ACCESS_KEY_ID = "test_r2_access_key_id";
    process.env.R2_SECRET_ACCESS_KEY = "test_r2_secret_access_key";
    process.env.R2_BUCKET_NAME = "test_bucket";
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("管理者トークンが無効な場合、401 エラーを返す", async () => {
    mockCookieStore("invalid_admin_token");

    const formData = new FormData();
    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    formData.append("file", file);

    const request = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
    expect(Upload).not.toHaveBeenCalled();
  });

  it("リクエストにファイルがない場合、400 エラーを返す", async () => {
    mockCookieStore("test_admin_code");

    const formData = new FormData();
    const request = new NextRequest("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toEqual({ message: "Bad request", data: null });
    expect(Upload).not.toHaveBeenCalled();
  });
});
