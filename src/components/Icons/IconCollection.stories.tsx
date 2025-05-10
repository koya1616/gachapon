import type { Meta, StoryObj } from "@storybook/react";
import {
  AccountIcon,
  CartIcon,
  CloseIcon,
  CreditCardIcon,
  GoogleIcon,
  LanguageIcon,
  MenuIcon,
  PayPayIcon,
} from "./index";

const IconDisplay = () => {
  return (
    <div className="p-6 rounded-lg">
      <div className="grid grid-cols-3 gap-8 md:grid-cols-4 lg:grid-cols-8">
        <MenuIcon className="h-6 w-6" />
        <CloseIcon className="h-6 w-6" />
        <AccountIcon />
        <CartIcon />
        <GoogleIcon />
        <CreditCardIcon />
        <LanguageIcon />
        <PayPayIcon />
      </div>
    </div>
  );
};

const meta = {
  title: "Icons/Collection",
  component: IconDisplay,
  tags: ["autodocs"],
} satisfies Meta<typeof IconDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
