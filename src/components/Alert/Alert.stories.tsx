import type { Meta, StoryObj } from "@storybook/nextjs";
import Alert from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    text: "操作が成功しました。",
    type: "success",
  },
};

export const NotSuccess: Story = {
  args: {
    text: "エラーが発生しました。もう一度お試しください。",
    type: "error",
  },
};
