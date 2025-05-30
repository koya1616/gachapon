import type { PaypayGetCodePaymentDetailsResponse, PaypayGetCodePaymentDetailsStatus } from "@/lib/paypay";
import type { Address, Auction, LotteryEntry, LotteryProduct, Order, PaymentProduct, Product, Shipment } from "@/types";
import { AuctionStatus, type LotteryEvent, LotteryStatus } from "@/types";

export const mockFile = new File(["dummy content"], "test-image.png", { type: "image/png" });

export const mockLotteryEvents: LotteryEvent[] = [
  {
    id: 1,
    name: "春のパン祭り",
    description: "2025年春の限定パンコレクション抽選会",
    start_at: new Date("2025-05-01T00:00:00").getTime(),
    end_at: new Date("2025-05-15T23:59:59").getTime(),
    result_at: new Date("2025-05-20T12:00:00").getTime(),
    payment_deadline_at: new Date("2025-05-27T23:59:59").getTime(),
    created_at: new Date("2025-04-15T10:00:00").getTime(),
    status: LotteryStatus.ACTIVE,
  },
  {
    id: 2,
    name: "夏のガチャフェスタ",
    description: "夏限定のガチャポンコレクション",
    start_at: new Date("2025-07-01T00:00:00").getTime(),
    end_at: new Date("2025-07-31T23:59:59").getTime(),
    result_at: new Date("2025-08-05T12:00:00").getTime(),
    payment_deadline_at: new Date("2025-08-12T23:59:59").getTime(),
    created_at: new Date("2025-06-15T09:30:00").getTime(),
    status: LotteryStatus.DRAFT,
  },
  {
    id: 3,
    name: "秋の特別抽選会",
    description: "秋の新商品発売記念抽選会",
    start_at: new Date("2025-04-01T00:00:00").getTime(),
    end_at: new Date("2025-04-30T23:59:59").getTime(),
    result_at: new Date("2025-05-05T12:00:00").getTime(),
    payment_deadline_at: new Date("2025-05-12T23:59:59").getTime(),
    created_at: new Date("2025-03-15T14:20:00").getTime(),
    status: LotteryStatus.FINISHED,
  },
  {
    id: 4,
    name: "冬のスペシャルコレクション",
    description: "冬季限定レアアイテム抽選会",
    start_at: new Date("2024-12-01T00:00:00").getTime(),
    end_at: new Date("2024-12-25T23:59:59").getTime(),
    result_at: new Date("2024-12-28T12:00:00").getTime(),
    payment_deadline_at: new Date("2025-01-10T23:59:59").getTime(),
    created_at: new Date("2024-11-15T11:00:00").getTime(),
    status: LotteryStatus.CANCELLED,
  },
];

export const mockLotteryProducts: LotteryProduct[] = [
  {
    id: 1,
    lottery_event_id: 1,
    product_id: 1,
    quantity_available: 10,
    created_at: new Date("2025-04-01T00:00:00").getTime(),
  },
  {
    id: 2,
    lottery_event_id: 1,
    product_id: 2,
    quantity_available: 5,
    created_at: new Date("2025-04-02T00:00:00").getTime(),
  },
];

export const mockCartContext = {
  cart: [],
  isCartOpen: false,
  totalPrice: 0,
  add_to_cart: (product: Product) => console.log("add_to_cart", product),
  removeFromCart: (productId: number) => console.log("removeFromCart", productId),
  updateQuantity: (productId: number, quantity: number) => console.log("updateQuantity", productId, quantity),
  clear_cart: () => console.log("clear_cart"),
  toggleCart: () => console.log("toggleCart"),
  closeCart: () => console.log("closeCart"),
};

export const mockAddressFormData: Address = {
  id: 1,
  user_id: 1,
  name: "John Doe",
  country: "JP",
  postal_code: "123-4567",
  address: "Tokyo, Japan",
};

export const mockEmptyAddressFormData: Address = {
  id: 0,
  user_id: 0,
  name: "",
  country: "",
  postal_code: "",
  address: "",
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "ガチャポン - ドラゴンシリーズ",
    price: 500,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 100,
  },
  {
    id: 2,
    name: "ガチャポン - 猫フィギュア",
    price: 400,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 50,
  },
  {
    id: 3,
    name: "ガチャポン - 恐竜コレクション",
    price: 600,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 30,
  },
  {
    id: 4,
    name: "ガチャポン - 食品サンプル",
    price: 300,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 0,
  },
  {
    id: 5,
    name: "ガチャポン - スポーツカー",
    price: 800,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 2,
  },
];

