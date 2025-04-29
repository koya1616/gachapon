import { createShipmentWithTransaction, executeTransaction, findShipmentByMerchantPaymentId } from "@/lib/db";
import type { Shipment } from "@/types";
import { describe, it, expect, beforeEach } from "vitest";
import { UserFactory } from "../../factory/user";

let testMerchantPaymentId: string;
let user: UserFactory;

const setUpUser = async () => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: {
      value: { merchant_payment_id: testMerchantPaymentId },
    },
  });
};

type ShipmentKeys = keyof Shipment;
const expectedKeys: ShipmentKeys[] = [
  "id",
  "paypay_payment_id",
  "address",
  "shipped_at",
  "delivered_at",
  "payment_failed_at",
  "cancelled_at",
  "created_at",
];

describe("Shipmentsテーブルのトランザクションに関するテスト", () => {
  describe("createShipmentWithTransaction", () => {
    beforeEach(async () => {
      testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
      user = await setUpUser();
    });

    it("トランザクション内でエラーが発生しない場合、配送レコードが作成されること", async () => {
      const shipment = await executeTransaction(async (client) => {
        return await createShipmentWithTransaction(client, {
          paypay_payment_id: Number(user.paypayPayment?.id),
          address: "住所",
        });
      });
      expect(shipment.id).not.toBeNull();
      expect(shipment.paypay_payment_id).toBe(Number(user.paypayPayment?.id));
      expect(shipment.address).toBe("住所");
      expect(Object.keys(shipment)).toEqual(expect.arrayContaining(expectedKeys));
    });

    it("トランザクション内でエラーが発生した場合、配送レコードが作成されないこと", async () => {
      await executeTransaction(async (client) => {
        await createShipmentWithTransaction(client, {
          paypay_payment_id: Number(user.paypayPayment?.id),
          address: "住所",
        });

        throw new Error("トランザクション内でエラーが発生しました");
      })
        .catch((error) => {
          expect(error).toBeDefined();
        })
        .finally(async () => {
          const shipment = await findShipmentByMerchantPaymentId(testMerchantPaymentId);
          expect(shipment).toBeNull();
        });
    });
  });
});
