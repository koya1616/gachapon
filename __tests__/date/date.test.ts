import { formatDate } from "@/lib/date";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("formatDate", () => {
  beforeEach(() => {
    const fixedDate = new Date("2023-01-01T00:00:00Z");
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("無効なタイムスタンプを渡すと、Invalid Dateを返すこと", () => {
    const invalidTimestamp = "invalid";
    const formattedDate = formatDate(invalidTimestamp);
    expect(formattedDate).toBe("Invalid Date");
  });

  it("JST (Asia/Tokyo)のタイムゾーンで正しくフォーマットされること", () => {
    vi.stubEnv("TZ", "Asia/Tokyo");

    const formattedDate = formatDate(1672531199000);
    expect(formattedDate).toBe("2023/1/1 8:59:59");
  });

  it("UTC (GMT)のタイムゾーンで正しくフォーマットされること", () => {
    vi.stubEnv("TZ", "UTC");

    const formattedDate = formatDate(1672531199000);
    expect(formattedDate).toBe("2022/12/31 23:59:59");
  });
});
