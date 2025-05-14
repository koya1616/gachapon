import { mockProducts } from "@/mocks/data";
import { AuctionStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import CreateAuctionView from "./CreateAuctionView";

const meta = {
  title: "Admin/Auctions/Create",
  component: CreateAuctionView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CreateAuctionView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    formData: {
      name: "",
      description: "",
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      paymentDeadlineAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      status: AuctionStatus.DRAFT,
      isSealed: true,
      allowBidRetraction: true,
      needPaymentInfo: true,
      productId: 0,
      minimumBid: 100,
    },
    products: mockProducts,
    loading: false,
    productLoading: false,
    error: null,
    success: false,
    handleInputChange: () => {},
    handleDateInputChange: () => {},
    handleCheckboxChange: () => {},
    handleProductChange: () => {},
    handleSubmit: async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
    },
  },
};

export const WithProductSelected: Story = {
  args: {
    ...Default.args,
    formData: {
      ...Default.args.formData,
      name: "春のレアフィギュアオークション",
      description: "2025年春の限定レアフィギュアコレクションオークション",
      productId: 1,
    },
  },
};

export const ProductLoading: Story = {
  args: {
    ...Default.args,
    productLoading: true,
  },
};

export const Submitting: Story = {
  args: {
    ...WithProductSelected.args,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    ...WithProductSelected.args,
    error: "オークションの作成に失敗しました",
  },
};

export const Success: Story = {
  args: {
    ...WithProductSelected.args,
    success: true,
  },
};

export const ActiveStatus: Story = {
  args: {
    ...WithProductSelected.args,
    formData: {
      ...WithProductSelected.args.formData,
      status: AuctionStatus.ACTIVE,
    },
  },
};
