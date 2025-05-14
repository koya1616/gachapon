export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number; // DBのカラムには存在しない。
  stock_quantity: number;
};

export type Lang = "en" | "ja" | "zh";

export type User = {
  id: number;
  email: string;
};

export type Address = {
  id: number;
  user_id: number;
  name: string;
  country: string;
  postal_code: string;
  address: string;
};

export type PaypayPayment = {
  id: number;
  user_id: number;
  merchant_payment_id: string;
};

export type Shipment = {
  id: number;
  paypay_payment_id: number;
  address: string;
  shipped_at: number | null;
  delivered_at: number | null;
  payment_failed_at: number | null;
  cancelled_at: number | null;
  created_at: number;
};

export type Order = {
  user_id: number;
  merchant_payment_id: string;
  paypay_payment_id: number;
  address: string;
  shipped_at: string | null;
  delivered_at: string | null;
  payment_failed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

export type PaymentProduct = {
  id: number;
  paypay_payment_id: number | null;
  quantity: number;
  price: number;
  product_id: number;
  name: string;
  image: string;
};

export type LotteryEvent = {
  id: number;
  name: string;
  description: string | null;
  start_at: number;
  end_at: number;
  result_at: number;
  payment_deadline_at: number;
  created_at: number;
  status: number;
};

export type LotteryProduct = {
  id: number;
  lottery_event_id: number;
  product_id: number;
  quantity_available: number;
  created_at: number;
};

export type LotteryEntry = {
  id: number;
  user_id: number;
  lottery_event_id: number;
  lottery_product_id: number;
  result: number;
  created_at: number;
};

export enum LotteryStatus {
  DRAFT = 0,
  ACTIVE = 1,
  FINISHED = 2,
  CANCELLED = 3,
}

export enum LotteryEntryResult {
  PROCESSING = 0,
  WIN = 1,
  LOSE = 2,
}

// TODO: 最低金額カラムを追加
export type Auction = {
  id: number;
  name: string;
  description: string;
  start_at: number;
  end_at: number;
  payment_deadline_at: number;
  status: number;
  is_sealed: boolean;
  allow_bid_retraction: boolean;
  need_payment_info: boolean;
  created_at: number;
  product_id: number;
};

export enum AuctionStatus {
  DRAFT = 0,
  ACTIVE = 1,
  FINISHED = 2,
  CANCELLED = 3,
}

export type SealedBid = {
  id: number;
  auction_id: number;
  user_id: number;
  amount: number;
  created_at: number;
};
