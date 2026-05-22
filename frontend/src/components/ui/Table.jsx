import React from 'react';

/**
 * A highly styled and reusable Table component.
 */
export const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'Tidak ada data ditemukan.',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-stone-200/85 bg-white/75 backdrop-blur-md ${className}`}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm text-stone-700">
        <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-550">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`px-6 py-4 font-semibold ${col.className || ''}`}
                style={{ width: col.width || 'auto' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 bg-transparent">
          {loading ? (
            // Skeleton Loader
            [...Array(3)].map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse">
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-6 py-4">
                    <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-stone-400 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            // Data Rows
            data.map((row, rIdx) => (
              <tr
                key={row.id || rIdx}
                className="hover:bg-indigo-50/20 transition-colors duration-150"
              >
                {columns.map((col, cIdx) => {
                  const cellValue = row[col.key];
                  return (
                    <td key={col.key || cIdx} className={`px-6 py-4 font-normal ${col.className || ''}`}>
                      {col.render ? col.render(cellValue, row, rIdx) : cellValue ?? '-'}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
