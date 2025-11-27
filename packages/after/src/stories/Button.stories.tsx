import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../components/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "사용자 인터랙션을 위한 버튼 컴포넌트입니다. 다양한 variant, size를 지원하며 접근성을 고려하여 설계되었습니다.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "button-name",
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
      options: ["primary", "secondary", "danger", "success", "info"],
      description: "버튼의 시각적 스타일 variant",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "버튼의 크기",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "너비를 100%로 설정",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: "boolean",
      description: "버튼 비활성화 상태",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "HTML button type 속성",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "button" },
      },
    },
    asChild: {
      control: "boolean",
      description: "자식 컴포넌트를 버튼으로 렌더링 (Radix Slot 사용)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    children: {
      control: "text",
      description: "버튼 내용",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    onClick: {
      description: "클릭 이벤트 핸들러",
      table: {
        type: { summary: "() => void" },
      },
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success Button",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Info Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
  parameters: {
    docs: {
      description: {
        story: "비활성화된 버튼은 클릭할 수 없으며, 투명도가 낮아집니다.",
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
  parameters: {
    layout: "padded",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
      <Button variant="info">Info</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

