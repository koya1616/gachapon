import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["flat", "tonal", "text", "outlined"],
    },
    color: {
      control: { type: "select" },
      options: ["blue", "gray", "red", "green"],
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    label: {
      control: "text",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Flat: Story = {
  args: {
    variant: "flat",
    color: "blue",
    label: "Button",
  },
};

export const Tonal: Story = {
  args: {
    variant: "tonal",
    color: "blue",
    label: "Button",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    color: "blue",
    label: "Button",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    color: "blue",
    label: "Button",
  },
};

export const Red: Story = {
  args: {
    variant: "flat",
    color: "red",
    label: "Button",
  },
};

export const Green: Story = {
  args: {
    variant: "flat",
    color: "green",
    label: "Button",
  },
};

export const Gray: Story = {
  args: {
    variant: "flat",
    color: "gray",
    label: "Button",
  },
};
