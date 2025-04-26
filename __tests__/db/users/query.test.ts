import "../setup";
import { createUser, executeQuery, findUserByEmail } from "@/lib/db";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("findUserByEmail", () => {
  beforeAll(async () => {
    await executeQuery("INSERT INTO users (email) VALUES ($1)", ["test@example.com"]);
  });

  afterAll(async () => {
    await executeQuery("TRUNCATE TABLE users CASCADE");
  });

  it("有効なメールアドレスの場合、ユーザー情報を返すべき", async () => {
    const result = await findUserByEmail("test@example.com");
    expect(result?.email).toBe("test@example.com");
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
    const email = "test@example.com";
    await createUser(email);
    const result = await findUserByEmail(email);
    expect(result?.email).toBe(email);
  });
});
