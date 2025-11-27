import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "모달 다이얼로그 컴포넌트입니다. 단순 사용과 조립형 사용 두 가지 방식을 지원하며, 배경 클릭으로 닫기, 스크롤 방지 등의 기능을 제공합니다.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "aria-dialog-name",
            enabled: true,
          },
          {
            id: "focus-trap",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "다이얼로그 표시 여부",
      table: {
        type: { summary: "boolean" },
      },
    },
    onClose: {
      description: "닫기 시 호출되는 콜백 (배경 클릭, ESC 키)",
      table: {
        type: { summary: "() => void" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "다이얼로그 크기",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
      },
    },
    title: {
      control: "text",
      description: "간단한 제목 문자열 (자동으로 헤더 생성)",
      table: {
        type: { summary: "string" },
      },
    },
    header: {
      description: "커스텀 헤더 컨텐츠 (title보다 우선)",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    children: {
      description: "다이얼로그 본문 내용",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    showFooter: {
      control: "boolean",
      description: "푸터 표시 여부",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    footer: {
      description: "커스텀 푸터 컨텐츠",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    isOpen: true,
    title: "간단한 다이얼로그",
    children: "이것은 간단한 다이얼로그 예시입니다.",
    showFooter: true,
    footerContent: (
      <>
        <Button variant="secondary" size="md">취소</Button>
        <Button variant="primary" size="md">확인</Button>
      </>
    ),
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    title: "사용자 등록",
    size: "md",
    children: (
      <div className="space-y-4">
        <Input name="username" label="사용자명" placeholder="사용자명 입력" onChange={() => {}} />
        <Input name="email" label="이메일" type="email" placeholder="이메일 입력" onChange={() => {}} />
      </div>
    ),
    showFooter: true,
    footerContent: (
      <>
        <Button variant="secondary" size="md">취소</Button>
        <Button variant="primary" size="md">등록</Button>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    isOpen: true,
    title: "작은 다이얼로그",
    size: "sm",
    children: "작은 크기의 다이얼로그입니다.",
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    title: "큰 다이얼로그",
    size: "lg",
    children: (
      <div className="space-y-4">
        <p>큰 크기의 다이얼로그로 많은 콘텐츠를 담을 수 있습니다.</p>
        <p>여러 섹션으로 구성된 복잡한 폼이나 긴 설명 텍스트에 적합합니다.</p>
        <p>필요에 따라 스크롤이 가능하도록 설계되었습니다.</p>
      </div>
    ),
  },
};

export const CustomHeader: Story = {
  args: {
    isOpen: true,
    header: (
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-bold">커스텀 헤더</h2>
        <span className="text-sm text-gray-500">추가 정보</span>
      </div>
    ),
    children: "커스텀 헤더를 사용한 다이얼로그입니다.",
  },
};

export const ComposableDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>다이얼로그 열기</Button>
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>조립형 다이얼로그</DialogTitle>
            <DialogClose onClick={() => setIsOpen(false)} />
          </DialogHeader>
          <DialogBody>
            <p>DialogHeader, DialogTitle, DialogBody, DialogFooter를</p>
            <p>조합하여 사용할 수 있습니다.</p>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" size="md" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsOpen(false)}>
              확인
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "DialogHeader, DialogTitle, DialogBody, DialogFooter를 조립하여 더 세밀한 제어가 가능합니다.",
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    title: "긴 콘텐츠",
    size: "md",
    children: (
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>이것은 {i + 1}번째 문단입니다. 긴 콘텐츠가 스크롤 가능한지 확인합니다.</p>
        ))}
      </div>
    ),
    showFooter: true,
    footerContent: <Button variant="primary">확인</Button>,
  },
};

