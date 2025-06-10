import type { Meta, StoryObj } from "@storybook/nextjs";
import LoginView from "./LoginView";

const meta = {
  title: "Admin/Login",
  component: LoginView,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: { success: true },
    formAction: (formData: FormData) => {
      console.log("Form action triggered", formData);
    },
    isPending: false,
  },
};

export const Loading: Story = {
  args: {
    state: { success: true },
    formAction: (formData: FormData) => {
      console.log("Form action triggered", formData);
    },
    isPending: true,
  },
};

export const NotSuccess: Story = {
  args: {
    state: { success: false },
    formAction: (formData: FormData) => {
      console.log("Form action triggered", formData);
    },
    isPending: false,
  },
};
