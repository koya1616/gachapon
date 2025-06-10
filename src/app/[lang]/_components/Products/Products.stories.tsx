import { mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/nextjs";
import Products from "./Products";

const meta: Meta<typeof Products> = {
  title: "Components/Products",
  component: Products,
  tags: ["autodocs"],
  argTypes: {
    products: {
      control: "object",
    },
  },
  parameters: {
    context: "cart",
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Products>;

export const NoProducts: Story = {
  args: {
    products: [],
    lang: "ja",
  },
};

export const WithProducts: Story = {
  args: {
    products: mockProducts,
    lang: "ja",
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
