import React, { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@repo/utils";
import { Button } from "./button";
import { Badge, type BadgeProps } from "./badge";

const tableContainerVariants = cva("overflow-x-auto");

const tableVariants = cva("w-full border-collapse text-sm bg-white", {
  variants: {
    striped: {
      true: "[&_tbody_tr:nth-child(even)]:bg-gray-50",
      false: "",
    },
    bordered: {
      true: "border border-black/12 [&_th]:border [&_th]:border-black/12 [&_td]:border [&_td]:border-black/12",
      false: "",
    },
    hover: {
      true: "[&_tbody_tr:hover]:bg-black/4",
      false: "",
    },
  },
  defaultVariants: {
    striped: false,
    bordered: false,
    hover: false,
  },
});

const theadVariants = cva("bg-gray-50");

const thVariants = cva(
  "px-4 py-4 text-left font-medium text-xs text-black/60 uppercase tracking-wide border-b-2 border-black/12"
);

const tdVariants = cva("px-4 py-4 text-black/87 border-b border-black/8");

const tbodyLastRowVariants = cva("[&_tr:last-child_td]:border-b-0");

const searchInputVariants = cva(
  "px-3 py-2 border border-gray-300 rounded w-[300px] mb-4"
);

const paginationContainerVariants = cva("mt-4 flex gap-2 justify-center");

const sortHeaderVariants = cva("flex items-center gap-1", {
  variants: {
    sortable: {
      true: "cursor-pointer",
      false: "cursor-default",
    },
  },
});

type Column = {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
};

// 🚨 Bad Practice: UI 컴포넌트가 도메인 타입을 알고 있음
type TableProps = {
  columns?: Column[];
  data?: any[];
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  onRowClick?: (row: any) => void;

  // 🚨 도메인 관심사 추가
  entityType?: "user" | "post";
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
  onArchive?: (id: number) => void;
  onRestore?: (id: number) => void;
};

const Table = ({
  columns,
  data = [],
  striped = false,
  bordered = false,
  hover = false,
  pageSize = 10,
  searchable = false,
  sortable = false,
  onRowClick,
  entityType,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  onRestore,
}: TableProps) => {
  const [tableData, setTableData] = useState<any[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newDirection =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(columnKey);
    setSortDirection(newDirection);

    const sorted = [...tableData].sort((a, b) => {
      const aVal = a[columnKey];
      const bVal = b[columnKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return newDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return newDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setTableData(sorted);
  };

  const filteredData =
    searchable && searchTerm
      ? tableData.filter((row) =>
          Object.values(row).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : tableData;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const actualColumns =
    columns ||
    (tableData[0]
      ? Object.keys(tableData[0]).map((key) => ({
          key,
          header: key,
          width: undefined,
        }))
      : []);

  // 🚨 Bad Practice: Table 컴포넌트가 도메인별 렌더링 로직을 알고 있음
  const renderCell = (row: any, columnKey: string) => {
    const value = row[columnKey];

    // 도메인별 특수 렌더링
    if (entityType === "user") {
      if (columnKey === "role") {
        const badgeProps: Pick<BadgeProps, "variant" | "children"> = {
          variant: "primary",
          children: "",
        };

        switch (value) {
          case "admin":
            badgeProps.variant = "danger";
            badgeProps.children = "관리자";
            break;
          case "moderator":
            badgeProps.variant = "warning";
            badgeProps.children = "운영자";
            break;
          case "user":
            badgeProps.variant = "primary";
            badgeProps.children = "사용자";
            break;
          case "guest":
            badgeProps.variant = "secondary";
            badgeProps.children = "게스트";
            break;
        }

        return <Badge {...badgeProps} showIcon />;
      }
      if (columnKey === "status") {
        const badgeProps: Pick<BadgeProps, "variant" | "children"> = {
          variant: "primary",
          children: "",
        };

        switch (value) {
          case "active":
            badgeProps.variant = "success";
            badgeProps.children = "게시됨";
            break;
          case "inactive":
            badgeProps.variant = "warning";
            badgeProps.children = "임시저장";
            break;
          default:
            badgeProps.variant = "danger";
            badgeProps.children = "거부됨";
            break;
        }

        return <Badge {...badgeProps} showIcon />;
      }
      if (columnKey === "lastLogin") {
        return value || "-";
      }
      if (columnKey === "actions") {
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={() => onEdit?.(row)}>
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete?.(row.id)}>
              삭제
            </Button>
          </div>
        );
      }
    }

    if (entityType === "post") {
      if (columnKey === "category") {
        const type =
          value === "development"
            ? "primary"
            : value === "design"
            ? "info"
            : value === "accessibility"
            ? "danger"
            : "secondary";

        return (
          <Badge variant={type} pill>
            {value}
          </Badge>
        );
      }
      if (columnKey === "status") {
        const badgeProps: Pick<BadgeProps, "variant" | "children"> = {
          variant: "primary",
          children: "",
        };

        switch (value) {
          case "published":
            badgeProps.variant = "success";
            badgeProps.children = "게시됨";
            break;
          case "draft":
            badgeProps.variant = "warning";
            badgeProps.children = "임시저장";
            break;
          case "archived":
            badgeProps.variant = "secondary";
            badgeProps.children = "보관됨";
            break;
          case "pending":
            badgeProps.variant = "info";
            badgeProps.children = "대기중";
            break;
          case "rejected":
            badgeProps.variant = "danger";
            badgeProps.children = "거부됨";
            break;
        }

        return <Badge {...badgeProps} showIcon />;
      }
      if (columnKey === "views") {
        return value?.toLocaleString() || "0";
      }
      if (columnKey === "actions") {
        return (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="primary" onClick={() => onEdit?.(row)}>
              수정
            </Button>
            {row.status === "draft" && (
              <Button
                size="sm"
                variant="success"
                onClick={() => onPublish?.(row.id)}>
                게시
              </Button>
            )}
            {row.status === "published" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onArchive?.(row.id)}>
                보관
              </Button>
            )}
            {row.status === "archived" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onRestore?.(row.id)}>
                복원
              </Button>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete?.(row.id)}>
              삭제
            </Button>
          </div>
        );
      }
    }

    // React Element면 그대로 렌더링
    if (React.isValidElement(value)) {
      return value;
    }

    return value;
  };

  return (
    <div className={tableContainerVariants()}>
      {searchable && (
        <div>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={searchInputVariants()}
          />
        </div>
      )}

      <table className={cn(tableVariants({ striped, bordered, hover }))}>
        <thead className={theadVariants()}>
          <tr>
            {actualColumns.map((column) => (
              <th
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                onClick={() => sortable && handleSort(column.key)}
                className={thVariants()}>
                <div className={cn(sortHeaderVariants({ sortable }))}>
                  {column.header}
                  {sortable && sortColumn === column.key && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyLastRowVariants()}>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(onRowClick ? "cursor-pointer" : "cursor-default")}>
              {actualColumns.map((column) => (
                <td key={column.key} className={tdVariants()}>
                  {entityType ? renderCell(row, column.key) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={paginationContainerVariants()}>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            이전
          </Button>
          <span className="px-3 py-1.5">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
            다음
          </Button>
        </div>
      )}
    </div>
  );
};

export { Table, tableVariants };
export type { TableProps, Column };
