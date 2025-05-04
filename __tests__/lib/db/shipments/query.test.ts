import {
  createShipment,
  executeQuery,
  findShipmentByMerchantPaymentId,
  findShipmentByMerchantPaymentIdAndUserId,
  updateShipmentStatus,
} from "@/lib/db";
import type { Shipment } from "@/types";
import { describe, it, expect, beforeAll } from "vitest";
import { UserFactory } from "../../../factory/user";

let testMerchantPaymentId: string;
let user: UserFactory;

const setUpUser = async (withShipment?: boolean) => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: {
      value: { merchant_payment_id: testMerchantPaymentId },
      options: { withShipment: withShipment ?? true },
    },
  });
};

describe("Shipmentsテーブルに関するテスト", () => {
  describe("findShipmentByMerchantPaymentId", () => {
    beforeAll(async () => {
      testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
      user = await setUpUser();
    });

    it("存在するmerchant_payment_idの場合、出荷情報を返すべき", async () => {
      const result = await findShipmentByMerchantPaymentId(testMerchantPaymentId);
      expect(result?.id).toBe(user.shipment?.id);
    });

    it("存在しないmerchant_payment_idの場合、出荷情報は返さないべき", async () => {
      const result = await findShipmentByMerchantPaymentId("non_existent_merchant_payment_id");
      expect(result).toBeNull();
    });
  });

  describe("findShipmentByMerchantPaymentIdAndUserId", () => {
    beforeAll(async () => {
      testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
      user = await setUpUser();
    });

    it("存在するmerchant_payment_idとuser_idの組み合わせの場合、出荷情報を返すべき", async () => {
      const result = await findShipmentByMerchantPaymentIdAndUserId(testMerchantPaymentId, user.id);
      expect(result?.id).toBe(user.shipment?.id);
    });

    it("存在しないmerchant_payment_idまたはuser_idの組み合わせの場合、出荷情報は返さないべき", async () => {
      const result = await findShipmentByMerchantPaymentIdAndUserId("non_existent_merchant_payment_id", user.id);
      expect(result).toBeNull();
    });

    it("異なるuser_idの場合、出荷情報は返さないべき", async () => {
      const result = await findShipmentByMerchantPaymentIdAndUserId(testMerchantPaymentId, user.id + 1);
      expect(result).toBeNull();
    });
  });

  describe("updateShipmentStatus", () => {
    beforeAll(async () => {
      testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
      user = await setUpUser();
    });

    it("発送日時が更新されること", async () => {
      const status = "shipped";
      await updateShipmentStatus(Number(user.shipment?.id), status);

      const result = await executeQuery<Shipment>("SELECT * FROM shipments WHERE id = $1", [user.shipment?.id]);
      expect(result).not.toBeNull();
      expect(result[0][`${status}_at`]).not.toBeNull();
    });

    it("到着日時が更新されること", async () => {
      const status = "delivered";
      await updateShipmentStatus(Number(user.shipment?.id), status);

      const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [user.shipment?.id]);
      expect(result[0][`${status}_at`]).not.toBeNull();
    });

    it("キャンセル日時が更新されること", async () => {
      const status = "cancelled";
      await updateShipmentStatus(Number(user.shipment?.id), status);

      const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [user.shipment?.id]);
      expect(result[0][`${status}_at`]).not.toBeNull();
    });

    it("決済失敗日時が更新されること", async () => {
      const status = "payment_failed";
      await updateShipmentStatus(Number(user.shipment?.id), status);

      const result = await executeQuery("SELECT * FROM shipments WHERE id = $1", [user.shipment?.id]);
      expect(result[0][`${status}_at`]).not.toBeNull();
    });
  });

  describe("createShipment", () => {
    beforeAll(async () => {
      testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
      user = await setUpUser(false);
    });

    it("配送レコードが作成されること", async () => {
      const shipment = await createShipment({ paypay_payment_id: Number(user.paypayPayment?.id), address: "住所" });
      expect(shipment.id).not.toBeNull();
      expect(shipment.paypay_payment_id).toBe(Number(user.paypayPayment?.id));
      expect(shipment.address).toBe("住所");
    });
  });
});
