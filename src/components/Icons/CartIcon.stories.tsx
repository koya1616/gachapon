import type { Meta, StoryObj } from "@storybook/react";
import { CartIcon } from "./CartIcon";

const meta = {
  title: "Icons/CartIcon",
  component: CartIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CartIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithBackground: Story = {
  decorators: [(Story) => <div className="p-4 bg-gray-100 rounded">{Story()}</div>],
};

export const Colored: Story = {
  decorators: [(Story) => <div className="p-4 text-green-500">{Story()}</div>],
};
