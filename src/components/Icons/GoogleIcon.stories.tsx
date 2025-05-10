import type { Meta, StoryObj } from "@storybook/react";
import { GoogleIcon } from "./GoogleIcon";

const meta = {
  title: "Icons/GoogleIcon",
  component: GoogleIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof GoogleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
