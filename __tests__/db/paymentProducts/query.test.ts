import { createPaymentProducts } from "@/lib/db";
import { UserFactory } from "../../factory/user";
import { beforeAll, describe, expect, it } from "vitest";

let user: UserFactory;

const setUpUser = async () => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: {
      value: { merchant_payment_id: `${crypto.randomUUID().split("-")[0]}` },
      options: { withPaymentProduct: true },
    },
  });
};

describe("PaymentProductsテーブルに関するテスト", () => {
  describe("createPaymentProducts", () => {
    beforeAll(async () => {
      user = await setUpUser();
    });

    it("決済商品レコードが作成できること", async () => {
      const result = await createPaymentProducts([
        {
          paypay_payment_id: user.paypayPayment?.id as number,
          quantity: 1,
          price: 10,
          product_id: user.paymentProduct?.[0].product_id as number,
        },
      ]);
      expect(result).toHaveLength(1);
      expect(result[0].id).not.toBeNull();
      expect(result[0].paypay_payment_id).toBe(user.paypayPayment?.id);
      expect(result[0].quantity).toBe(1);
      expect(result[0].price).toBe(10);
      expect(result[0].product_id).toBe(user.paymentProduct?.[0].product_id);
    });
  });
});
