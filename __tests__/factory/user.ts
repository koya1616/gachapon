import { createPaypayPayment, createShipment, createUser } from "@/lib/db";
import type { PaypayPayment, Shipment } from "@/types";

export class UserFactory {
  id: number;
  email: string;
  paypayPayment: PaypayPayment | null;
  shipment: Shipment | null;

  constructor(email: string) {
    this.id = 0;
    this.email = email;
    this.paypayPayment = null;
    this.shipment = null;
  }

  public static async create(
    email?: string,
    options?: {
      paypayPayment?: {
        value: Pick<PaypayPayment, "merchant_payment_id">;
        options?: {
          withShipment?: boolean;
        };
      };
    },
  ): Promise<UserFactory> {
    const factory = new UserFactory(email || `${crypto.randomUUID().split("-")[0]}@example.com`);
    const user = await createUser(factory.email);
    factory.id = user?.id || 0;

    if (options?.paypayPayment) {
      factory.paypayPayment = await createPaypayPayment({ ...options.paypayPayment.value, user_id: factory.id });
      if (options.paypayPayment.options?.withShipment) {
        factory.shipment = await createShipment({
          paypay_payment_id: factory.paypayPayment?.id as number,
          address: "123 Test St",
        });
      }
    }
    return factory;
  }
}
