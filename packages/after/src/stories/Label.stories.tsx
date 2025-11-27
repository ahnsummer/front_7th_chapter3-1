import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../components/ui/label";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "폼 필드의 레이블 컴포넌트입니다. Radix UI Label을 기반으로 하며, required 표시를 지원합니다.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "label",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "레이블 텍스트",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    required: {
      control: "boolean",
      description: "필수 항목 표시 (빨간색 * 추가)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    htmlFor: {
      control: "text",
      description: "연결할 input의 id",
      table: {
        type: { summary: "string" },
      },
    },
  },
  args: {
    children: "Label",
    required: false,
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
  args: {},
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
