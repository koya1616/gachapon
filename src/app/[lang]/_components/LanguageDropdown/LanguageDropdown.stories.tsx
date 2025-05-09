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

const dropdownOptions = (
  <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-neutral-200 rounded-md shadow-lg z-10">
    {LANGS.map((langOption) => (
      <button
        type="button"
        key={langOption}
        className={`w-full text-left px-3 py-2 text-sm cursor-pointer ${
          "en" === langOption ? "bg-blue-600 text-white" : "text-black hover:bg-gray-100"
        }`}
      >
        {langOption.toUpperCase()}
      </button>
    ))}
  </div>
);

const dropdownIcon = (
  <svg
    className="w-4 h-4 ml-1 transition-transform duration-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <title>Dropdown arrow</title>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const Default: Story = {
  args: {
    lang: "en",
    dropdownOptions: null,
    dropdownIcon,
    toggleDropdown: () => console.log("Toggled dropdown"),
  },
};

export const OpenDropdown: Story = {
  args: {
    lang: "en",
    dropdownOptions,
    dropdownIcon: (
      <svg
        className="w-4 h-4 ml-1 transition-transform duration-200 transform rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title>Dropdown arrow</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    toggleDropdown: () => console.log("Toggled dropdown"),
  },
};
