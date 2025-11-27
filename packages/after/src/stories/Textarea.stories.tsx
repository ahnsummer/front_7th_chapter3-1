import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Textarea } from "../components/ui/textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "여러 줄의 텍스트 입력을 위한 컴포넌트입니다. Label, HelperText, 에러 메시지를 통합 제공합니다.",
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
    name: {
      control: "text",
      description: "textarea의 name 속성 (필수)",
      table: {
        type: { summary: "string" },
      },
    },
    value: {
      control: "text",
      description: "textarea 값",
      table: {
        type: { summary: "string" },
      },
    },
    label: {
      control: "text",
      description: "textarea 위에 표시될 레이블",
      table: {
        type: { summary: "string" },
      },
    },
    rows: {
      control: "number",
      description: "textarea 높이 (행 수)",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: 4 },
      },
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    required: {
      control: "boolean",
      description: "필수 입력 항목 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    error: {
      control: "text",
      description: "에러 메시지",
      table: {
        type: { summary: "string" },
      },
    },
    helpText: {
      control: "text",
      description: "도움말 텍스트",
      table: {
        type: { summary: "string" },
      },
    },
    placeholder: {
      control: "text",
      description: "placeholder 텍스트",
      table: {
        type: { summary: "string" },
      },
    },
    onChange: {
      description: "값 변경 시 호출되는 콜백",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "content",
    value: "",
    label: "내용",
    placeholder: "내용을 입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    name: "content",
    value: "이것은 입력된 텍스트입니다.\n여러 줄에 걸쳐 작성할 수 있습니다.",
    label: "내용",
  },
};

export const Required: Story = {
  args: {
    name: "content",
    value: "",
    label: "내용",
    placeholder: "필수 입력 항목입니다",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    name: "content",
    value: "비활성화된 텍스트입니다.",
    label: "내용",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    name: "content",
    value: "",
    label: "내용",
    error: "내용은 필수 항목입니다",
  },
};

export const WithHelpText: Story = {
  args: {
    name: "content",
    value: "",
    label: "게시글 내용",
    helpText: "마크다운 형식을 지원합니다",
    placeholder: "내용을 입력하세요...",
  },
};

export const CustomRows: Story = {
  args: {
    name: "content",
    value: "",
    label: "내용",
    rows: 10,
    placeholder: "10줄 높이의 텍스트 영역",
  },
};

export const LongContent: Story = {
  args: {
    name: "content",
    value: Array.from({ length: 10 }, (_, i) => `Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`).join("\n"),
    label: "긴 내용",
    rows: 6,
  },
};

