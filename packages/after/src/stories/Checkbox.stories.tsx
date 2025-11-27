import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "checkbox",
  },
};

export const Checked: Story = {
  args: {
    id: "checkbox-checked",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    id: "checkbox-disabled",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: "checkbox-disabled-checked",
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">이용약관에 동의합니다</Label>
    </div>
  ),
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">옵션 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" defaultChecked />
        <Label htmlFor="option2">옵션 2 (선택됨)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" disabled />
        <Label htmlFor="option3">옵션 3 (비활성)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" disabled defaultChecked />
        <Label htmlFor="option4">옵션 4 (비활성, 선택됨)</Label>
      </div>
    </div>
  ),
};

