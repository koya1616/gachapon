import {
  createPaymentProducts,
  createPaypayPayment,
  executeQuery,
  findPaypayPaymentByMerchantPaymentId,
  getPaymentProductsByPaypayPaymentId,
  getPaypayPayments,
  getPaypayPaymentsByUserId,
} from "@/lib/db";
import { UserFactory } from "../../factory/user";
import { beforeAll, describe, expect, it } from "vitest";
import type { Order, PaypayPayment } from "@/types";

let user: UserFactory;

const setUpUser = async (withPaypayPayment: boolean) => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: withPaypayPayment
      ? {
          value: { merchant_payment_id: `${crypto.randomUUID().split("-")[0]}` },
          options: { withShipment: true },
        }
      : undefined,
  });
};

type OrderKeys = keyof Order;
const expectedKeys: OrderKeys[] = [
  "user_id",
  "merchant_payment_id",
  "paypay_payment_id",
  "address",
  "shipped_at",
  "delivered_at",
  "payment_failed_at",
  "cancelled_at",
  "created_at",
];

type PaypayPaymentKeys = keyof PaypayPayment;
const paypayPaymentKeys: PaypayPaymentKeys[] = ["id", "user_id", "merchant_payment_id"];

describe("PaypayPaymentsテーブルに関するテスト", () => {
  describe("getPaypayPayments", () => {
    beforeAll(async () => {
      user = await setUpUser(true);
    });

    it("全てのPaypay決済情報を取得できること", async () => {
      const result = await getPaypayPayments();
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("getPaypayPaymentsByUserId", () => {
    beforeAll(async () => {
      user = await setUpUser(true);
    });

    it("指定したユーザーIDのPaypay決済情報を取得できること", async () => {
      const result = await getPaypayPaymentsByUserId(user.id);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("findPaypayPaymentByMerchantPaymentId", () => {
    beforeAll(async () => {
      user = await setUpUser(true);
    });

    it("指定したマーチャント決済IDのPaypay決済情報を取得できること", async () => {
      const result = await findPaypayPaymentByMerchantPaymentId(user.paypayPayment?.merchant_payment_id as string);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(user.paypayPayment?.id);
      expect(Object.keys(result as PaypayPayment)).toEqual(expect.arrayContaining(paypayPaymentKeys));
    });
  });

  describe("createPaypayPayment", () => {
    beforeAll(async () => {
      user = await setUpUser(false);
    });

    it("Paypay決済情報を作成できること", async () => {
      const result = await createPaypayPayment({
        user_id: user.id,
        merchant_payment_id: `${crypto.randomUUID().split("-")[0]}`,
      });
      expect(result).not.toBeNull();
      expect(result.user_id).toBe(user.id);
      expect(result.merchant_payment_id).not.toBeNull();
      expect(Object.keys(result)).toEqual(expect.arrayContaining(paypayPaymentKeys));
    });
  });
});
