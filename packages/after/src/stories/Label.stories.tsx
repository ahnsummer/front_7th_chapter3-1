import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../components/ui/label";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label Text",
  },
};

export const Required: Story = {
  args: {
    children: "필수 항목",
    required: true,
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="username" required={true}>
        사용자명
      </Label>
      <input
        id="username"
        type="text"
        placeholder="사용자명 입력"
        className="w-[300px] px-2.5 py-2 border border-gray-400 rounded-md"
      />
    </div>
  ),
};

