import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { Input } from "../components/ui/input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "텍스트 입력을 위한 폼 컴포넌트입니다. Label, HelperText, 에러 메시지를 통합 제공하며, 외부 검증 함수를 주입받을 수 있습니다.",
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
            id: "aria-required-attr",
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
      description: "input의 name 속성 (필수)",
      table: {
        type: { summary: "string" },
      },
    },
    label: {
      control: "text",
      description: "input 위에 표시될 레이블",
      table: {
        type: { summary: "string" },
      },
    },
    value: {
      control: "text",
      description: "input 값",
      table: {
        type: { summary: "string" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
      description: "input 너비",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "full" },
      },
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "url"],
      description: "HTML input type",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "text" },
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
      description: "에러 메시지 (표시 시 빨간색 border)",
      table: {
        type: { summary: "string" },
      },
    },
    helpText: {
      control: "text",
      description: "도움말 텍스트 (error가 없을 때만 표시)",
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
      description: "값 변경 시 호출되는 콜백 (value를 인자로 받음)",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
    onValidate: {
      description: "값 변경 시 검증 함수 (error 반환 시 외부에서 error prop으로 전달)",
      table: {
        type: { summary: "(value: string) => string | undefined" },
      },
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

export const WithValidation: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | undefined>();

    const handleValidate = (val: string) => {
      if (!val) {
        setError(undefined);
        return undefined;
      }
      if (val.length < 3) {
        setError("3자 이상 입력하세요");
        return "3자 이상 입력하세요";
      }
      setError(undefined);
      return undefined;
    };

    return (
      <Input
        {...args}
        name="username"
        label="사용자명"
        value={value}
        onChange={setValue}
        onValidate={handleValidate}
        error={error}
        helpText="3자 이상 입력하세요"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "onValidate를 사용하여 실시간 검증을 구현한 예시입니다.",
      },
    },
  },
};

export const AriaLabel: Story = {
  args: {
    name: "search",
    placeholder: "검색어 입력",
    "aria-label": "검색",
  },
  parameters: {
    docs: {
      description: {
        story: "label prop 없이 사용할 때는 aria-label을 제공하여 접근성을 보장합니다.",
      },
    },
  },
};

