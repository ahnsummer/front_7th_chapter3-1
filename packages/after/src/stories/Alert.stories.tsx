import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Alert } from "../components/ui/alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "사용자에게 중요한 정보를 전달하는 Alert 컴포넌트입니다. 다양한 variant와 닫기 기능을 제공합니다.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "aria-roles",
            enabled: true,
          },
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "info", "success", "warning", "danger"],
      description: "Alert의 색상 및 의미를 나타내는 variant",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
      },
    },
    title: {
      control: "text",
      description: "Alert 제목 (선택사항)",
      table: {
        type: { summary: "string" },
      },
    },
    children: {
      control: "text",
      description: "Alert 메시지 내용",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    showIcon: {
      control: "boolean",
      description: "variant에 따른 아이콘 표시 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: true },
      },
    },
    onClose: {
      description: "닫기 버튼 클릭 시 호출되는 콜백 (제공 시 닫기 버튼 표시)",
      table: {
        type: { summary: "() => void" },
      },
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "This is a primary alert message.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "This is an informational message.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "작업이 성공적으로 완료되었습니다!",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "주의가 필요한 상황입니다.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "오류가 발생했습니다. 다시 시도해주세요.",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "success",
    title: "성공",
    children: "사용자가 성공적으로 생성되었습니다.",
  },
};

export const WithCloseButton: Story = {
  args: {
    variant: "info",
    title: "알림",
    children: "이 메시지는 닫을 수 있습니다.",
    onClose: fn(),
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: "warning",
    showIcon: false,
    children: "아이콘 없는 경고 메시지입니다.",
  },
};

export const LongMessage: Story = {
  args: {
    variant: "info",
    title: "상세 정보",
    children:
      "이것은 매우 긴 메시지입니다. 여러 줄에 걸쳐 표시될 수 있으며, 사용자에게 중요한 정보를 전달할 때 사용됩니다. Alert 컴포넌트는 이러한 긴 텍스트도 적절하게 표시할 수 있도록 설계되었습니다.",
    onClose: fn(),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-[600px]">
      <Alert variant="primary">Primary alert message</Alert>
      <Alert variant="info">Info alert message</Alert>
      <Alert variant="success">Success alert message</Alert>
      <Alert variant="warning">Warning alert message</Alert>
      <Alert variant="danger">Danger alert message</Alert>
    </div>
  ),
};

