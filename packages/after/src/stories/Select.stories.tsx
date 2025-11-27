import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Select } from "../components/ui/select";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "드롭다운 선택 컴포넌트입니다. Label, HelperText, 에러 메시지를 통합 제공합니다.",
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
            id: "select-name",
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
      description: "select의 name 속성 (필수)",
      table: {
        type: { summary: "string" },
      },
    },
    value: {
      control: "text",
      description: "선택된 값",
      table: {
        type: { summary: "string" },
      },
    },
    options: {
      description: "선택 옵션 배열 { value, label }",
      table: {
        type: { summary: "Option[]" },
      },
    },
    label: {
      control: "text",
      description: "select 위에 표시될 레이블",
      table: {
        type: { summary: "string" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      description: "select 너비",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "full" },
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
      description: "필수 선택 항목 여부",
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
        defaultValue: { summary: "Select an option..." },
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: "option1", label: "옵션 1" },
  { value: "option2", label: "옵션 2" },
  { value: "option3", label: "옵션 3" },
];

export const Default: Story = {
  args: {
    name: "select",
    value: "",
    options: defaultOptions,
    label: "선택하세요",
    placeholder: "옵션을 선택하세요",
  },
};

export const WithValue: Story = {
  args: {
    name: "select",
    value: "option2",
    options: defaultOptions,
    label: "선택된 값",
  },
};

export const Required: Story = {
  args: {
    name: "select",
    value: "",
    options: defaultOptions,
    label: "필수 선택",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    name: "select",
    value: "option1",
    options: defaultOptions,
    label: "비활성화",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    name: "select",
    value: "",
    options: defaultOptions,
    label: "카테고리",
    error: "카테고리를 선택해주세요",
  },
};

export const WithHelpText: Story = {
  args: {
    name: "select",
    value: "",
    options: defaultOptions,
    label: "역할",
    helpText: "사용자의 역할을 선택하세요",
  },
};

export const UserRole: Story = {
  args: {
    name: "role",
    value: "user",
    options: [
      { value: "admin", label: "관리자" },
      { value: "moderator", label: "운영자" },
      { value: "user", label: "사용자" },
      { value: "guest", label: "게스트" },
    ],
    label: "사용자 역할",
  },
};

export const PostCategory: Story = {
  args: {
    name: "category",
    value: "development",
    options: [
      { value: "development", label: "Development" },
      { value: "design", label: "Design" },
      { value: "accessibility", label: "Accessibility" },
      { value: "news", label: "News" },
    ],
    label: "게시글 카테고리",
  },
};

export const Small: Story = {
  args: {
    name: "select",
    value: "",
    options: defaultOptions,
    label: "작은 선택",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    name: "select",
    value: "",
    options: defaultOptions,
    label: "큰 선택",
    size: "lg",
  },
};

