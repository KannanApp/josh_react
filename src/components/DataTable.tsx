import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "No records available",
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="table-card">
        <div className="skeleton-row" />
        <div className="skeleton-row" />
        <div className="skeleton-row" />
      </div>
    );
  }

  return (
    <div className="table-card">
      {data.length === 0 ? (
        <div className="empty-state">
          <span>{emptyMessage}</span>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="animated-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr
                  key={rowKey(row)}
                  className="table-row"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render
                        ? column.render(row)
                        : String((row as Record<string, unknown>)[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}