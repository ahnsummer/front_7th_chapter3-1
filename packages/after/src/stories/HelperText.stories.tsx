import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelperText } from "../components/ui/helper-text";

const meta = {
  title: "Components/HelperText",
  component: HelperText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "폼 필드 아래 표시되는 도움말 또는 에러 메시지 컴포넌트입니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "표시할 텍스트",
      table: {
        type: { summary: "string" },
      },
    },
    hasError: {
      control: "boolean",
      description: "에러 상태 (빨간색으로 표시)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
  },
} satisfies Meta<typeof HelperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "도움말 텍스트입니다.",
  },
};

export const Error: Story = {
  args: {
    text: "에러 메시지입니다.",
    hasError: true,
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="일반 입력"
          className="w-full px-2.5 py-2 border border-gray-400 rounded-md"
        />
        <HelperText text="3자 이상 입력하세요" />
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="에러 입력"
          className="w-full px-2.5 py-2 border border-red-500 rounded-md"
        />
        <HelperText text="필수 항목입니다" hasError />
      </div>
    </div>
  ),
};

