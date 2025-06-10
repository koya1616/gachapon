import type { Meta, StoryObj } from "@storybook/nextjs";
import Skeleton from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    h: {
      control: {
        type: "number",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    h: 10,
  },
};
