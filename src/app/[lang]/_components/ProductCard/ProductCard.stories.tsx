import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { ProductCardView } from "./ProductCard";

const meta = {
  title: "Components/ProductCard",
  component: ProductCardView,
  parameters: {
    context: "cart",
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductCardView>;

export default meta;
type Story = StoryObj<typeof ProductCardView>;

export const Default: Story = {
  args: {
    product: mockProducts[0],
    lang: "ja",
    add_to_cart: () => {},
    isMaxQuantity: false,
  },
};

export const OutOfStock: Story = {
  args: {
    ...Default.args,
    isMaxQuantity: true,
  },
};
