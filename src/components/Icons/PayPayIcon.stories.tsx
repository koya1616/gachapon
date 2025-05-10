import type { Meta, StoryObj } from "@storybook/react";
import { PayPayIcon } from "./PayPayIcon";

const meta = {
  title: "Icons/PayPayIcon",
  component: PayPayIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PayPayIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
