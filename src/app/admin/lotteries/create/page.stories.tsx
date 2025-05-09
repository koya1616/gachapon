import { mockProducts } from "@/mocks/data";
import { LotteryStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import CreateLotteryView from "./_components/PageView";

const meta = {
  title: "Admin/Lotteries/Create",
  component: CreateLotteryView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CreateLotteryView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    formData: {
      name: "",
      description: "",
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      resultAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      paymentDeadlineAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      status: LotteryStatus.DRAFT,
    },
    products: mockProducts,
    selectedProducts: [],
    loading: false,
    productLoading: false,
    error: null,
    success: false,
    handleInputChange: () => {},
    handleDateInputChange: () => {},
    handleAddProduct: () => {},
    handleRemoveProduct: () => {},
    handleProductChange: () => {},
    handleSubmit: async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
    },
  },
};

export const WithSelectedProducts: Story = {
  args: {
    ...Default.args,
    formData: {
      ...Default.args.formData,
      name: "春のパン祭り",
      description: "2025年春の限定パンコレクション抽選会",
    },
    selectedProducts: [
      { id: "1", productId: 1, quantity: 5 },
      { id: "2", productId: 2, quantity: 3 },
    ],
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
    ...WithSelectedProducts.args,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    ...WithSelectedProducts.args,
    error: "抽選の作成に失敗しました",
  },
};

export const Success: Story = {
  args: {
    ...WithSelectedProducts.args,
    success: true,
  },
};

export const ActiveStatus: Story = {
  args: {
    ...WithSelectedProducts.args,
    formData: {
      ...WithSelectedProducts.args.formData,
      status: LotteryStatus.ACTIVE,
    },
  },
};
