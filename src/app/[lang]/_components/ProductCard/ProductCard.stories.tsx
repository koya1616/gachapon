import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "./ProductCard";
import type { Product, Lang } from "@/types";
import { withActions } from "@storybook/addon-actions/decorator";
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
    product: {
      control: "object",
    },
    lang: argLang,
  },
  decorators: [withActions],
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
