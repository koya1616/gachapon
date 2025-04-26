import { formatDate } from "@/lib/date";
import { describe, it, expect } from "vitest";

describe("Date Module", () => {
  describe("formatDate", () => {
    it("正しいタイムスタンプを渡すと、正しい日付形式で返すこと", () => {
      const timestamp = 1672531199000;
      const formattedDate = formatDate(timestamp);
      expect(formattedDate).toBe("2023/1/1 10:59:59");
    });

    it("無効なタイムスタンプを渡すと、Invalid Dateを返すこと", () => {
      const invalidTimestamp = "invalid";
      const formattedDate = formatDate(invalidTimestamp);
      expect(formattedDate).toBe("Invalid Date");
    });
  });
});
