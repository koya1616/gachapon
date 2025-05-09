import { createPaypayPaymentWithTransaction, executeTransaction, findPaypayPaymentByMerchantPaymentId } from "@/lib/db";
import type { PaypayPayment } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";
import { UserFactory } from "../../../factory/user";

type PaypayPaymentKeys = keyof PaypayPayment;
const paypayPaymentKeys: PaypayPaymentKeys[] = ["id", "user_id", "merchant_payment_id"];

let testMerchantPaymentId: string;
let user: UserFactory;

const setUpUser = async (withPaypayPayment: boolean) => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: withPaypayPayment
      ? {
          value: { merchant_payment_id: `${crypto.randomUUID().split("-")[0]}` },
        }
      : undefined,
  });
};

describe("PaypayPaymentsテーブルのトランザクションに関するテスト", () => {
  beforeEach(async () => {
    testMerchantPaymentId = `${crypto.randomUUID().split("-")[0]}`;
    user = await setUpUser(false);
  });

  it("トランザクション内でエラーが発生しない場合、Paypay決済レコードが作成されること", async () => {
    const paypayPayment = await executeTransaction(async (client) => {
      return await createPaypayPaymentWithTransaction(client, {
        user_id: user.id,
        merchant_payment_id: testMerchantPaymentId,
      });
    });
    expect(paypayPayment.id).not.toBeNull();
    expect(paypayPayment.user_id).toBe(user.id);
    expect(Object.keys(paypayPayment)).toEqual(expect.arrayContaining(paypayPaymentKeys));
  });

  it("トランザクション内でエラーが発生した場合、Paypay決済レコードが作成されないこと", async () => {
    await executeTransaction(async (client) => {
      await createPaypayPaymentWithTransaction(client, {
        user_id: user.id,
        merchant_payment_id: testMerchantPaymentId,
      });

      throw new Error("トランザクション内でエラーが発生しました");
    })
      .catch((error) => {
        expect(error).toBeDefined();
      })
      .finally(async () => {
        const paypayPayment = await findPaypayPaymentByMerchantPaymentId(testMerchantPaymentId);
        expect(paypayPayment).toBeNull();
      });
  });
});
