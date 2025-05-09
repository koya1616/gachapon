import { createOrder } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import AccountPageView from "./AccountPageView";

const meta = {
  title: "Components/Account/Page",
  component: AccountPageView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoOrders: Story = {
  args: {
    orders: [],
    l: "ja",
  },
};

export const WithOrders: Story = {
  args: {
    orders: [
      createOrder(),
      createOrder("2023-01-02T00:00:00.000Z"),
      createOrder("2023-01-02T00:00:00.000Z", "2023-01-03T00:00:00.000Z"),
      createOrder(null, null, "2023-01-04T00:00:00.000Z"),
      createOrder(null, null, null, "2023-01-05T00:00:00.000Z"),
    ],
    l: "ja",
  },
};
