import { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@repo/utils";
import { Button } from "./button";

const tableContainerVariants = cva("overflow-x-auto");

const tableVariants = cva("w-full border-collapse text-sm bg-white dark:bg-gray-50", {
  variants: {
    striped: {
      true: "[&_tbody_tr:nth-child(even)]:bg-gray-50 dark:[&_tbody_tr:nth-child(even)]:bg-gray-100",
      false: "",
    },
    bordered: {
      true: "border border-black/12 [&_th]:border [&_th]:border-black/12 [&_td]:border [&_td]:border-black/12",
      false: "",
    },
    hover: {
      true: "[&_tbody_tr:hover]:bg-black/4 dark:[&_tbody_tr:hover]:bg-white/10",
      false: "",
    },
  },
  defaultVariants: {
    striped: false,
    bordered: false,
    hover: false,
  },
});

const theadVariants = cva("bg-gray-50 dark:bg-gray-100");

const thVariants = cva(
  "px-4 py-4 text-left font-medium text-xs text-black/60 dark:text-gray-600 uppercase tracking-wide border-b-2 border-black/12 dark:border-gray-200"
);

const tdVariants = cva("px-4 py-4 text-black/87 dark:text-gray-700 border-b border-black/8 dark:border-gray-200");

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

type Column<T = any> = {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T = any> = {
  columns?: Column<T>[];
  data?: T[];
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  onRowClick?: (row: T) => void;
};

const Table = <T extends Record<string, any> = any>({
  columns,
  data = [],
  striped = false,
  bordered = false,
  hover = false,
  pageSize = 10,
  searchable = false,
  sortable = false,
  onRowClick,
}: TableProps<T>) => {
  const [tableData, setTableData] = useState<T[]>(data);
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

  const actualColumns: Column<T>[] =
    columns ||
    (tableData[0]
      ? Object.keys(tableData[0]).map((key) => ({
          key,
          header: key,
        }))
      : []);

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
                  {column.render ? column.render(row) : row[column.key]}
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
