import { createOrder } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import OrderStatusBadge from "./OrderStatusBadge";

const meta = {
  title: "Components/OrderStatusBadge",
  component: OrderStatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OrderStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Processing: Story = {
  args: {
    order: createOrder(),
    lang: "ja",
  },
};

export const Shipped: Story = {
  args: {
    order: createOrder("2023-01-02T00:00:00.000Z"),
    lang: "ja",
  },
};

export const Delivered: Story = {
  args: {
    order: createOrder("2023-01-02T00:00:00.000Z", "2023-01-03T00:00:00.000Z"),
    lang: "ja",
  },
};

export const PaymentFailed: Story = {
  args: {
    order: createOrder(null, null, null, "2023-01-02T00:00:00.000Z"),
    lang: "ja",
  },
};

export const Cancelled: Story = {
  args: {
    order: createOrder(null, null, "2023-01-02T00:00:00.000Z"),
    lang: "ja",
  },
};
