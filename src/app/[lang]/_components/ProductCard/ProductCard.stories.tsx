import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "./ProductCard";
import type { Product, Lang } from "@/types";
import { argLang, mockProducts } from "@/mocks/data";

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: {
    context: "cart",
    actions: {
      handles: ["click button"],
    },
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    lang: argLang,
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: mockProducts[0],
    lang: "ja" as Lang,
  },
};

export const OutOfStock: Story = {
  args: {
    product: mockProducts.find((product: Product) => product.stock_quantity === 0),
    lang: "ja" as Lang,
  },
};
