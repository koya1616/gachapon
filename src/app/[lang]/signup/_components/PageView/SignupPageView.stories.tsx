import type { Meta, StoryObj } from "@storybook/nextjs";
import SignupPageView from "./SignupPageView";

const meta = {
  title: "Pages/Signup",
  component: SignupPageView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SignupPageView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    l: "ja",
  },
};
