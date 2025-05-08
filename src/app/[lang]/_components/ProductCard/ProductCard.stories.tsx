import type { Meta, StoryObj } from "@storybook/react";
import { CartProvider } from "@/context/CartContext";
import ProductCard from "./ProductCard";
import type { Product, Lang } from "@/types";

const sampleProduct: Product = {
  id: 1,
  name: "サンプル商品",
  price: 1000,
  image: "https://placehold.co/300x300",
  quantity: 1,
  stock_quantity: 10,
};

const outOfStockProduct: Product = {
  ...sampleProduct,
  id: 3,
  name: "在庫切れ商品",
  stock_quantity: 0,
};

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    product: {
      control: "object",
    },
    lang: {
      control: { type: "select" },
      options: ["en", "ja", "zh"],
    },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "300px" }}>
          <CartProvider>
            <Story />
          </CartProvider>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: sampleProduct,
    lang: "ja" as Lang,
  },
};

export const OutOfStock: Story = {
  args: {
    product: outOfStockProduct,
    lang: "ja" as Lang,
  },
};
