import type { Meta, StoryObj } from "@storybook/react";
import { CreditCardIcon } from "./CreditCardIcon";

const meta = {
  title: "Icons/CreditCardIcon",
  component: CreditCardIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CreditCardIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
