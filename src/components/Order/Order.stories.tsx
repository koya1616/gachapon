import { createPaymentDetails, createShipment, mockPaymentProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import Order from "./Order";

const meta: Meta<typeof Order> = {
  title: "Components/Order",
  component: Order,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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
