import { createLotteryEntry, createLotteryEvent, createLotteryProducts } from "@/lib/db";
import type { LotteryEntry, LotteryProduct } from "@/types";
import { ProductFactory } from "./product";
import { UserFactory } from "./user";

export class LotteryEventFactory {
  id: number;
  name: string;
  description: string;
  start_at: number;
  end_at: number;
  result_at: number;
  payment_deadline_at: number;
  status: number;
  created_at: number;
  lotteryProducts: LotteryProduct[] | null;
  lotteryEntries: LotteryEntry[] | null;

  constructor(
    name: string,
    description: string,
    start_at: number,
    end_at: number,
    result_at: number,
    payment_deadline_at: number,
    status: number,
  ) {
    this.id = 0;
    this.name = name;
    this.description = description;
    this.start_at = start_at;
    this.end_at = end_at;
    this.result_at = result_at;
    this.payment_deadline_at = payment_deadline_at;
    this.status = status;
    this.created_at = Date.now();
    this.lotteryProducts = null;
    this.lotteryEntries = null;
  }

  public static async create(
    name?: string,
    description?: string,
    start_at?: number,
    end_at?: number,
    result_at?: number,
    payment_deadline_at?: number,
    status?: number,
    options?: {
      lotteryProducts?: {
        value: Partial<Pick<LotteryProduct, "product_id" | "quantity_available">>[];
        options?: {
          withLotteryEntries?: boolean;
        };
      };
    },
  ): Promise<LotteryEventFactory> {
    const now = Date.now();
    const lotteryEvent = await createLotteryEvent({
      name: name || "抽選イベント1",
      description: description || "抽選イベントの説明",
      start_at: start_at || now,
      end_at: end_at || now + 86400000,
      result_at: result_at || now + 172800000,
      payment_deadline_at: payment_deadline_at || now + 259200000,
      status: status || 0,
    });
    const factory = new LotteryEventFactory(
      lotteryEvent.name,
      lotteryEvent.description || "",
      lotteryEvent.start_at,
      lotteryEvent.end_at,
      lotteryEvent.result_at,
      lotteryEvent.payment_deadline_at,
      lotteryEvent.status,
    );
    factory.id = lotteryEvent.id;
    factory.created_at = lotteryEvent.created_at;

    if (options?.lotteryProducts) {
      const product = await ProductFactory.create();
      factory.lotteryProducts = await createLotteryProducts(
        options.lotteryProducts.value.map((lotteryProduct) => ({
          lottery_event_id: factory.id,
          product_id: lotteryProduct.product_id || product.id,
          quantity_available: lotteryProduct.quantity_available || 1,
        })),
      );

      if (options.lotteryProducts.options?.withLotteryEntries) {
        const user = await UserFactory.create();
        const lotteryEntry = await createLotteryEntry(factory.id, user.id, factory.lotteryProducts[0].id);
        factory.lotteryEntries = [lotteryEntry];
      }
    }

    return factory;
  }
}
