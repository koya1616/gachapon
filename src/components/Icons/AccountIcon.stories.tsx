import type { Meta, StoryObj } from "@storybook/react";
import { AccountIcon } from "./AccountIcon";

const meta = {
  title: "Icons/AccountIcon",
  component: AccountIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithBackground: Story = {
  decorators: [(Story) => <div className="p-4 bg-gray-100 rounded-full">{Story()}</div>],
};

export const Colored: Story = {
  decorators: [(Story) => <div className="p-4 text-blue-500">{Story()}</div>],
};
