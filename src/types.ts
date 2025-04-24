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
