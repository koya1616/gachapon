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

const Icons = () => {
  return (
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
  );
};

const meta = {
  title: "Components/Icons",
  component: Icons,
  tags: ["autodocs"],
} satisfies Meta<typeof Icons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
