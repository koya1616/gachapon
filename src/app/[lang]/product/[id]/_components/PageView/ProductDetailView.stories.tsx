import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import ProductDetailView from "./ProductDetailView";

const meta: Meta<typeof ProductDetailView> = {
  component: ProductDetailView,
  title: "Pages/Product/id",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ProductDetailView>;

export const Default: Story = {
  args: {
    product: mockProducts[0],
    lang: "en",
  },
};

export const OutOfStock: Story = {
  args: {
    product: null,
    lang: "en",
  },
};
