import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Input } from "../components/ui/input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "url"],
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
    onValidate: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "username",
    label: "사용자명",
    placeholder: "사용자명을 입력하세요",
  },
};

export const WithError: Story = {
  args: {
    name: "email",
    label: "이메일",
    placeholder: "이메일을 입력하세요",
    error: "올바른 이메일 형식이 아닙니다",
  },
};

export const WithHelpText: Story = {
  args: {
    name: "password",
    label: "비밀번호",
    type: "password",
    helpText: "8자 이상의 비밀번호를 입력하세요",
  },
};

export const Required: Story = {
  args: {
    name: "username",
    label: "사용자명",
    required: true,
    placeholder: "필수 항목입니다",
  },
};

export const Disabled: Story = {
  args: {
    name: "username",
    label: "사용자명",
    disabled: true,
    value: "비활성화됨",
  },
};

export const Small: Story = {
  args: {
    name: "username",
    label: "사용자명",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    name: "username",
    label: "사용자명",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    name: "username",
    label: "사용자명",
    size: "lg",
  },
};

export const Email: Story = {
  args: {
    name: "email",
    label: "이메일",
    type: "email",
    placeholder: "example@company.com",
  },
};

export const Password: Story = {
  args: {
    name: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호 입력",
  },
};

export const Number: Story = {
  args: {
    name: "age",
    label: "나이",
    type: "number",
    placeholder: "나이를 입력하세요",
  },
};

