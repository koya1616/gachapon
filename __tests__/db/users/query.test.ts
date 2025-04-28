import { createUser, findUserByEmail } from "@/lib/db";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { UserFactory } from "../../factory/user";

describe("Usersテーブルに関するテスト", () => {
  describe("findUserByEmail", () => {
    const testEmail = `${crypto.randomUUID().split("-")[0]}@example.com`;

    let user: UserFactory;
    beforeAll(async () => {
      user = await UserFactory.create(testEmail);
    });

    it("有効なメールアドレスの場合、ユーザー情報を返すべき", async () => {
      const result = await findUserByEmail(testEmail);
      expect(result?.id).toBe(user.id);
      expect(result?.email).toBe(testEmail);
    });

    it("存在しないメールアドレスの場合、nullを返すべき", async () => {
      const result = await findUserByEmail("invalid@example.com");
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("有効なメールアドレスの場合、ユーザー情報を返すべき", async () => {
      const email = `${crypto.randomUUID().split("-")[0]}@example.com`;
      const user = await createUser(email);
      expect(user?.email).toBe(email);
    });
  });
});
