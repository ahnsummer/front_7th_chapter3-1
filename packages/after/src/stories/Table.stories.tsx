import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Table } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import type { Column } from "../components/ui/table";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "데이터를 테이블 형태로 표시하는 컴포넌트입니다. 검색, 정렬, 페이지네이션을 지원하며, column.render 함수를 통해 커스텀 셀 렌더링이 가능합니다.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "table",
            enabled: true,
          },
          {
            id: "th-has-data-cells",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      description: "테이블 컬럼 정의 배열. render 함수로 커스텀 렌더링 가능",
      table: {
        type: { summary: "Column<T>[]" },
      },
    },
    data: {
      description: "테이블에 표시할 데이터 배열",
      table: {
        type: { summary: "T[]" },
      },
    },
    striped: {
      control: "boolean",
      description: "짝수 행에 배경색 적용",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    bordered: {
      control: "boolean",
      description: "테두리 표시",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    hover: {
      control: "boolean",
      description: "행 hover 효과",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    searchable: {
      control: "boolean",
      description: "검색 기능 활성화",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    sortable: {
      control: "boolean",
      description: "정렬 기능 활성화",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    pageSize: {
      control: "number",
      description: "페이지당 표시할 행 수",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "10" },
      },
    },
    onRowClick: {
      description: "행 클릭 시 호출되는 콜백",
      table: {
        type: { summary: "(row: T) => void" },
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    status: "active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    status: "inactive",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    age: 28,
    status: "active",
  },
];

const basicColumns = [
  { key: "id", header: "ID", width: "60px" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "age", header: "Age", width: "80px" },
];

export const Basic: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
  },
};

export const Striped: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    striped: true,
  },
};

export const Bordered: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    bordered: true,
  },
};

export const Hover: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    hover: true,
  },
};

export const Searchable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    searchable: true,
  },
};

export const Sortable: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    sortable: true,
  },
};

export const WithPagination: Story = {
  args: {
    data: Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + (i % 30),
    })),
    columns: basicColumns,
    pageSize: 10,
  },
};

export const AllFeatures: Story = {
  args: {
    data: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + (i % 30),
    })),
    columns: basicColumns,
    striped: true,
    hover: true,
    searchable: true,
    sortable: true,
    pageSize: 10,
  },
};

type User = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "moderator" | "user" | "guest";
  status: "active" | "inactive";
  createdAt: string;
};

const userRoleConfig = {
  admin: { variant: "danger" as const, text: "관리자" },
  moderator: { variant: "warning" as const, text: "운영자" },
  user: { variant: "primary" as const, text: "사용자" },
  guest: { variant: "secondary" as const, text: "게스트" },
};

const userStatusConfig = {
  active: { variant: "success" as const, text: "활성" },
  inactive: { variant: "warning" as const, text: "비활성" },
};

export const WithCustomRender: Story = {
  args: {},
  render: () => {
    const userData: User[] = [
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        status: "active",
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        username: "john",
        email: "john@example.com",
        role: "user",
        status: "active",
        createdAt: "2024-01-02",
      },
      {
        id: 3,
        username: "jane",
        email: "jane@example.com",
        role: "moderator",
        status: "inactive",
        createdAt: "2024-01-03",
      },
    ];

    const userColumns: Column<User>[] = [
      { key: "id", header: "ID", width: "60px" },
      { key: "username", header: "사용자명", width: "150px" },
      { key: "email", header: "이메일" },
      {
        key: "role",
        header: "역할",
        width: "120px",
        render: (user) => {
          const config = userRoleConfig[user.role];
          return <Badge variant={config.variant}>{config.text}</Badge>;
        },
      },
      {
        key: "status",
        header: "상태",
        width: "100px",
        render: (user) => {
          const config = userStatusConfig[user.status];
          return (
            <Badge variant={config.variant} showIcon>
              {config.text}
            </Badge>
          );
        },
      },
      { key: "createdAt", header: "가입일", width: "120px" },
      {
        key: "actions",
        header: "관리",
        width: "200px",
        render: () => (
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={fn()}>
              수정
            </Button>
            <Button size="sm" variant="danger" onClick={fn()}>
              삭제
            </Button>
          </div>
        ),
      },
    ];

    return <Table columns={userColumns} data={userData} striped hover />;
  },
};

export const OnRowClick: Story = {
  args: {
    data: sampleData,
    columns: basicColumns,
    onRowClick: fn(),
    hover: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: basicColumns,
  },
};
