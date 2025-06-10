import type { Meta, StoryObj } from "@storybook/nextjs";
import Badge from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: {
    text: "Success",
    color: "green",
  },
};

export const Red: Story = {
  args: {
    text: "Error",
    color: "red",
  },
};

export const Blue: Story = {
  args: {
    text: "Info",
    color: "blue",
  },
};

export const Gray: Story = {
  args: {
    text: "Pending",
    color: "gray",
  },
};
