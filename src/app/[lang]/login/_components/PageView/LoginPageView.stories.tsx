import type { Meta, StoryObj } from "@storybook/react";
import LoginPageView from "./LoginPageView";

const meta = {
  title: "Pages/Login",
  component: LoginPageView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoginPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    l: "ja",
  },
};
