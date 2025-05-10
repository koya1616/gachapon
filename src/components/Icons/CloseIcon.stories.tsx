import type { Meta, StoryObj } from "@storybook/react";
import { CloseIcon } from "./CloseIcon";

const meta = {
  title: "Icons/CloseIcon",
  component: CloseIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof CloseIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Colored: Story = {
  args: {
    className: "h-6 w-6 text-red-500",
  },
};
