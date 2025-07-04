import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';

/**
 * Reusable data table component with professional styling.
 * Props:
 * - title: string
 * - columns: array of { accessorKey, header, cell? }
 * - data: array of row objects
 * - onAdd: () => void
 * - onView: (row) => void
 * - onEdit: (row) => void
 * - onDelete: (id) => void
 * - deletingId?: number | null
 */
export default function DataTable({ title, columns, data, onAdd, onView, onEdit, onDelete, deletingId }) {
  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const isDeleting = deletingId === row.original.id;
          return (
            <div className="flex items-center justify-start gap-2">
              <button
                onClick={() => onView?.(row.original)}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-sky-600 hover:text-white text-gray-600 dark:text-gray-300 rounded-lg shadow-sm transition focus:ring-2 focus:ring-sky-400"
                title="Ver"
              >
                <i className="fa-solid fa-eye" />
              </button>
              <button
                onClick={() => onEdit(row.original)}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white text-gray-600 dark:text-gray-300 rounded-lg shadow-sm transition focus:ring-2 focus:ring-indigo-400"
                title="Editar"
              >
                <i className="fa-solid fa-user-pen" />
              </button>
              <button
                onClick={() => onDelete(row.original.id)}
                className={clsx(
                  'p-2 rounded-lg shadow-sm transition focus:ring-2',
                  isDeleting
                    ? 'bg-red-100 dark:bg-red-800 text-red-500 animate-pulse cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-red-600 hover:text-white text-gray-600 dark:text-gray-300 focus:ring-red-400'
                )}
                disabled={isDeleting}
                title="Eliminar"
              >
                {isDeleting ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  <i className="fa-solid fa-trash" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 text-white font-medium px-4 py-2 rounded-lg shadow transition"
        >
          <i className="fa-solid fa-plus" />
          Agregar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider select-none cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
