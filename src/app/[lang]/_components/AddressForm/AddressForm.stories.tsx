import { mockAddressFormData, mockEmptyAddressFormData } from "@/mocks/data";
import type { Meta, StoryObj } from "@storybook/react";
import { AddressFormView } from "./AddressForm";

const meta = {
  title: "Components/AddressForm",
  component: AddressFormView,
  tags: ["autodocs"],
} satisfies Meta<typeof AddressFormView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    l: "ja",
    formData: mockAddressFormData,
    isLoading: false,
    isFetching: false,
    handleChange: () => {},
    handleSubmit: (e) => {
      e.preventDefault();
      console.log("Form submitted");
    },
    handleClear: () => console.log("Form cleared"),
  },
};

export const EmptyForm: Story = {
  args: {
    l: "ja",
    formData: mockEmptyAddressFormData,
    isLoading: false,
    isFetching: false,
    handleChange: () => {},
    handleSubmit: (e) => {
      e.preventDefault();
      console.log("Form submitted");
    },
    handleClear: () => console.log("Form cleared"),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Fetching: Story = {
  args: {
    ...Default.args,
    isFetching: true,
  },
};
