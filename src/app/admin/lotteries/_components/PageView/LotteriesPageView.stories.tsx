import Badge from "@/components/Badge";
import { mockLotteryEvents } from "@/mocks/data";
import { LotteryStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs";
import LotteriesPageView from ".";

const meta = {
  title: "Admin/Lotteries",
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
