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
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md ${className}`}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm text-slate-300">
        <thead className="bg-slate-850 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
        <tbody className="divide-y divide-slate-800/60 bg-transparent">
          {loading ? (
            // Skeleton Loader
            [...Array(3)].map((_, rIdx) => (
              <tr key={rIdx} className="animate-pulse">
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-6 py-4">
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            // Data Rows
            data.map((row, rIdx) => (
              <tr
                key={row.id || rIdx}
                className="hover:bg-slate-850/40 transition-colors duration-150"
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
