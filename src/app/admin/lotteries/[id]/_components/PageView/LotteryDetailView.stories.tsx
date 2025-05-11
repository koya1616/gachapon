import Badge from "@/components/Badge";
import { LotteryProducts, mockLotteryEvents, mockProducts } from "@/mocks/data";
import { LotteryStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import LotteryDetailView from "./LotteryDetailView";

const meta: Meta<typeof LotteryDetailView> = {
  title: "Admin/Lotteries/id",
  component: LotteryDetailView,
};

export default meta;
type Story = StoryObj<typeof LotteryDetailView>;

const getStatusBadge = (status: number) => {
  switch (status) {
    case LotteryStatus.DRAFT:
      return <Badge text="下書き" color="gray" />;
    case LotteryStatus.ACTIVE:
      return <Badge text="実施中" color="green" />;
    case LotteryStatus.FINISHED:
      return <Badge text="終了" color="blue" />;
    case LotteryStatus.CANCELLED:
      return <Badge text="キャンセル" color="red" />;
    default:
      return <Badge text="不明" color="gray" />;
  }
};

export const Default: Story = {
  args: {
    lottery: mockLotteryEvents[0],
    products: mockProducts,
    loading: false,
    error: null,
    getStatusBadge,
  },
};

export const EmptyProduct: Story = {
  args: {
    lottery: mockLotteryEvents[0],
    products: [],
    loading: false,
    error: null,
    getStatusBadge,
  },
};

export const Loading: Story = {
  args: {
    lottery: null,
    products: [],
    loading: true,
    error: null,
    getStatusBadge,
  },
};

export const NotSuccess: Story = {
  args: {
    lottery: null,
    products: [],
    loading: false,
    error: "抽選情報の取得中にエラーが発生しました。",
    getStatusBadge,
  },
};

export const Empty: Story = {
  args: {
    lottery: null,
    products: [],
    loading: false,
    error: null,
    getStatusBadge,
  },
};
