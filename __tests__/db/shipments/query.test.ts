import "../setup";
import { executeQuery, findShipmentByMerchantPaymentId } from "@/lib/db";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("findShipmentByMerchantPaymentId", () => {
  const testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
  beforeAll(async () => {
    const query = `
    WITH inserted_user AS (
      INSERT INTO users (email)
      VALUES ($1)
      RETURNING id
    ), inserted_payment AS (
      INSERT INTO paypay_payments (user_id, merchant_payment_id)
      SELECT id, $2
      FROM inserted_user
      RETURNING id
    )
    INSERT INTO shipments (paypay_payment_id, address)
    SELECT id, $3 FROM inserted_payment
    `;

    await executeQuery(query, [
      `${crypto.randomUUID().split("-")[0]}@example.com`,
      testMerchantPaymentId,
      "123 Test St",
    ]);
  });

  afterAll(async () => {
    await executeQuery("TRUNCATE TABLE users CASCADE");
    await executeQuery("TRUNCATE TABLE paypay_payments CASCADE");
    await executeQuery("TRUNCATE TABLE shipments CASCADE");
  });

  it("存在するmerchant_payment_idの場合、出荷情報を返すべき", async () => {
    const result = await findShipmentByMerchantPaymentId(testMerchantPaymentId);
    expect(result).not.toBeNull();
    expect(result?.address).toBe("123 Test St");
  });

  it("存在しないmerchant_payment_idの場合、出荷情報は返さないべき", async () => {
    const result = await findShipmentByMerchantPaymentId("non_existent_merchant_payment_id");
    expect(result).toBeNull();
  });
});