export const mockPaymentProducts: PaymentProduct[] = [
  {
    id: 1,
    name: "ガチャポン - ドラゴンシリーズ",
    price: 500,
    image: "https://placehold.co/300x300",
    quantity: 2,
    product_id: 1,
    paypay_payment_id: 1,
  },
  {
    id: 2,
    name: "ガチャポン - 猫フィギュア",
    price: 400,
    image: "https://placehold.co/300x300",
    quantity: 1,
    product_id: 2,
    paypay_payment_id: 1,
  },
];

export const createPaymentDetails = (
  status: PaypayGetCodePaymentDetailsStatus = "COMPLETED",
  amount = 1400,
  requestedAt = 1630000000,
  acceptedAt = 1640001000,
): PaypayGetCodePaymentDetailsResponse => ({
  data: {
    status,
    amount: { amount },
    requestedAt,
    acceptedAt,
  },
});

export const createShipment = (
  shipped_at: number | null = 1620010000,
  delivered_at: number | null = null,
  cancelled_at: number | null = null,
  payment_failed_at: number | null = null,
): Shipment => ({
  id: 1,
  paypay_payment_id: 1,
  address: "東京都渋谷区神南1-1-1",
  created_at: 1620000000,
  shipped_at,
  delivered_at,
  cancelled_at,
  payment_failed_at,
});

export const createOrder = (
  shipped_at: string | null = null,
  delivered_at: string | null = null,
  cancelled_at: string | null = null,
  payment_failed_at: string | null = null,
): Order => ({
  user_id: 1,
  merchant_payment_id: "test_payment_id",
  paypay_payment_id: 1,
  address: "東京都渋谷区神南1-1-1",
  created_at: "2023-01-01T00:00:00.000Z",
  shipped_at,
  delivered_at,
  cancelled_at,
  payment_failed_at,
});

export const mockAuctionData: Auction[] = [
  {
    id: 1,
    name: "プレミアムフィギュアオークション",
    description: "限定版コレクターズアイテム",
    start_at: new Date("2025-06-01T00:00:00").getTime(),
    end_at: new Date("2025-06-15T23:59:59").getTime(),
    payment_deadline_at: new Date("2025-06-22T23:59:59").getTime(),
    status: 1,
    is_sealed: false,
    allow_bid_retraction: true,
    need_payment_info: true,
    created_at: new Date("2025-05-01T10:00:00").getTime(),
    product_id: 1,
    minimum_bid: 1000,
  },
  {
    id: 2,
    name: "レアカードオークション",
    description: "希少トレーディングカードのセット",
    start_at: new Date("2025-07-01T00:00:00").getTime(),
    end_at: new Date("2025-07-10T23:59:59").getTime(),
    payment_deadline_at: new Date("2025-07-17T23:59:59").getTime(),
    status: 0,
    is_sealed: true,
    allow_bid_retraction: false,
    need_payment_info: true,
    created_at: new Date("2025-06-01T14:30:00").getTime(),
    product_id: 2,
    minimum_bid: 2000,
  },
];

export const mockAuction = {
  id: 1,
  name: "レアアイテムオークション",
  description: "希少なコレクターズアイテムの特別オークションです。\n期間限定で開催します。",
  start_at: Date.now() - 86400000,
  end_at: Date.now() + 172800000,
  payment_deadline_at: Date.now() + 432000000,
  status: AuctionStatus.ACTIVE,
  is_sealed: true,
  allow_bid_retraction: false,
  need_payment_info: true,
  created_at: Date.now() - 604800000,
  product_id: 1,
  minimum_bid: 3000,
};

export const mockBids = [
  {
    id: 1,
    auction_id: 1,
    user_id: 101,
    amount: 55000,
    created_at: Date.now() - 43200000,
  },
  {
    id: 2,
    auction_id: 1,
    user_id: 102,
    amount: 60000,
    created_at: Date.now() - 21600000,
  },
  {
    id: 3,
    auction_id: 1,
    user_id: 103,
    amount: 52000,
    created_at: Date.now() - 64800000,
  },
];

export const mockLotteryEntries: LotteryEntry[] = [
  {
    id: 1,
    user_id: 111,
    lottery_event_id: 1,
    lottery_product_id: 123,
    result: 0,
    created_at: Date.now(),
  },
];
