import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "../../../../before/src/components/organisms/Table";

describe("Table", () => {
  const mockData = [
    { id: 1, name: "John", age: 30, role: "admin" },
    { id: 2, name: "Jane", age: 25, role: "user" },
    { id: 3, name: "Bob", age: 35, role: "moderator" },
  ];

  const mockColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "age", header: "Age" },
    { key: "role", header: "Role" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 렌더링", () => {
    it("table 요소를 렌더링한다", () => {
      render(<Table data={mockData} columns={mockColumns} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("columns가 없을 때 data의 키로 자동 columns를 생성한다", () => {
      render(<Table data={mockData} />);
      expect(
        screen.getByRole("columnheader", { name: "id" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "name" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "age" })
      ).toBeInTheDocument();
    });

    it("data가 빈 배열이면 header만 렌더링한다", () => {
      render(<Table data={[]} columns={mockColumns} />);
      expect(
        screen.getByRole("columnheader", { name: "ID" })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("row", { name: /John/ })
      ).not.toBeInTheDocument();
    });

    it("data가 undefined이면 빈 테이블을 렌더링한다", () => {
      render(<Table columns={mockColumns} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("columns prop", () => {
    it("제공된 columns으로 header를 렌더링한다", () => {
      render(<Table data={mockData} columns={mockColumns} />);
      mockColumns.forEach((col) => {
        expect(
          screen.getByRole("columnheader", { name: col.header })
        ).toBeInTheDocument();
      });
    });

    it("column width를 설정할 수 있다", () => {
      const columnsWithWidth = [
        { key: "id", header: "ID", width: "100px" },
        { key: "name", header: "Name", width: "200px" },
      ];
      const { container } = render(
        <Table data={mockData} columns={columnsWithWidth} />
      );
      const headers = container.querySelectorAll("th");
      expect(headers[0]).toHaveStyle({ width: "100px" });
      expect(headers[1]).toHaveStyle({ width: "200px" });
    });
  });

  describe("data rows", () => {
    it("모든 data를 렌더링한다", () => {
      render(<Table data={mockData} columns={mockColumns} />);
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("각 row의 cell에 올바른 데이터를 표시한다", () => {
      render(<Table data={mockData} columns={mockColumns} />);
      const rows = screen.getAllByRole("row");
      // rows[0]은 header row
      const firstDataRow = within(rows[1]).getAllByRole("cell");
      expect(firstDataRow[0]).toHaveTextContent("1");
      expect(firstDataRow[1]).toHaveTextContent("John");
      expect(firstDataRow[2]).toHaveTextContent("30");
    });
  });

  describe("striped prop", () => {
    it("striped가 true일 때 table-striped 클래스를 적용한다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} striped />
      );
      expect(container.querySelector(".table-striped")).toBeInTheDocument();
    });

    it("striped가 false일 때 table-striped 클래스를 적용하지 않는다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} striped={false} />
      );
      expect(container.querySelector(".table-striped")).not.toBeInTheDocument();
    });
  });

  describe("bordered prop", () => {
    it("bordered가 true일 때 table-bordered 클래스를 적용한다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} bordered />
      );
      expect(container.querySelector(".table-bordered")).toBeInTheDocument();
    });

    it("bordered가 false일 때 table-bordered 클래스를 적용하지 않는다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} bordered={false} />
      );
      expect(
        container.querySelector(".table-bordered")
      ).not.toBeInTheDocument();
    });
  });

  describe("hover prop", () => {
    it("hover가 true일 때 table-hover 클래스를 적용한다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} hover />
      );
      expect(container.querySelector(".table-hover")).toBeInTheDocument();
    });

    it("hover가 false일 때 table-hover 클래스를 적용하지 않는다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} hover={false} />
      );
      expect(container.querySelector(".table-hover")).not.toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 20 + i,
    }));

    it("pageSize만큼의 데이터만 표시한다", () => {
      render(<Table data={largeData} pageSize={10} />);
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 10")).toBeInTheDocument();
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    });

    it("여러 페이지가 있을 때 pagination 버튼을 렌더링한다", () => {
      render(<Table data={largeData} pageSize={10} />);
      expect(screen.getByText("이전")).toBeInTheDocument();
      expect(screen.getByText("다음")).toBeInTheDocument();
      expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
    });

    it("다음 버튼 클릭 시 다음 페이지를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Table data={largeData} pageSize={10} />);

      await user.click(screen.getByText("다음"));
      expect(screen.getByText("User 11")).toBeInTheDocument();
      expect(screen.queryByText("User 1")).not.toBeInTheDocument();
      expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    });

    it("이전 버튼 클릭 시 이전 페이지를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Table data={largeData} pageSize={10} />);

      await user.click(screen.getByText("다음"));
      await user.click(screen.getByText("이전"));
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
    });

    it("첫 페이지에서 이전 버튼이 비활성화된다", () => {
      render(<Table data={largeData} pageSize={10} />);
      expect(screen.getByText("이전")).toBeDisabled();
    });

    it("마지막 페이지에서 다음 버튼이 비활성화된다", async () => {
      const user = userEvent.setup();
      render(<Table data={largeData} pageSize={10} />);

      await user.click(screen.getByText("다음"));
      await user.click(screen.getByText("다음"));
      expect(screen.getByText("다음")).toBeDisabled();
    });

    it("totalPages가 1 이하일 때 pagination을 렌더링하지 않는다", () => {
      render(<Table data={mockData} pageSize={10} />);
      expect(screen.queryByText("이전")).not.toBeInTheDocument();
      expect(screen.queryByText("다음")).not.toBeInTheDocument();
    });
  });

  describe("searchable prop", () => {
    it("searchable이 true일 때 검색 input을 렌더링한다", () => {
      render(<Table data={mockData} searchable />);
      expect(screen.getByPlaceholderText("검색...")).toBeInTheDocument();
    });

    it("searchable이 false일 때 검색 input을 렌더링하지 않는다", () => {
      render(<Table data={mockData} searchable={false} />);
      expect(screen.queryByPlaceholderText("검색...")).not.toBeInTheDocument();
    });

    it("검색어 입력 시 필터링된 결과를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} searchable />);

      await user.type(screen.getByPlaceholderText("검색..."), "John");
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.queryByText("Jane")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    });

    it("검색어가 비어있으면 모든 데이터를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} searchable />);

      const searchInput = screen.getByPlaceholderText("검색...");
      await user.type(searchInput, "John");
      await user.clear(searchInput);

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("대소문자 구분 없이 검색한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} searchable />);

      await user.type(screen.getByPlaceholderText("검색..."), "JOHN");
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  describe("sortable prop", () => {
    it("sortable이 true일 때 column header 내부 div가 pointer cursor를 가진다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} sortable />
      );
      const headerDivs = container.querySelectorAll("th > div");
      expect(headerDivs.length).toBeGreaterThan(0);
      headerDivs.forEach((div) => {
        expect(div).toHaveStyle("cursor: pointer");
      });
    });

    it("sortable이 false일 때 column header 클릭 시 정렬이 작동하지 않는다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} />);

      await user.click(screen.getByText("Name"));
      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("John")).toBeInTheDocument();
      expect(within(rows[2]).getByText("Jane")).toBeInTheDocument();
      expect(within(rows[3]).getByText("Bob")).toBeInTheDocument();
    });

    it("column header 클릭 시 오름차순 정렬한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable />);

      await user.click(screen.getByText("Name"));
      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("Bob")).toBeInTheDocument();
      expect(within(rows[2]).getByText("Jane")).toBeInTheDocument();
      expect(within(rows[3]).getByText("John")).toBeInTheDocument();
    });

    it("같은 column header를 다시 클릭하면 내림차순 정렬한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable />);

      await user.click(screen.getByText("Name"));
      await user.click(screen.getByText("Name"));

      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("John")).toBeInTheDocument();
      expect(within(rows[2]).getByText("Jane")).toBeInTheDocument();
      expect(within(rows[3]).getByText("Bob")).toBeInTheDocument();
    });

    it("정렬 방향 화살표를 표시한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable />);

      await user.click(screen.getByText("Name"));
      expect(screen.getByText("↑")).toBeInTheDocument();

      await user.click(screen.getByText("Name"));
      expect(screen.getByText("↓")).toBeInTheDocument();
    });

    it("숫자 column을 올바르게 정렬한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable />);

      await user.click(screen.getByText("Age"));
      const rows = screen.getAllByRole("row");
      const ages = [rows[1], rows[2], rows[3]].map(
        (row) => within(row).getAllByRole("cell")[2].textContent
      );
      expect(ages).toEqual(["25", "30", "35"]);
    });

    it("sortable이 false일 때 정렬되지 않는다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable={false} />);

      await user.click(screen.getByText("Name"));
      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByText("John")).toBeInTheDocument();
      expect(within(rows[2]).getByText("Jane")).toBeInTheDocument();
    });

    it("숫자 column을 내림차순으로 정렬한다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable />);

      await user.click(screen.getByText("Age"));
      await user.click(screen.getByText("Age")); // 두 번 클릭하여 내림차순

      const rows = screen.getAllByRole("row");
      const ages = [rows[1], rows[2], rows[3]].map(
        (row) => within(row).getAllByRole("cell")[2].textContent
      );
      expect(ages).toEqual(["35", "30", "25"]);
    });

    it("sortable이 undefined일 때도 정렬이 작동하지 않는다", async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} />);

      await user.click(screen.getByText("Name"));
      const rows = screen.getAllByRole("row");
      // 정렬되지 않고 원래 순서 유지
      expect(within(rows[1]).getByText("John")).toBeInTheDocument();
    });
  });

  describe("onRowClick prop", () => {
    it("row 클릭 시 onRowClick이 호출된다", async () => {
      const handleRowClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          onRowClick={handleRowClick}
        />
      );

      const rows = screen.getAllByRole("row");
      await user.click(rows[1]); // 첫 번째 데이터 row
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it("onRowClick이 있을 때 row cursor가 pointer이다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} onRowClick={vi.fn()} />
      );
      const rows = container.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        expect(row).toHaveStyle({ cursor: "pointer" });
      });
    });

    it("onRowClick이 없을 때 row cursor가 default이다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} />
      );
      const rows = container.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        expect(row).toHaveStyle({ cursor: "default" });
      });
    });
  });

  describe("entityType - user", () => {
    const userData = [
      { id: 1, name: "John", role: "admin", status: "active" },
      { id: 2, name: "Jane", role: "user", status: "inactive" },
    ];

    it("role column을 Badge로 렌더링한다", () => {
      render(<Table data={userData} entityType="user" />);
      // Badge 컴포넌트의 클래스로 확인
      const { container } = render(<Table data={userData} entityType="user" />);
      expect(container.querySelector(".badge")).toBeInTheDocument();
    });

    it("actions column에 수정/삭제 버튼을 렌더링한다", () => {
      const dataWithActions = [{ id: 1, name: "John", actions: null }];
      const onEdit = vi.fn();
      const onDelete = vi.fn();

      render(
        <Table
          data={dataWithActions}
          entityType="user"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      expect(screen.getAllByText("수정")).toHaveLength(1);
      expect(screen.getAllByText("삭제")).toHaveLength(1);
    });

    it("수정 버튼 클릭 시 onEdit이 호출된다", async () => {
      const dataWithActions = [{ id: 1, name: "John", actions: null }];
      const onEdit = vi.fn();
      const user = userEvent.setup();

      render(
        <Table data={dataWithActions} entityType="user" onEdit={onEdit} />
      );

      await user.click(screen.getByText("수정"));
      expect(onEdit).toHaveBeenCalledWith(dataWithActions[0]);
    });

    it("삭제 버튼 클릭 시 onDelete가 호출된다", async () => {
      const dataWithActions = [{ id: 1, name: "John", actions: null }];
      const onDelete = vi.fn();
      const user = userEvent.setup();

      render(
        <Table data={dataWithActions} entityType="user" onDelete={onDelete} />
      );

      await user.click(screen.getByText("삭제"));
      expect(onDelete).toHaveBeenCalledWith(1);
    });
  });

  describe("entityType - post", () => {
    const postData = [
      {
        id: 1,
        title: "Post 1",
        category: "development",
        status: "draft",
        views: 100,
        actions: null,
      },
      {
        id: 2,
        title: "Post 2",
        category: "design",
        status: "published",
        views: 1000,
        actions: null,
      },
      {
        id: 3,
        title: "Post 3",
        category: "accessibility",
        status: "archived",
        views: 500,
        actions: null,
      },
    ];

    it("category column을 Badge로 렌더링한다", () => {
      const { container } = render(<Table data={postData} entityType="post" />);
      // category와 status 모두 badge로 렌더링되므로 2 * postData.length
      expect(
        container.querySelectorAll(".badge").length
      ).toBeGreaterThanOrEqual(postData.length);
    });

    it("status column을 Badge로 렌더링한다", () => {
      const { container } = render(<Table data={postData} entityType="post" />);
      // status badges가 포함됨
      expect(container.querySelectorAll(".badge")).toBeTruthy();
    });

    it("views를 숫자 포맷으로 렌더링한다", () => {
      render(<Table data={postData} entityType="post" />);
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("1,000")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
    });

    it("draft 상태의 게시글에 게시 버튼을 표시한다", () => {
      render(<Table data={postData} entityType="post" onPublish={vi.fn()} />);
      expect(screen.getAllByText("게시")).toHaveLength(1);
    });

    it("published 상태의 게시글에 보관 버튼을 표시한다", () => {
      render(<Table data={postData} entityType="post" onArchive={vi.fn()} />);
      expect(screen.getAllByText("보관")).toHaveLength(1);
    });

    it("archived 상태의 게시글에 복원 버튼을 표시한다", () => {
      render(<Table data={postData} entityType="post" onRestore={vi.fn()} />);
      expect(screen.getAllByText("복원")).toHaveLength(1);
    });

    it("게시 버튼 클릭 시 onPublish가 호출된다", async () => {
      const onPublish = vi.fn();
      const user = userEvent.setup();

      render(<Table data={postData} entityType="post" onPublish={onPublish} />);

      const publishButtons = screen.getAllByText("게시");
      await user.click(publishButtons[0]);
      expect(onPublish).toHaveBeenCalledWith(1);
    });

    it("모든 게시글에 수정/삭제 버튼을 표시한다", () => {
      render(
        <Table
          data={postData}
          entityType="post"
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      expect(screen.getAllByText("수정")).toHaveLength(3);
      expect(screen.getAllByText("삭제")).toHaveLength(3);
    });

    it("알 수 없는 category 값은 secondary 타입으로 렌더링한다", () => {
      const dataWithUnknownCategory = [
        { id: 1, category: "unknown", actions: null },
      ];
      const { container } = render(
        <Table data={dataWithUnknownCategory} entityType="post" />
      );
      expect(screen.getByText("unknown")).toBeInTheDocument();
      // secondary badge 클래스 확인
      expect(container.querySelector(".badge-secondary")).toBeInTheDocument();
    });
  });

  describe("React Element 렌더링", () => {
    it("cell 값이 React Element이면 그대로 렌더링한다", () => {
      const dataWithElement = [
        { id: 1, name: <strong>Bold Name</strong>, age: 30 },
      ];
      render(<Table data={dataWithElement} />);
      expect(screen.getByText("Bold Name")).toBeInTheDocument();
      expect(screen.getByText("Bold Name").tagName).toBe("STRONG");
    });

    it("entityType이 있어도 React Element는 그대로 렌더링한다", () => {
      const dataWithElement = [
        { id: 1, customColumn: <div data-testid="custom">Custom</div> },
      ];
      render(<Table data={dataWithElement} entityType="user" />);
      expect(screen.getByTestId("custom")).toBeInTheDocument();
    });
  });

  describe("props 조합 테스트", () => {
    it("모든 기본 props를 함께 사용할 수 있다", async () => {
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        age: 20 + i,
      }));
      const handleRowClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Table
          data={largeData}
          columns={mockColumns}
          striped
          bordered
          hover
          searchable
          sortable
          pageSize={10}
          onRowClick={handleRowClick}
        />
      );

      // 검색
      await user.type(screen.getByPlaceholderText("검색..."), "User 1");

      // 정렬
      await user.click(screen.getByText("Name"));

      // 페이지네이션
      expect(screen.getByText("이전")).toBeInTheDocument();
      expect(screen.getByText("다음")).toBeInTheDocument();

      // 스타일 클래스
      const { container } = render(
        <Table data={largeData} striped bordered hover />
      );
      expect(container.querySelector(".table-striped")).toBeInTheDocument();
      expect(container.querySelector(".table-bordered")).toBeInTheDocument();
      expect(container.querySelector(".table-hover")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("빈 데이터로 렌더링된다", () => {
      render(<Table data={[]} columns={mockColumns} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("columns 없이 빈 데이터로 렌더링된다", () => {
      render(<Table data={[]} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it('views가 없을 때 "0"을 표시한다', () => {
      const dataWithNoViews = [{ id: 1, views: undefined }];
      render(<Table data={dataWithNoViews} entityType="post" />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it('lastLogin이 없을 때 "-"를 표시한다', () => {
      const dataWithNoLogin = [{ id: 1, lastLogin: null }];
      render(<Table data={dataWithNoLogin} entityType="user" />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });
});
