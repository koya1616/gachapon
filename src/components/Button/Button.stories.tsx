import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const Buttons = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="flat" color="blue" label="Flat" />
          <Button variant="tonal" color="blue" label="Tonal" />
          <Button variant="text" color="blue" label="Text" />
          <Button variant="outlined" color="blue" label="Outlined" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">Color Options</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="flat" color="blue" label="Blue" />
          <Button variant="flat" color="red" label="Red" />
          <Button variant="flat" color="green" label="Green" />
          <Button variant="flat" color="gray" label="Gray" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">State</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="flat" color="blue" label="Enabled" />
          <Button variant="flat" color="blue" label="Disabled" disabled />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">Width</h2>
        <div className="space-y-4">
          <Button variant="flat" color="blue" label="Default Width" />
          <Button variant="flat" color="blue" label="Full Width" width="w-full" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-2 border-b">Font Size</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="flat" color="blue" label="Default" />
          <Button variant="flat" color="blue" label="Large" fontSize="text-lg" />
          <Button variant="flat" color="blue" label="Extra Large" fontSize="text-xl" />
        </div>
      </section>
    </div>
  );
};

const meta = {
  title: "Components/Button",
  component: Buttons,
  tags: ["autodocs"],
} satisfies Meta<typeof Buttons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
