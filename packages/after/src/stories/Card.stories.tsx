import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "콘텐츠를 그룹화하는 카드 컴포넌트입니다. CardHeader, CardTitle, CardDescription, CardContent, CardFooter를 조합하여 사용합니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "카드 내용 (조립형 컴포넌트 사용 권장)",
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
  args: {
    children: "Card 내용",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {},
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  args: {},
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>확인이 필요합니다</CardTitle>
        <CardDescription>이 작업을 계속하시겠습니까?</CardDescription>
      </CardHeader>
      <CardContent>
        <p>이 작업은 되돌릴 수 없습니다.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">
          취소
        </Button>
        <Button variant="primary" size="sm">
          확인
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const UserProfile: Story = {
  args: {},
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>John Doe</CardTitle>
        <CardDescription>john@example.com</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>역할:</strong> 관리자
          </div>
          <div>
            <strong>가입일:</strong> 2024-01-01
          </div>
          <div>
            <strong>마지막 로그인:</strong> 2024-11-27
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm" fullWidth>
          프로필 수정
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ArticleCard: Story = {
  args: {},
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>리액트 컴포넌트 설계 패턴</CardTitle>
        <CardDescription>2024-11-27 • John Doe</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          효과적인 리액트 컴포넌트를 설계하는 방법에 대해 알아봅니다. 관심사의
          분리, 재사용성, 테스트 가능성 등을 고려한 설계 원칙을 다룹니다.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">조회 1,234</span>
        </div>
        <Button variant="primary" size="sm">
          자세히 보기
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const OnlyContent: Story = {
  args: {},
  render: () => (
    <Card className="w-[400px]">
      <CardContent className="pt-6">
        <p>헤더와 푸터 없이 콘텐츠만 있는 카드입니다.</p>
      </CardContent>
    </Card>
  ),
};

export const Multiple: Story = {
  args: {},
  render: () => (
    <div className="flex gap-4">
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p>First card content</p>
        </CardContent>
      </Card>
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Second card content</p>
        </CardContent>
      </Card>
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Third card content</p>
        </CardContent>
      </Card>
    </div>
  ),
};
