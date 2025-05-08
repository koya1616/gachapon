import type { Meta, StoryObj } from "@storybook/react";
import { LogoutButtonView } from "./LogoutButton";

const meta = {
  title: "Components/Account/LogoutButton",
  component: LogoutButtonView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LogoutButtonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    l: "ja",
    isLoading: false,
    handleLogout: async () => console.log("Logout clicked"),
  },
};

export const Loading: Story = {
  args: {
    l: "ja",
    isLoading: true,
    handleLogout: async () => console.log("Logout clicked"),
  },
};
