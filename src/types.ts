export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
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
