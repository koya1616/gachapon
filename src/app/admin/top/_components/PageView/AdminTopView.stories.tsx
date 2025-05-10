import type { Meta, StoryObj } from "@storybook/react";
import AdminTopView from "./AdminTopView";

const meta: Meta<typeof AdminTopView> = {
  title: "Admin/Top",
  component: AdminTopView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
