import type { ShipmentStatus } from "@/lib/db/shipments/query";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { ShipmentStatusActionsView } from "./ShipmentStatusActions";

const statusConfigs: Record<
  ShipmentStatus,
  {
    type: ShipmentStatus;
    label: string;
    color: "blue" | "gray" | "red" | "green";
  }
> = {
  shipped: {
    type: "shipped",
    label: "発送済みにする",
    color: "blue",
  },
  delivered: {
    type: "delivered",
    label: "配達済みにする",
    color: "green",
  },
  payment_failed: {
    type: "payment_failed",
    label: "決済失敗にする",
    color: "red",
  },
  cancelled: {
    type: "cancelled",
    label: "キャンセルする",
    color: "gray",
  },
};

const meta = {
  title: "Admin/Components/ShipmentStatusActions",
  component: ShipmentStatusActionsView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShipmentStatusActionsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    showShipped: true,
    showDelivered: false,
    showPaymentFailed: true,
    showCancelled: true,
    statusConfigs,
    updateStatus: async (status: ShipmentStatus) => console.log(`Status updated to: ${status}`),
  },
};

export const ShippedState: Story = {
  args: {
    isLoading: false,
    showShipped: false,
    showDelivered: true,
    showPaymentFailed: false,
    showCancelled: false,
    statusConfigs,
    updateStatus: async (status: ShipmentStatus) => console.log(`Status updated to: ${status}`),
  },
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    showShipped: true,
    showDelivered: false,
    showPaymentFailed: true,
    showCancelled: true,
    statusConfigs,
    updateStatus: async (status: ShipmentStatus) => console.log(`Status updated to: ${status}`),
  },
};

export const DeliveredState: Story = {
  args: {
    isLoading: false,
    showShipped: false,
    showDelivered: false,
    showPaymentFailed: false,
    showCancelled: false,
    statusConfigs,
    updateStatus: async (status: ShipmentStatus) => console.log(`Status updated to: ${status}`),
  },
};

export const PaymentFailedState: Story = {
  args: {
    isLoading: false,
    showShipped: false,
    showDelivered: false,
    showPaymentFailed: false,
    showCancelled: false,
    statusConfigs,
    updateStatus: async (status: ShipmentStatus) => console.log(`Status updated to: ${status}`),
  },
};

export const CancelledState: Story = {
  args: {
    isLoading: false,
    showShipped: false,
    showDelivered: false,
    showPaymentFailed: false,
    showCancelled: false,
    statusConfigs,
    updateStatus: async (status: ShipmentStatus) => console.log(`Status updated to: ${status}`),
  },
};
