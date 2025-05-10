import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import { CartView } from "./Cart";

const meta = {
  title: "Components/Cart",
  component: CartView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CartView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCart: Story = {
  args: {
    isOpen: true,
    cart: [],
    totalPrice: 0,
    onClose: () => {},
    onUpdateQuantity: () => {},
    onRemoveItem: () => {},
    onClearCart: () => {},
    handleCheckout: () => {},
    lang: "ja",
  },
};

export const WithItems: Story = {
  args: {
    ...EmptyCart.args,
    isOpen: true,
    cart: mockProducts.slice(0, 3).map((product) => ({
      ...product,
      quantity: 1,
    })),
    totalPrice: mockProducts.slice(0, 3).reduce((sum, product) => sum + product.price, 0),
  },
};
