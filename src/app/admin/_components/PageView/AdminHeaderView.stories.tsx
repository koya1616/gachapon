import type { Meta, StoryObj } from "@storybook/react";
import AdminHeaderView from "./AdminHeaderView";

const meta = {
  title: "Admin/Header",
  component: AdminHeaderView,
  tags: ["autodocs"],
} satisfies Meta<typeof AdminHeaderView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pathname: "/admin/top",
    isMenuOpen: false,
    navigationLinks: [
      { name: "ダッシュボード", path: "/admin/top" },
      { name: "商品一覧", path: "/admin/products" },
      { name: "抽選管理", path: "/admin/lotteries" },
      { name: "決済管理", path: "/admin/payment" },
      { name: "アップロード", path: "/admin/upload" },
    ],
    toggleMenu: () => console.log("Toggle menu clicked"),
    handleMobileNavClick: () => console.log("Mobile nav clicked"),
  },
};

export const ProductsPageActive: Story = {
  args: {
    ...Default.args,
    pathname: "/admin/products",
  },
};

export const LotteriesPageActive: Story = {
  args: {
    ...Default.args,
    pathname: "/admin/lotteries",
  },
};

export const PaymentPageActive: Story = {
  args: {
    ...Default.args,
    pathname: "/admin/payment",
  },
};

export const UploadPageActive: Story = {
  args: {
    ...Default.args,
    pathname: "/admin/upload",
  },
};

export const SpMenuOpen: Story = {
  args: {
    ...Default.args,
    isMenuOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const SpMenuClose: Story = {
  args: {
    ...Default.args,
    isMenuOpen: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
