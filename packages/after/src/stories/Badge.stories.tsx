import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/ui/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "상태, 카테고리, 역할 등을 표시하는 뱃지 컴포넌트입니다. 다양한 색상과 크기를 지원합니다.",
      },
    },
    a11y: {
      config: {
        rules: [
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
      options: ["primary", "secondary", "success", "danger", "warning", "info"],
      description: "뱃지의 색상 variant",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "뱃지의 크기",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
      },
    },
    pill: {
      control: "boolean",
      description: "완전히 둥근 모양 (rounded-full) 적용 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    showIcon: {
      control: "boolean",
      description: "아이콘 표시 여부 (미구현)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    children: {
      control: "text",
      description: "뱃지에 표시할 텍스트",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
      table: {
        type: { summary: "string" },
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Info",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Pill: Story = {
  args: {
    variant: "primary",
    pill: true,
    children: "Pill Badge",
  },
};

export const AllVariantsPill: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="primary" pill>Primary</Badge>
      <Badge variant="secondary" pill>Secondary</Badge>
      <Badge variant="success" pill>Success</Badge>
      <Badge variant="danger" pill>Danger</Badge>
      <Badge variant="warning" pill>Warning</Badge>
      <Badge variant="info" pill>Info</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 variant에 pill 속성을 적용한 예시입니다.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

