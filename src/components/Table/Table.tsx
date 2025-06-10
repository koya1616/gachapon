import type React from "react";

type TableColumn<T> = {
  header: React.ReactNode;
  accessor: keyof T | ((item: T) => React.ReactNode);
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
};

const Table = <T extends object>({ columns, data, keyExtractor }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={`header-${typeof column.accessor === "function" ? index : String(column.accessor)}`}
                className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className={"hover:bg-gray-50"}>
              {columns.map((column, index) => (
                <td
                  key={`cell-${keyExtractor(item)}-${typeof column.accessor === "function" ? index : String(column.accessor)}`}
                  className={"px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
                >
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : (item[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
