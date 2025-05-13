import Badge from "@/components/Badge";
import { mockLotteryEvents, mockProducts } from "@/mocks/data";
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

const TABS = ["基本情報", "商品一覧", "応募状況"] as const;

const baseArgs = {
  lottery: mockLotteryEvents[0],
  products: mockProducts,
  loading: false,
  error: null,
  getStatusBadge,
  tabs: TABS,
  setActiveTab: () => {},
};

export const Default: Story = {
  args: {
    ...baseArgs,
    activeTab: TABS[0],
  },
};

export const EmptyProduct: Story = {
  args: {
    ...baseArgs,
    products: [],
    activeTab: TABS[1],
  },
};

export const Product: Story = {
  args: {
    ...baseArgs,
    activeTab: TABS[1],
  },
};

export const EntryStatus: Story = {
  args: {
    ...baseArgs,
    activeTab: TABS[2],
  },
};

export const EmptyEntryStatus: Story = {
  args: {
    ...baseArgs,
    entries: [
      {
        id: 1,
        user_id: 1,
        product_id: 1,
        result: 1,
      },
    ],
    activeTab: TABS[2],
  },
};

export const Loading: Story = {
  args: {
    ...baseArgs,
    lottery: null,
    products: [],
    loading: true,
    activeTab: TABS[0],
  },
};

export const NotSuccess: Story = {
  args: {
    ...baseArgs,
    lottery: null,
    products: [],
    error: "抽選情報の取得中にエラーが発生しました。",
    activeTab: TABS[0],
  },
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    lottery: null,
    products: [],
    activeTab: TABS[0],
  },
};
