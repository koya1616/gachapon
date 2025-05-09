import {
  createPaymentProductsWithTransaction,
  executeTransaction,
  findPaymentProductByPaypayPaymentIdAndProductId,
  getPaymentProductsByPaypayPaymentId,
} from "@/lib/db";
import type { PaymentProduct } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";
import { ProductFactory } from "../../../factory/product";
import { UserFactory } from "../../../factory/user";

let user: UserFactory;
let product: ProductFactory;

const setUpUser = async () => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, {
    paypayPayment: {
      value: { merchant_payment_id: `${crypto.randomUUID().split("-")[0]}` },
    },
  });
};

const setUpProduct = async () => {
  return await ProductFactory.create();
};

type PaymentProductKeys = keyof PaymentProduct;
const typeKeys: PaymentProductKeys[] = ["id", "paypay_payment_id", "quantity", "price", "product_id", "name", "image"];

describe("PaymentProductsテーブルのトランザクションに関するテスト", () => {
  describe("createPaymentProductsWithTransaction", () => {
    beforeEach(async () => {
      user = await setUpUser();
      product = await setUpProduct();
    });

    it("トランザクション内でエラーが発生しない場合、決済商品レコードが作成されること", async () => {
      const paymentProducts = await executeTransaction(async (client) => {
        return await createPaymentProductsWithTransaction(client, [
          {
            paypay_payment_id: user.paypayPayment?.id as number,
            quantity: 1,
            price: 10,
            product_id: product.id,
          },
        ]);
      });
      expect(paymentProducts).toHaveLength(1);
      expect(paymentProducts[0].id).not.toBeNull();
      expect(paymentProducts[0].paypay_payment_id).toBe(user.paypayPayment?.id);
      expect(paymentProducts[0].quantity).toBe(1);
      expect(paymentProducts[0].price).toBe(10);
      expect(paymentProducts[0].product_id).toBe(product.id);
      expect(Object.keys(paymentProducts[0])).toEqual(
        expect.arrayContaining(["id", "paypay_payment_id", "quantity", "price", "product_id"]),
      );
    });

    it("トランザクション内でエラーが発生した場合、決済商品レコードが作成されないこと", async () => {
      await executeTransaction(async (client) => {
        await createPaymentProductsWithTransaction(client, [
          {
            paypay_payment_id: user.paypayPayment?.id as number,
            quantity: 1,
            price: 10,
            product_id: product.id,
          },
        ]);

        throw new Error("トランザクション内でエラーが発生しました");
      })
        .catch((error) => {
          expect(error).toBeDefined();
        })
        .finally(async () => {
          const paymentProduct = await findPaymentProductByPaypayPaymentIdAndProductId(
            user.paypayPayment?.id as number,
            product.id,
          );
          expect(paymentProduct).toBeNull();
        });
    });
  });
});
