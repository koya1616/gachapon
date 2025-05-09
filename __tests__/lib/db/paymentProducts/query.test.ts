import {
  createPaymentProducts,
  findPaymentProductByPaypayPaymentIdAndProductId,
  getPaymentProductsByPaypayPaymentId,
} from "@/lib/db";
import type { PaymentProduct } from "@/types";
import { beforeAll, describe, expect, it } from "vitest";
import { UserFactory } from "../../../factory/user";

let user: UserFactory;

const setUpUser = async () => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: {
      value: { merchant_payment_id: `${crypto.randomUUID().split("-")[0]}` },
      options: { withPaymentProduct: true },
    },
  });
};

type PaymentProductKeys = keyof PaymentProduct;
const typeKeys: PaymentProductKeys[] = ["id", "paypay_payment_id", "quantity", "price", "product_id", "name", "image"];

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
      expect(Object.keys(result[0])).toEqual(
        expect.arrayContaining(["id", "paypay_payment_id", "quantity", "price", "product_id"]),
      );
    });
  });

  describe("getPaymentProductsByPaypayPaymentId", () => {
    beforeAll(async () => {
      user = await setUpUser();
    });

    it("Paypay Payment IDが存在する場合、決済商品レコードが取得できること", async () => {
      const result = await getPaymentProductsByPaypayPaymentId(user.paypayPayment?.id as number);
      const paymentProduct = user.paymentProduct?.find(
        (product) => product.paypay_payment_id === user.paypayPayment?.id,
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).not.toBeNull();
      expect(result[0].paypay_payment_id).toBe(user.paypayPayment?.id);
      expect(result[0].quantity).toBe(1);
      expect(result[0].price).toBe(100);
      expect(result[0].product_id).toBe(paymentProduct?.product_id);
      expect(Object.keys(result[0])).toEqual(expect.arrayContaining(typeKeys));
    });

    it("Paypay Payment IDが存在しない場合、空の配列が返されること", async () => {
      const result = await getPaymentProductsByPaypayPaymentId(99999999);
      expect(result).toHaveLength(0);
    });
  });

  describe("findPaymentProductByPaypayPaymentIdAndProductId", () => {
    beforeAll(async () => {
      user = await setUpUser();
    });

    it("Paypay Payment IDとProduct IDが一致する場合、決済商品レコードが取得できること", async () => {
      const paymentProduct = user.paymentProduct?.find(
        (product) => product.paypay_payment_id === user.paypayPayment?.id,
      );
      const result = await findPaymentProductByPaypayPaymentIdAndProductId(
        user.paypayPayment?.id as number,
        paymentProduct?.product_id as number,
      );
      expect(result).toBeTruthy();
      expect(result?.id).not.toBeNull();
      expect(result?.paypay_payment_id).toBe(user.paypayPayment?.id);
      expect(result?.quantity).toBe(1);
      expect(result?.price).toBe(100);
      expect(result?.product_id).toBe(paymentProduct?.product_id);
      expect(Object.keys(result as PaymentProduct)).toEqual(
        expect.arrayContaining(["id", "paypay_payment_id", "quantity", "price", "product_id"]),
      );
    });
  });
});
