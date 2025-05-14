import { AuctionStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import EditAuctionView from "./EditAuctionView";

const meta: Meta<typeof EditAuctionView> = {
  title: "Admin/Auctions/Edit",
  component: EditAuctionView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EditAuctionView>;

const mockFormData = {
  id: 1,
  name: "春の特別オークション",
  description: "希少なコレクターズアイテムを出品する特別オークションです。",
  startAt: "2023-03-01T10:00",
  endAt: "2023-03-15T18:00",
  paymentDeadlineAt: "2023-03-20T18:00",
  status: AuctionStatus.ACTIVE,
  isSealed: true,
  allowBidRetraction: false,
  needPaymentInfo: true,
  productId: 1,
  minimumBid: 100,
};

const mockProducts = [
  {
    id: 1,
    name: "限定フィギュア",
    price: 25000,
    image: "https://via.placeholder.com/300",
    quantity: 1,
    stock_quantity: 1,
  },
  {
    id: 2,
    name: "ヴィンテージカメラ",
    price: 150000,
    image: "https://via.placeholder.com/300",
    quantity: 1,
    stock_quantity: 1,
  },
];

export const Default: Story = {
  args: {
    formData: mockFormData,
    products: mockProducts,
    loading: false,
    error: null,
    success: false,
    handleInputChange: () => {},
    handleDateInputChange: () => {},
    handleCheckboxChange: () => {},
    handleProductChange: () => {},
    handleSubmit: async (e) => {
      e.preventDefault();
      console.log("Form submitted");
      return Promise.resolve();
    },
    getStatusBadge: (status) => {
      switch (status) {
        case AuctionStatus.DRAFT:
          return <span className="bg-gray-200 px-2 py-1 rounded text-xs">下書き</span>;
        case AuctionStatus.ACTIVE:
          return <span className="bg-green-200 px-2 py-1 rounded text-xs">開催中</span>;
        case AuctionStatus.FINISHED:
          return <span className="bg-blue-200 px-2 py-1 rounded text-xs">終了</span>;
        case AuctionStatus.CANCELLED:
          return <span className="bg-red-200 px-2 py-1 rounded text-xs">キャンセル</span>;
        default:
          return <span className="bg-gray-200 px-2 py-1 rounded text-xs">不明</span>;
      }
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "エラーが発生しました。入力内容を確認してください。",
  },
};

export const Success: Story = {
  args: {
    ...Default.args,
    success: true,
  },
};
