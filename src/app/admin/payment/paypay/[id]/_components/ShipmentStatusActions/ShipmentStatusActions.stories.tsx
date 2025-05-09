import type { Meta, StoryObj } from "@storybook/react";
import { ShipmentStatusActionsView } from "./ShipmentStatusActions";
import type { ShipmentStatus } from "@/lib/db/shipments/query";

const statusConfigs: Record<
  ShipmentStatus,
  {
    type: ShipmentStatus;
    label: string;
    bgColor: string;
    hoverColor: string;
    disabledColor: string;
  }
> = {
  shipped: {
    type: "shipped",
    label: "発送済みにする",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    disabledColor: "disabled:bg-blue-300",
  },
  delivered: {
    type: "delivered",
    label: "配達済みにする",
    bgColor: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    disabledColor: "disabled:bg-green-300",
  },
  payment_failed: {
    type: "payment_failed",
    label: "決済失敗にする",
    bgColor: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    disabledColor: "disabled:bg-red-300",
  },
  cancelled: {
    type: "cancelled",
    label: "キャンセルする",
    bgColor: "bg-gray-600",
    hoverColor: "hover:bg-gray-700",
    disabledColor: "disabled:bg-gray-300",
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
