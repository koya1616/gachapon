import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import CheckoutPageView from "./_components/PageView";

const meta = {
  title: "Pages/Checkout",
  component: CheckoutPageView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CheckoutPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCart = mockProducts.slice(0, 3).map((product) => ({
  ...product,
  quantity: Math.floor(Math.random() * 3) + 1,
}));

const totalPrice = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const Default: Story = {
  args: {
    l: "ja",
    cart: mockCart,
    totalPrice: totalPrice,
    paymentMethod: null,
    isLoading: false,
    handlePaymentMethodChange: (method) => console.log(`Payment method changed to ${method}`),
    handlePayment: async () => console.log("Processing payment"),
  },
};

export const WithCreditCardSelected: Story = {
  args: {
    ...Default.args,
    paymentMethod: "credit",
  },
};

export const WithPaypaySelected: Story = {
  args: {
    ...Default.args,
    paymentMethod: "paypay",
  },
};

export const EmptyCart: Story = {
  args: {
    ...Default.args,
    cart: [],
    totalPrice: 0,
  },
};

export const LoadingState: Story = {
  args: {
    ...Default.args,
    paymentMethod: "paypay",
    isLoading: true,
  },
};
