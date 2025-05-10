import type { Meta, StoryObj } from "@storybook/react";
import { MenuIcon } from "./MenuIcon";

const meta = {
  title: "Icons/MenuIcon",
  component: MenuIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof MenuIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Colored: Story = {
  args: {
    className: "h-6 w-6 text-blue-500",
  },
};
