import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "체크박스 컴포넌트입니다. Radix UI를 기반으로 하며, Label과 함께 사용하여 접근성을 보장합니다.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "label",
            enabled: true,
          },
          {
            id: "checkbox-name",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "체크 상태",
      table: {
        type: { summary: "boolean" },
      },
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description: "checkbox id (Label의 htmlFor와 연결)",
      table: {
        type: { summary: "string" },
      },
    },
    onCheckedChange: {
      description: "체크 상태 변경 시 호출되는 콜백",
      table: {
        type: { summary: "(checked: boolean) => void" },
      },
    },
  },
  args: {
    id: "checkbox",
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
  args: {},
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" required={true}>
        이용약관에 동의합니다
      </Label>
    </div>
  ),
};

export const MultipleCheckboxes: Story = {
  args: {},
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1" required={false}>
          옵션 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" defaultChecked />
        <Label htmlFor="option2" required={false}>
          옵션 2 (선택됨)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" disabled />
        <Label htmlFor="option3" required={false}>
          옵션 3 (비활성)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" disabled defaultChecked />
        <Label htmlFor="option4" required={false}>
          옵션 4 (비활성, 선택됨)
        </Label>
      </div>
    </div>
  ),
};
