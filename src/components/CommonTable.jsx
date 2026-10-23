import "./../App.css";

export default function CommonTable({
  columns,
  data,
  emptyMessage = "No records available",
  actions,
}) {
  if (!data || data.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="common-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}

              {actions && (
                <td className="action-cell">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}