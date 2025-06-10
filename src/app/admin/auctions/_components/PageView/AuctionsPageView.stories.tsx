import Badge from "@/components/Badge";
import { mockAuctionData } from "@/mocks/data";
import { AuctionStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs";
import AuctionsPageView from "./AuctionsPageView";

const meta = {
  title: "Admin/Auctions",
  component: AuctionsPageView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuctionsPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

const getStatusBadge = (status: number) => {
  switch (status) {
    case AuctionStatus.DRAFT:
      return <Badge text="下書き" color="gray" />;
    case AuctionStatus.ACTIVE:
      return <Badge text="開催中" color="green" />;
    case AuctionStatus.FINISHED:
      return <Badge text="終了" color="blue" />;
    case AuctionStatus.CANCELLED:
      return <Badge text="キャンセル" color="red" />;
    default:
      return <Badge text="不明" color="gray" />;
  }
};

export const Default: Story = {
  args: {
    auctions: mockAuctionData,
    isLoading: false,
    error: null,
    getStatusBadge,
  },
};

export const Loading: Story = {
  args: {
    auctions: [],
    isLoading: true,
    error: null,
    getStatusBadge,
  },
};

export const Empty: Story = {
  args: {
    auctions: [],
    isLoading: false,
    error: null,
    getStatusBadge,
  },
};

export const WithError: Story = {
  args: {
    auctions: [],
    isLoading: false,
    error: "オークションの取得に失敗しました。ネットワーク接続を確認してください。",
    getStatusBadge,
  },
};
