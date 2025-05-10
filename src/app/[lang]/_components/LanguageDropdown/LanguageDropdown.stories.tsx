import { Button } from "@/components/Button";
import { LANGS } from "@/const/language";
import type { Meta, StoryObj } from "@storybook/react";
import { LanguageDropdownView } from "./LanguageDropdown";

const meta = {
  title: "Components/LanguageDropdown",
  component: LanguageDropdownView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageDropdownView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isDropdownOpen: false,
    lang: "en",
    handleLanguageChange: () => console.log("Changed language"),
    toggleDropdown: () => console.log("Toggled dropdown"),
  },
};

export const OpenDropdown: Story = {
  args: {
    isDropdownOpen: true,
    lang: "en",
    handleLanguageChange: () => console.log("Changed language"),
    toggleDropdown: () => console.log("Toggled dropdown"),
  },
};
