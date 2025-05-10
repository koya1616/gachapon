import type { Meta, StoryObj } from "@storybook/react";
import { LanguageIcon } from "./LanguageIcon";

const meta = {
  title: "Icons/LanguageIcon",
  component: LanguageIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
