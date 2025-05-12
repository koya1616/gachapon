import { formatDate, formatDateForInput } from "@/lib/date";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

describe("formatDateForInput", () => {
  it("正しいフォーマットで日付を返すこと", () => {
    const formattedDate = formatDateForInput(new Date("2023-01-01T00:00:00Z"));
    expect(formattedDate).toBe("2023-01-01T00:00");
  });

  it("無効な日付を渡すと、NaN-NaN-NaNTNaN:NaNを返すこと", () => {
    const formattedDate = formatDateForInput(new Date("invalid"));
    expect(formattedDate).toBe("NaN-NaN-NaNTNaN:NaN");
  });
});
