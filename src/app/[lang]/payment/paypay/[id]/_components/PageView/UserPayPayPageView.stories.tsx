import { createPaymentDetails, createShipment, mockPaymentProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import UserPayPayPageView from "./UserPayPayPageView";

const meta: Meta<typeof UserPayPayPageView> = {
  title: "Pages/Payment/PayPay/id",
  component: UserPayPayPageView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof UserPayPayPageView>;

export const Default: Story = {
  args: {
    paymentDetails: createPaymentDetails(),
    shipment: createShipment(),
    paymentProducts: mockPaymentProducts,
    l: "ja",
  },
};

export const ProcessingPayment: Story = {
  args: {
    paymentDetails: createPaymentDetails("CREATED"),
    shipment: createShipment(null),
    paymentProducts: mockPaymentProducts,
    l: "ja",
  },
};

export const Delivered: Story = {
  args: {
    paymentDetails: createPaymentDetails(),
    shipment: createShipment(1620010000, 1620020000),
    paymentProducts: mockPaymentProducts,
    l: "ja",
  },
};

export const Cancelled: Story = {
  args: {
    paymentDetails: createPaymentDetails("CANCELED"),
    shipment: createShipment(null, null, 1620020000),
    paymentProducts: mockPaymentProducts,
    l: "ja",
  },
};
