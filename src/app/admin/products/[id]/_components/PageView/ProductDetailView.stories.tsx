import { mockAuction, mockLotteryEvents, mockProducts } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import ProductDetailView from "./ProductDetailView";

const meta = {
  title: "Admin/Products/id",
  component: ProductDetailView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProductDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProducts[0],
    lotteryEvents: mockLotteryEvents,
    auctions: [mockAuction],
    loading: false,
    error: null,
    isEditing: false,
    editForm: {
      name: mockProducts[0].name,
      price: mockProducts[0].price.toString(),
      stock_quantity: mockProducts[0].stock_quantity.toString(),
    },
    updateStatus: {
      loading: false,
      error: null,
      success: false,
    },
    handleInputChange: (e) => console.log("Input changed:", e.target.name, e.target.value),
    handleSubmit: async (e) => {
      e.preventDefault();
      console.log("Form submitted");
    },
    setIsEditing: (value) => console.log("setIsEditing:", value),
  },
};

export const Loading: Story = {
  args: {
    product: null,
    lotteryEvents: [],
    auctions: [],
    loading: true,
    error: null,
    isEditing: false,
    editForm: {
      name: "",
      price: "",
      stock_quantity: "",
    },
    updateStatus: {
      loading: false,
      error: null,
      success: false,
    },
    handleInputChange: () => {},
    handleSubmit: async () => {},
    setIsEditing: () => {},
  },
};

export const NotSuccess: Story = {
  args: {
    product: null,
    lotteryEvents: [],
    auctions: [],
    loading: false,
    error: "商品の取得中にエラーが発生しました。",
    isEditing: false,
    editForm: {
      name: "",
      price: "",
      stock_quantity: "",
    },
    updateStatus: {
      loading: false,
      error: null,
      success: false,
    },
    handleInputChange: () => {},
    handleSubmit: async () => {},
    setIsEditing: () => {},
  },
};

export const Editing: Story = {
  args: {
    product: mockProducts[0],
    lotteryEvents: [],
    auctions: [],
    loading: false,
    error: null,
    isEditing: true,
    editForm: {
      name: mockProducts[0].name,
      price: mockProducts[0].price.toString(),
      stock_quantity: mockProducts[0].stock_quantity.toString(),
    },
    updateStatus: {
      loading: false,
      error: null,
      success: false,
    },
    handleInputChange: (e) => console.log("Input changed:", e.target.name, e.target.value),
    handleSubmit: async (e) => {
      e.preventDefault();
      console.log("Form submitted");
    },
    setIsEditing: (value) => console.log("setIsEditing:", value),
  },
};

export const Updating: Story = {
  args: {
    product: mockProducts[0],
    lotteryEvents: [],
    auctions: [],
    loading: false,
    error: null,
    isEditing: true,
    editForm: {
      name: mockProducts[0].name,
      price: mockProducts[0].price.toString(),
      stock_quantity: mockProducts[0].stock_quantity.toString(),
    },
    updateStatus: {
      loading: true,
      error: null,
      success: false,
    },
    handleInputChange: () => {},
    handleSubmit: async () => {},
    setIsEditing: () => {},
  },
};

export const UpdateSuccess: Story = {
  args: {
    product: mockProducts[0],
    lotteryEvents: [],
    auctions: [],
    loading: false,
    error: null,
    isEditing: false,
    editForm: {
      name: mockProducts[0].name,
      price: mockProducts[0].price.toString(),
      stock_quantity: mockProducts[0].stock_quantity.toString(),
    },
    updateStatus: {
      loading: false,
      error: null,
      success: true,
    },
    handleInputChange: () => {},
    handleSubmit: async () => {},
    setIsEditing: () => {},
  },
};

export const UpdateError: Story = {
  args: {
    product: mockProducts[0],
    lotteryEvents: [],
    auctions: [],
    loading: false,
    error: null,
    isEditing: true,
    editForm: {
      name: mockProducts[0].name,
      price: mockProducts[0].price.toString(),
      stock_quantity: mockProducts[0].stock_quantity.toString(),
    },
    updateStatus: {
      loading: false,
      error: "商品の更新中にエラーが発生しました。",
      success: false,
    },
    handleInputChange: () => {},
    handleSubmit: async () => {},
    setIsEditing: () => {},
  },
};

export const OutOfStock: Story = {
  args: {
    product: mockProducts[3],
    lotteryEvents: [],
    auctions: [],
    loading: false,
    error: null,
    isEditing: false,
    editForm: {
      name: mockProducts[3].name,
      price: mockProducts[3].price.toString(),
      stock_quantity: mockProducts[3].stock_quantity.toString(),
    },
    updateStatus: {
      loading: false,
      error: null,
      success: false,
    },
    handleInputChange: () => {},
    handleSubmit: async () => {},
    setIsEditing: () => {},
  },
};
