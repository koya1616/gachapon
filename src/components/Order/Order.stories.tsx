import type { Meta, StoryObj } from "@storybook/react";
import Order from "./Order";
import type { PaypayGetCodePaymentDetailsResponse, PaypayGetCodePaymentDetailsStatus } from "@/lib/paypay";
import type { PaymentProduct, Shipment } from "@/types";

const mockPaymentProducts: PaymentProduct[] = [
  {
    id: 1,
    name: "商品1",
    price: 1000,
    image: "https://placehold.co/300x300",
    quantity: 2,
    product_id: 1,
    paypay_payment_id: 1,
  },
  {
    id: 2,
    name: "商品2",
    price: 2000,
    image: "https://placehold.co/300x300",
    quantity: 1,
    product_id: 2,
    paypay_payment_id: 1,
  },
];

const createPaymentDetails = (
  status: PaypayGetCodePaymentDetailsStatus = "COMPLETED",
  amount = 4000,
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

const createShipment = (
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

const meta: Meta<typeof Order> = {
  title: "Components/Order",
  component: Order,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    lang: {
      control: { type: "select" },
      options: ["ja", "en", "zh"],
      defaultValue: "ja",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Order>;

export const Default: Story = {
  args: {
    paymentDetails: createPaymentDetails(),
    shipment: createShipment(),
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};

export const ProcessingPayment: Story = {
  args: {
    paymentDetails: createPaymentDetails("CREATED"),
    shipment: createShipment(null),
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};

export const Delivered: Story = {
  args: {
    paymentDetails: createPaymentDetails(),
    shipment: createShipment(1620010000, 1620020000),
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};

export const Cancelled: Story = {
  args: {
    paymentDetails: createPaymentDetails("CANCELED"),
    shipment: createShipment(null, null, 1620020000),
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};

export const PaymentFailed: Story = {
  args: {
    paymentDetails: createPaymentDetails("FAILED"),
    shipment: createShipment(null, null, null, 1620020000),
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};

export const NoShipment: Story = {
  args: {
    paymentDetails: createPaymentDetails(),
    shipment: null,
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};

export const NoPaymentDetails: Story = {
  args: {
    paymentDetails: null,
    shipment: createShipment(),
    paymentProducts: mockPaymentProducts,
    lang: "ja",
  },
};
