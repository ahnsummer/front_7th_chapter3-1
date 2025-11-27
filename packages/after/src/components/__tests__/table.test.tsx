import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "../ui/table";

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
    it("striped가 true일 때 striped 스타일을 적용한다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} striped />
      );
      const table = container.querySelector("table");
      expect(table?.className).toContain("nth-child(even)");
    });

    it("striped가 false일 때 striped 스타일을 적용하지 않는다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} striped={false} />
      );
      const table = container.querySelector("table");
      expect(table?.className).not.toContain("nth-child(even)");
    });
  });

  describe("bordered prop", () => {
    it("bordered가 true일 때 border 클래스를 적용한다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} bordered />
      );
      const table = container.querySelector("table");
      expect(table).toHaveClass("border");
    });

    it("bordered가 false일 때 border 클래스를 적용하지 않는다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} bordered={false} />
      );
      const table = container.querySelector("table");
      expect(table?.className).not.toContain("border-black");
    });
  });

  describe("hover prop", () => {
    it("hover가 true일 때 hover 스타일을 적용한다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} hover />
      );
      const table = container.querySelector("table");
      // [&_tbody_tr:hover]:bg-black/4 형식의 클래스 확인
      expect(table?.className).toContain("[&_tbody_tr:hover]");
    });

    it("hover가 false일 때 hover 스타일을 적용하지 않는다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} hover={false} />
      );
      const table = container.querySelector("table");
      expect(table?.className).not.toContain("[&_tbody_tr:hover]");
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
        expect(div).toHaveClass("cursor-pointer");
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
        expect(row).toHaveClass("cursor-pointer");
      });
    });

    it("onRowClick이 없을 때 row cursor가 default이다", () => {
      const { container } = render(
        <Table data={mockData} columns={mockColumns} />
      );
      const rows = container.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        expect(row).toHaveClass("cursor-default");
      });
    });
  });

  describe("render 함수를 통한 커스텀 렌더링", () => {
    it("column에 render 함수가 있으면 해당 함수로 렌더링한다", () => {
      const columnsWithRender = [
        { key: "id", header: "ID" },
        {
          key: "name",
          header: "Name",
          render: (row: any) => <strong>{row.name}</strong>,
        },
      ];
      render(<Table data={mockData} columns={columnsWithRender} />);
      const boldName = screen.getByText("John");
      expect(boldName.tagName).toBe("STRONG");
    });

    it("render 함수가 없으면 기본값으로 렌더링한다", () => {
      const columnsWithRender = [
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
      ];
      render(<Table data={mockData} columns={columnsWithRender} />);
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("render 함수에서 버튼을 렌더링할 수 있다", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      const columnsWithAction = [
        { key: "name", header: "Name" },
        {
          key: "action",
          header: "Action",
          render: (row: any) => (
            <button onClick={() => handleClick(row)}>클릭</button>
          ),
        },
      ];
      render(<Table data={mockData} columns={columnsWithAction} />);
      
      const buttons = screen.getAllByText("클릭");
      await user.click(buttons[0]);
      expect(handleClick).toHaveBeenCalledWith(mockData[0]);
    });

    it("render 함수에서 복잡한 JSX를 렌더링할 수 있다", () => {
      const columnsWithComplex = [
        {
          key: "info",
          header: "Info",
          render: (row: any) => (
            <div>
              <span>{row.name}</span> - <span>{row.age}세</span>
            </div>
          ),
        },
      ];
      render(<Table data={mockData} columns={columnsWithComplex} />);
      expect(screen.getByText(/John/)).toBeInTheDocument();
      expect(screen.getByText(/30세/)).toBeInTheDocument();
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

      // 스타일 클래스 (Tailwind)
      const { container } = render(
        <Table data={largeData} striped bordered hover />
      );
      const table = container.querySelector("table");
      expect(table?.className).toContain("bg-white");
      expect(table?.className).toContain("border-collapse");
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

    it("render 함수에서 undefined 값을 처리할 수 있다", () => {
      const dataWithNoViews = [{ id: 1, views: undefined }];
      const columnsWithRender = [
        { key: "id", header: "ID" },
        {
          key: "views",
          header: "Views",
          render: (row: any) => row.views?.toLocaleString() || "0",
        },
      ];
      render(<Table data={dataWithNoViews} columns={columnsWithRender} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("render 함수에서 null 값을 처리할 수 있다", () => {
      const dataWithNoLogin = [{ id: 1, lastLogin: null }];
      const columnsWithRender = [
        { key: "id", header: "ID" },
        {
          key: "lastLogin",
          header: "Last Login",
          render: (row: any) => row.lastLogin || "-",
        },
      ];
      render(<Table data={dataWithNoLogin} columns={columnsWithRender} />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });
});
