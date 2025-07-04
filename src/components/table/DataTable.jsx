// src/components/table/DataTable.jsx
import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';

/**
 * columns = [
 *   { accessorKey:'fullName', header:'Nombre' },
 *   ...
 * ]
 */
export default function DataTable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
}) {
  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: 'actions',
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(row.original)}
              className="text-indigo-600 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
        >
          + Agregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    className={clsx(
                      'px-6 py-3 text-left font-medium',
                      h.column.getIsSorted() && 'text-sky-600'
                    )}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{
                      asc: ' ▲',
                      desc: ' ▼',
                    }[h.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
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
