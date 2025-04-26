import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateToken, verifyToken } from "../../src/lib/jwt";

describe("JWT Module", () => {
  beforeEach(() => {
    process.env.JWT_SECRET_KEY = "test-secret-key";
  });

  describe("generateToken", () => {
    it("正しいパラメータでトークンを生成し、検証できること", () => {
      const token = generateToken({ id: 123, type: "user" });

      const tokenPayload = verifyToken(token);
      expect(tokenPayload?.id).toBe(123);
      expect(tokenPayload?.type).toBe("user");
    });
  });

  describe("verifyToken", () => {
    it("無効なトークンを検証するとnullを返すこと", () => {
      const invalidToken = "invalid.token.string";
      const tokenPayload = verifyToken(invalidToken);
      expect(tokenPayload).toBeNull();
    });

    it("有効なトークンを検証するとペイロードを返すこと", () => {
      const validToken = generateToken({ id: 123, type: "user" });
      const tokenPayload = verifyToken(validToken);
      expect(tokenPayload?.id).toBe(123);
      expect(tokenPayload?.type).toBe("user");
    });
  });
});
