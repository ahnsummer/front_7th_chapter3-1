import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Select } from "../components/ui/select";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
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

