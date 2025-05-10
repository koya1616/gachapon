import type { Meta, StoryObj } from "@storybook/react";
import { AccountIcon, CartIcon, CloseIcon, MenuIcon } from "./index";

interface IconDisplayProps {
  darkMode?: boolean;
}

const IconDisplay = ({ darkMode = false }: IconDisplayProps) => {
  const bgClass = darkMode ? "bg-gray-800" : "bg-white";
  const textClass = darkMode ? "text-white" : "text-black";

  return (
    <div className={`p-6 ${bgClass} ${textClass} rounded-lg`}>
      <h2 className="text-xl font-bold mb-4">Icon Collection</h2>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="flex flex-col items-center">
          <div className="mb-2 p-3 border rounded flex items-center justify-center">
            <MenuIcon className="h-6 w-6" />
          </div>
          <p className="text-sm">MenuIcon</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2 p-3 border rounded flex items-center justify-center">
            <CloseIcon className="h-6 w-6" />
          </div>
          <p className="text-sm">CloseIcon</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2 p-3 border rounded flex items-center justify-center">
            <AccountIcon />
          </div>
          <p className="text-sm">AccountIcon</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2 p-3 border rounded flex items-center justify-center">
            <CartIcon />
          </div>
          <p className="text-sm">CartIcon</p>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Icons/IconCollection",
  component: IconDisplay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    darkMode: { control: "boolean" },
  },
} satisfies Meta<typeof IconDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  args: {
    darkMode: false,
  },
};

export const DarkMode: Story = {
  args: {
    darkMode: true,
  },
};
