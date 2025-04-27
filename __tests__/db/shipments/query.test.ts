import "../setup";
import {
  executeQuery,
  findShipmentByMerchantPaymentId,
  findShipmentByMerchantPaymentIdAndUserId,
  updateShipmentStatus,
} from "@/lib/db";
import type { User } from "@/types";

import { describe, it, expect, beforeAll, afterAll } from "vitest";

const initialQuery = async (merchantPaymentId: string, email: string) => {
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
    SELECT id, '123 Test St' FROM inserted_payment
  `;

  await executeQuery(query, [email, merchantPaymentId]);
};

const truncateAll = async () => {
  await executeQuery("TRUNCATE TABLE users CASCADE");
  await executeQuery("TRUNCATE TABLE paypay_payments CASCADE");
  await executeQuery("TRUNCATE TABLE shipments CASCADE");
};

describe("findShipmentByMerchantPaymentId", () => {
  const testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
  beforeAll(async () => {
    await initialQuery(testMerchantPaymentId, `${crypto.randomUUID().split("-")[0]}@example.com`);
  });

  afterAll(async () => {
    await truncateAll();
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

describe("findShipmentByMerchantPaymentIdAndUserId", () => {
  const email = `${crypto.randomUUID().split("-")[0]}@example.com`;
  const testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;

  let userId: number;
  beforeAll(async () => {
    await initialQuery(testMerchantPaymentId, email);

    const user = await executeQuery<User>("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    userId = user[0].id;
  });

  afterAll(async () => {
    await truncateAll();
  });

  it("存在するmerchant_payment_idとuser_idの組み合わせの場合、出荷情報を返すべき", async () => {
    const result = await findShipmentByMerchantPaymentIdAndUserId(testMerchantPaymentId, userId);
    expect(result).not.toBeNull();
    expect(result?.address).toBe("123 Test St");
  });

  it("存在しないmerchant_payment_idまたはuser_idの組み合わせの場合、出荷情報は返さないべき", async () => {
    const result = await findShipmentByMerchantPaymentIdAndUserId("non_existent_merchant_payment_id", userId);
    expect(result).toBeNull();
  });

  it("異なるuser_idの場合、出荷情報は返さないべき", async () => {
    const result = await findShipmentByMerchantPaymentIdAndUserId(testMerchantPaymentId, userId + 1);
    expect(result).toBeNull();
  });
});

describe("updateShipmentStatus", () => {
  const testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
  let shipmentId: number;

  beforeAll(async () => {
    await initialQuery(testMerchantPaymentId, `${crypto.randomUUID().split("-")[0]}@example.com`);

    const shipment = await findShipmentByMerchantPaymentId(testMerchantPaymentId);
    shipmentId = shipment?.id as number;
  });

  afterAll(async () => {
    await truncateAll();
  });

  it("発送日時が更新されること", async () => {
    const status = "shipped";
    await updateShipmentStatus(shipmentId, status);

    const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipmentId]);
    expect(result[0][`${status}_at`]).not.toBeNull();
  });

  it("到着日時が更新されること", async () => {
    const status = "delivered";
    await updateShipmentStatus(shipmentId, status);

    const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipmentId]);
    expect(result[0][`${status}_at`]).not.toBeNull();
  });

  it("キャンセル日時が更新されること", async () => {
    const status = "cancelled";
    await updateShipmentStatus(shipmentId, status);

    const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipmentId]);
    expect(result[0][`${status}_at`]).not.toBeNull();
  });

  it("決済失敗日時が更新されること", async () => {
    const status = "payment_failed";
    await updateShipmentStatus(shipmentId, status);

    const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [shipmentId]);
    expect(result[0][`${status}_at`]).not.toBeNull();
  });
});
