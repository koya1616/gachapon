import { withActions } from "@storybook/addon-actions/decorator";
import type { Meta, StoryObj } from "@storybook/react";
import Products from "./Products";
import type { Product, Lang } from "@/types";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 1000,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 10,
  },
  {
    id: 2,
    name: "Product 2",
    price: 2000,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 5,
  },
  {
    id: 3,
    name: "Product 3",
    price: 3000,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 0,
  },
  {
    id: 4,
    name: "Product 4",
    price: 4000,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 8,
  },
  {
    id: 5,
    name: "Product 5",
    price: 5000,
    image: "https://placehold.co/300x300",
    quantity: 1,
    stock_quantity: 3,
  },
];

const meta: Meta<typeof Products> = {
  title: "Components/Products",
  component: Products,
  tags: ["autodocs"],
  argTypes: {
    lang: {
      control: "select",
      options: ["en", "ja", "zh"],
      defaultValue: "ja",
    },
    products: {
      control: "object",
    },
  },
  parameters: {
    context: "cart",
    actions: {
      handles: ["click button"],
    },
  },
  decorators: [withActions],
};

export default meta;
type Story = StoryObj<typeof Products>;

export const NoProducts: Story = {
  args: {
    products: [],
    lang: "ja" as Lang,
  },
};

export const WithProducts: Story = {
  args: {
    products: sampleProducts,
    lang: "ja" as Lang,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
