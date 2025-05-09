import { GET, POST } from "@/app/api/address/route";
import { USER_TOKEN } from "@/const/cookies";
import { findAddressByUserId } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { UserFactory } from "../../../factory/user";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const mockCookieStore = (token: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: vi.fn().mockImplementation((name: string) => {
      return name === USER_TOKEN ? { name: USER_TOKEN, value: token } : undefined;
    }),
  } as unknown as ReadonlyRequestCookies);
};

let user: UserFactory;

const setUpUser = async (withAddress: boolean) => {
  const email = `${crypto.randomUUID().split("-")[0]}@example.com`;
  return await UserFactory.create(email, withAddress ? { address: { value: {} } } : undefined);
};

describe("GET /api/address", () => {
  beforeAll(async () => {
    vi.resetAllMocks();
  });

  it("ユーザーが認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const response = await POST(
      new NextRequest("http://localhost/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("ユーザーが認証されている場合は200とアドレスデータを返す", async () => {
    user = await setUpUser(true);
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      message: "OK",
      data: {
        id: user.address?.id,
        user_id: user.id,
        name: user.address?.name,
        country: user.address?.country,
        postal_code: user.address?.postal_code,
        address: user.address?.address,
      },
    });
  });

  it("アドレスを登録していないユーザーの場合は空のアドレスデータを返す", async () => {
    user = await setUpUser(false);
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });
  });
});

describe("POST /api/address", () => {
  beforeAll(async () => {
    vi.resetAllMocks();
  });

  it("ユーザーが認証されていない場合は401を返す", async () => {
    mockCookieStore("invalid_token");

    const response = await GET();
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ message: "Unauthorized", data: null });
  });

  it("アドレスを登録していないユーザーの場合は新規作成する", async () => {
    user = await setUpUser(false);
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    const response = await POST(
      new NextRequest("http://localhost/api/address", {
        method: "POST",
        body: JSON.stringify({
          id: 0,
          user_id: user.id,
          name: "John Doe",
          country: "US",
          postal_code: "12345",
          address: "123 Main St",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });
    const address = await findAddressByUserId(user.id);
    expect(address).toEqual({
      id: expect.any(Number),
      user_id: user.id,
      name: "John Doe",
      country: "US",
      postal_code: "12345",
      address: "123 Main St",
    });
  });

  it("アドレスを登録しているユーザーの場合は更新する", async () => {
    user = await setUpUser(true);
    mockCookieStore(generateToken({ id: user.id, type: "user" }));

    const response = await POST(
      new NextRequest("http://localhost/api/address", {
        method: "POST",
        body: JSON.stringify({
          id: user.address?.id,
          user_id: user.id,
          name: "Jane Doe",
          country: "JP",
          postal_code: "54321",
          address: "456 Main St",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: "OK", data: null });
    const address = await findAddressByUserId(user.id);
    expect(address).toEqual({
      id: user.address?.id,
      user_id: user.id,
      name: "Jane Doe",
      country: "JP",
      postal_code: "54321",
      address: "456 Main St",
    });
  });
});
