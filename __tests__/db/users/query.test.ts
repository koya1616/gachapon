import "../setup";
import { createUser, executeQuery, findUserByEmail } from "@/lib/db";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("findUserByEmail", () => {
  const testEmail = `${crypto.randomUUID().split("-")[0]}@example.com`;
  beforeAll(async () => {
    await executeQuery("INSERT INTO users (email) VALUES ($1)", [testEmail]);
  });

  afterAll(async () => {
    await executeQuery("TRUNCATE TABLE users CASCADE");
  });

  it("有効なメールアドレスの場合、ユーザー情報を返すべき", async () => {
    const result = await findUserByEmail(testEmail);
    expect(result?.email).toBe(testEmail);
  });

  it("存在しないメールアドレスの場合、nullを返すべき", async () => {
    const result = await findUserByEmail("invalid@example.com");
    expect(result).toBeNull();
  });
});

describe("createUser", () => {
  afterAll(async () => {
    await executeQuery("TRUNCATE TABLE users CASCADE");
  });

  it("有効なメールアドレスの場合、ユーザー情報を返すべき", async () => {
    const email = `${crypto.randomUUID().split("-")[0]}@example.com`;
    await createUser(email);
    const result = await findUserByEmail(email);
    expect(result?.email).toBe(email);
  });
});
