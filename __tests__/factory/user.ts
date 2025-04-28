import { createPaymentProducts, createPaypayPayment, createShipment, createUser } from "@/lib/db";
import type { PaymentProduct, PaypayPayment, Shipment } from "@/types";
import { ProductFactory } from "./product";

export class UserFactory {
  id: number;
  email: string;
  paypayPayment: PaypayPayment | null;
  shipment: Shipment | null;
  paymentProduct: PaymentProduct[] | null;

  constructor(email: string, id?: number) {
    this.id = id || 0;
    this.email = email;
    this.paypayPayment = null;
    this.shipment = null;
    this.paymentProduct = null;
  }

  public static async create(
    email?: string,
    options?: {
      paypayPayment?: {
        value: Pick<PaypayPayment, "merchant_payment_id">;
        options?: {
          withShipment?: boolean;
          withPaymentProduct?: boolean;
        };
      };
    },
  ): Promise<UserFactory> {
    const user = await createUser(email || `${crypto.randomUUID().split("-")[0]}@example.com`);
    const factory = new UserFactory(user.email, user.id);
    if (options?.paypayPayment) {
      factory.paypayPayment = await createPaypayPayment({ ...options.paypayPayment.value, user_id: factory.id });

      if (options.paypayPayment.options?.withShipment) {
        factory.shipment = await createShipment({
          paypay_payment_id: factory.paypayPayment?.id as number,
          address: "123 Test St",
        });
      }

      if (options.paypayPayment.options?.withPaymentProduct) {
        const product = await ProductFactory.create();
        factory.paymentProduct = await createPaymentProducts([
          {
            paypay_payment_id: factory.paypayPayment?.id as number,
            quantity: 1,
            price: 100,
            product_id: product.id,
          },
        ]);
      }
    }
    return factory;
  }
}
