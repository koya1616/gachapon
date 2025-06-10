import Badge from "@/components/Badge";
import { formatDateForInput } from "@/lib/date";
import { mockProducts } from "@/mocks/data";
import { LotteryStatus } from "@/types";
import type { Meta, StoryObj } from "@storybook/nextjs";
import EditLotteryView from "./EditLotteryView";

const meta = {
  title: "Admin/Lotteries/Edit",
  component: EditLotteryView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EditLotteryView>;

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
    formData: {
      id: 1,
      name: "春のパン祭り",
      description: "2025年春の限定パンコレクション抽選会",
      startAt: formatDateForInput(new Date()),
      endAt: formatDateForInput(new Date()),
      resultAt: formatDateForInput(new Date()),
      paymentDeadlineAt: formatDateForInput(new Date()),
      status: LotteryStatus.DRAFT,
    },
    products: mockProducts,
    selectedProducts: mockProducts.map((product) => ({
      id: String(product.id),
      productId: product.id,
      quantity: 1,
    })),
    loading: false,
    error: null,
    success: false,
    handleInputChange: () => {},
    handleDateInputChange: () => {},
    handleSubmit: async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted");
    },
    getStatusBadge,
    handleAddProduct: () => {
      console.log("Add product");
    },
    handleRemoveProduct: (index: number) => {
      console.log("Remove product at index", index);
    },
    handleProductChange: (index: number, field: string, value: number) => {
      console.log(`Product at index ${index} changed: ${field} = ${value}`);
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
    error: "抽選の更新に失敗しました",
  },
};

export const Success: Story = {
  args: {
    ...Default.args,
    success: true,
  },
};
