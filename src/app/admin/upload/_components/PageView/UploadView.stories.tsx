import { mockFile } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/nextjs";
import UploadView from "./UploadView";

const meta: Meta<typeof UploadView> = {
  title: "Admin/Upload",
  component: UploadView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseProps = {
  file: null,
  uploading: false,
  fileError: null,
  fileButtonClassName:
    "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50",
  handleFileChange: () => {},
  handleFileSubmit: async () => {},
  formData: {
    name: "",
    image: "",
    price: 0,
    stock_quantity: 0,
  },
  formError: null,
  isSubmitting: false,
  submitButtonClassName:
    "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50",
  handleProductChange: () => {},
  handleCreateProductSubmit: async () => {},
  uploadResult: null,
  handleUploadSuccess: () => {},
};

export const InitialState: Story = {
  args: {
    ...baseProps,
  },
};

export const WithFile: Story = {
  args: {
    ...baseProps,
    file: mockFile,
  },
};

export const Uploading: Story = {
  args: {
    ...baseProps,
    file: mockFile,
    uploading: true,
  },
};

export const WithError: Story = {
  args: {
    ...baseProps,
    fileError: "アップロードに失敗しました。再度お試しください。",
  },
};

export const UploadSuccess: Story = {
  args: {
    ...baseProps,
    uploadResult: {
      key: "products/test-image.png",
    },
    formData: {
      name: "",
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/products/test-image.png",
      price: 0,
      stock_quantity: 0,
    },
  },
};

export const FormFilling: Story = {
  args: {
    ...baseProps,
    uploadResult: {
      key: "products/test-image.png",
    },
    formData: {
      name: "テスト商品",
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/products/test-image.png",
      price: 1000,
      stock_quantity: 10,
    },
  },
};

export const FormSubmitting: Story = {
  args: {
    ...baseProps,
    uploadResult: {
      key: "products/test-image.png",
    },
    formData: {
      name: "テスト商品",
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/products/test-image.png",
      price: 1000,
      stock_quantity: 10,
    },
    isSubmitting: true,
  },
};

export const FormError: Story = {
  args: {
    ...baseProps,
    uploadResult: {
      key: "products/test-image.png",
    },
    formData: {
      name: "テスト商品",
      image: "https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/products/test-image.png",
      price: 1000,
      stock_quantity: 10,
    },
    formError: "商品の登録に失敗しました。再度お試しください。",
  },
};
