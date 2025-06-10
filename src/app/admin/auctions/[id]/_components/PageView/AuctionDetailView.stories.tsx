import { mockAuction, mockBids, mockProducts } from "@/mocks/data";
import { AuctionStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs";
import AuctionDetailView from "./AuctionDetailView";

const meta: Meta<typeof AuctionDetailView> = {
  title: "Admin/Auctions/id",
  tags: ["autodocs"],
  component: AuctionDetailView,
};

export default meta;
type Story = StoryObj<typeof AuctionDetailView>;

const getStatusBadge = (status: AuctionStatus) => {
  const badges = {
    [AuctionStatus.DRAFT]: <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded">下書き</div>,
    [AuctionStatus.ACTIVE]: <div className="bg-green-100 text-green-800 px-2 py-1 rounded">実施中</div>,
    [AuctionStatus.FINISHED]: <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">終了</div>,
    [AuctionStatus.CANCELLED]: <div className="bg-red-100 text-red-800 px-2 py-1 rounded">キャンセル</div>,
  };
  return badges[status] || <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded">不明</div>;
};

export const Default: Story = {
  args: {
    auction: mockAuction,
    product: mockProducts[0],
    bids: mockBids,
    loading: false,
    error: null,
    getStatusBadge,
    tabs: ["基本情報", "入札状況"],
    activeTab: "基本情報",
    setActiveTab: () => {},
  },
};

export const BidTab: Story = {
  args: {
    auction: mockAuction,
    product: mockProducts[0],
    bids: mockBids,
    loading: false,
    error: null,
    getStatusBadge,
    tabs: ["基本情報", "入札状況"],
    activeTab: "入札状況",
    setActiveTab: () => {},
  },
};

export const Loading: Story = {
  args: {
    auction: null,
    product: null,
    bids: [],
    loading: true,
    error: null,
    getStatusBadge,
    tabs: ["基本情報", "入札状況"],
    activeTab: "基本情報",
    setActiveTab: () => {},
  },
};

export const NotSuccess: Story = {
  args: {
    auction: null,
    product: null,
    bids: [],
    loading: false,
    error: "オークションデータの取得に失敗しました。",
    getStatusBadge,
    tabs: ["基本情報", "入札状況"],
    activeTab: "基本情報",
    setActiveTab: () => {},
  },
};
