import { describe, expect, it } from "vitest";
import { executeQuery } from "../../../src/lib/db";

describe("Database connection", () => {
  it("should connect to the test database", async () => {
    const result = await executeQuery("SELECT 1 as connected");
    expect(result).toHaveLength(1);
    expect(result[0].connected).toBe(1);
  });
});
