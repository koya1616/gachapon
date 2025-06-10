import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { HeaderView } from "./Header";

const meta = {
  title: "Components/Header",
  component: HeaderView,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lang: "ja",
    showCart: true,
    cartItemCount: 3,
    isCartOpen: false,
    cart: mockProducts.slice(0, 3).map((product) => ({
      ...product,
      quantity: 1,
    })),
    totalPrice: 1500,
    toggleCart: () => console.log("toggleCart"),
    closeCart: () => console.log("closeCart"),
    updateQuantity: (productId: number, quantity: number) => console.log("updateQuantity", productId, quantity),
    removeFromCart: (productId: number) => console.log("removeFromCart", productId),
    clear_cart: () => console.log("clear_cart"),
    handleLogoClick: () => console.log("handleLogoClick"),
    handleAccountClick: () => console.log("handleAccountClick"),
  },
};

export const CartOpen: Story = {
  args: {
    ...Default.args,
    isCartOpen: true,
  },
};

export const EmptyCart: Story = {
  args: {
    ...Default.args,
    cartItemCount: 0,
    cart: [],
    totalPrice: 0,
  },
};

export const WithoutCartButton: Story = {
  args: {
    ...Default.args,
    showCart: false,
  },
};
