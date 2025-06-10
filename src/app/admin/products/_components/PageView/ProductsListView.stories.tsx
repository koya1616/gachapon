import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/nextjs";
import ProductsListView from "./ProductsListView";

const meta = {
  title: "Admin/Products",
  component: ProductsListView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductsListView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    products: [],
    loading: true,
  },
};

export const NoProducts: Story = {
  args: {
    products: [],
    loading: false,
  },
};

export const WithProducts: Story = {
  args: {
    products: mockProducts,
    loading: false,
  },
};
