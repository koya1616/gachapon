import type { Meta, StoryObj } from "@storybook/react";
import { LotteriesPageView } from "./page";
import { mockLotteryEvents } from "@/mocks/data";
import { LotteryStatus } from "@/types";

const meta = {
  title: "Admin/Lotteries/List",
  component: LotteriesPageView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LotteriesPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

const getStatusBadge = (status: number) => {
  switch (status) {
    case LotteryStatus.DRAFT:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          下書き
        </span>
      );
    case LotteryStatus.ACTIVE:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          実施中
        </span>
      );
    case LotteryStatus.FINISHED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          終了
        </span>
      );
    case LotteryStatus.CANCELLED:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          キャンセル
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          不明
        </span>
      );
  }
};

export const Default: Story = {
  args: {
    lotteries: mockLotteryEvents,
    loading: false,
    getStatusBadge,
  },
};

export const Loading: Story = {
  args: {
    lotteries: [],
    loading: true,
    getStatusBadge,
  },
};

export const Empty: Story = {
  args: {
    lotteries: [],
    loading: false,
    getStatusBadge,
  },
};
