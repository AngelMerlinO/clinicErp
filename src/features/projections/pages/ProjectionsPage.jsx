import React, { useState, useEffect } from 'react';
import DataTable        from '../../../components/table/DataTable';
import Modal            from '../../../components/ui/Modal';
import FullscreenLoader from '../../../components/ui/FullscreenLoader';
import LoadingButton    from '../../../components/ui/LoadingButton';
import { projectionsService } from '../../../services/projections';

export default function ProjectionsPage() {
  /* ────────── state ────────── */
  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [formOpen,    setFormOpen]    = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);
  const [viewOpen,    setViewOpen]    = useState(false);
  const [viewData,    setViewData]    = useState(null);

  /* ────────── fetch list ───── */
  useEffect(() => {
    (async () => {
      try { setRows(await projectionsService.list()); }
      finally { setLoading(false); }
    })();
  }, []);

  const refresh = async () => setRows(await projectionsService.list());

  /* ────────── columns ──────── */
  const columns = [
    { accessorKey: 'id',    header: 'ID' },
    { accessorKey: 'name',  header: 'Nombre' },
    { accessorKey: 'price', header: 'Precio',
      cell: ({ getValue }) =>
        Number(getValue()).toLocaleString('es-MX', { style:'currency', currency:'MXN' }) },
    { accessorKey: 'is_active', header: 'Activo',
      cell: ({ getValue }) => getValue() ? 'Sí' : 'No' },
    { accessorKey: 'created_at', header: 'Creado',
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() },
  ];

  /* ────────── CRUD ─────────── */
  const handleSave = async payload => {
    setSaving(true);
    try {
      editing
        ? await projectionsService.update(editing.id, payload)
        : await projectionsService.create(payload);
      await refresh();
      setFormOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    setDeletingId(id);
    try {
      await projectionsService.remove(id);
      setRows(rows.filter(r => r.id !== id));
    } finally { setDeletingId(null); }
  };

  /* ────────── render ───────── */
  return (
    <>
      <FullscreenLoader show={loading} />

      <DataTable
        title="Proyecciones"
        columns={columns}
        data={rows}
        onAdd={()  => { setEditing(null); setFormOpen(true); }}
        onView={row => { setViewData(row); setViewOpen(true); }}
        onEdit={row => { setEditing(row); setFormOpen(true); }}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* Modal crear / editar */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Proyección' : 'Nueva Proyección'}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const payload = {
              name:      e.target.name.value,
              price:     parseFloat(e.target.price.value) || 0,
              is_active: e.target.is_active.checked ? 1 : 0,
            };
            handleSave(payload);
          }}
          className="grid gap-5"
        >
          <div>
            <label className="text-sm font-medium mb-1">Nombre</label>
            <input
              name="name"
              defaultValue={editing?.name || ''}
              className="border px-3 py-2 rounded-md w-full focus:ring"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Precio (MXN)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={editing?.price || ''}
              className="border px-3 py-2 rounded-md w-full focus:ring"
              required
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={editing?.is_active ?? true}
              className="h-4 w-4 text-sky-600"
            />
            Activo
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              Cancelar
            </button>
            <LoadingButton
              type="submit"
              isLoading={saving}
              className="bg-sky-600 text-white hover:bg-sky-700"
            >
              Guardar
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* Modal detalle */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle Proyección"
      >
        {viewData && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ['ID',          viewData.id],
              ['Nombre',      viewData.name],
              ['Precio',      Number(viewData.price).toLocaleString('es-MX',
                              { style:'currency', currency:'MXN' })],
              ['Activo',      viewData.is_active ? 'Sí' : 'No'],
              ['Creado',      new Date(viewData.created_at).toLocaleString()],
              ['Actualizado', new Date(viewData.updated_at).toLocaleString()],
              ['Eliminado',   viewData.deleted_at ? new Date(viewData.deleted_at).toLocaleString() : '—'],
            ].map(([k,v]) => (
              <div key={k}>
                <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </>
  );
}
