import React, { useState, useEffect } from 'react';
import DataTable       from '../../../components/table/DataTable';
import Modal           from '../../../components/ui/Modal';
import FullscreenLoader from '../../../components/ui/FullscreenLoader';
import LoadingButton   from '../../../components/ui/LoadingButton';
import { costCentersService } from '../../../services/costCenters';

export default function CostCentersPage() {
  /* ─────────── state ─────────── */
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState(null);  // null ⇒ create
  const [saving,   setSaving]   = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [viewOpen,  setViewOpen]  = useState(false);
  const [viewData,  setViewData]  = useState(null);

  /* ─────────── fetch list ────── */
  useEffect(() => {
    (async () => {
      try {
        setRows(await costCentersService.list());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => setRows(await costCentersService.list());

  /* ─────────── table columns ─── */
  const columns = [
    { accessorKey: 'id',            header: 'ID' },
    { accessorKey: 'name',          header: 'Nombre' },
    { accessorKey: 'location',      header: 'Ubicación' },
    { accessorKey: 'phone',         header: 'Teléfono' },
    { accessorKey: 'prefix',        header: 'Prefijo' },
    { accessorKey: 'contact_email', header: 'Email Contacto' },
    { accessorKey: 'isActive', header: 'Activo',
      cell: ({ getValue }) => (getValue() ? 'Sí' : 'No') },
    { accessorKey: 'createdAt', header: 'Creado',
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() },
  ];

  /* ─────────── CRUD handlers ─── */
  const handleSave = async payload => {
    setSaving(true);
    try {
      editing
        ? await costCentersService.update(editing.id, payload)
        : await costCentersService.create(payload);
      await refresh();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    setDeletingId(id);
    try {
      await costCentersService.remove(id);
      setRows(rows.filter(r => r.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  /* ─────────── render ────────── */
  return (
    <>
      {/* global spinner */}
      <FullscreenLoader show={loading} />

      {/* table */}
      <DataTable
        title="Centros de Costo"
        columns={columns}
        data={rows}
        onAdd={() => { setEditing(null); setFormOpen(true); }}
        onView={row => { setViewData(row); setViewOpen(true); }}
        onEdit={row => { setEditing(row); setFormOpen(true); }}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* create / edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Centro de Costo' : 'Nuevo Centro de Costo'}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const payload = {
              name:           e.target.name.value,
              location:       e.target.location.value,
              phone:          e.target.phone.value,
              prefix:         e.target.prefix.value,
              contact_email:  e.target.contact_email.value,
              isActive:       e.target.isActive.checked,
            };
            handleSave(payload);
          }}
          className="grid gap-5"
        >
          {[
            { name: 'name',          label: 'Nombre',       required: true },
            { name: 'location',      label: 'Ubicación' },
            { name: 'phone',         label: 'Teléfono' },
            { name: 'prefix',        label: 'Prefijo' },
            { name: 'contact_email', label: 'Email Contacto', type: 'email' },
          ].map(f => (
            <div key={f.name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{f.label}</label>
              <input
                name={f.name}
                type={f.type || 'text'}
                defaultValue={editing?.[f.name] || ''}
                required={f.required}
                className="border rounded-md px-3 py-2 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800"
              />
            </div>
          ))}

          <label className="flex items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={editing?.isActive ?? true}
              className="h-4 w-4 text-sky-600 rounded"
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

      {/* view-details modal */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle Centro de Costo"
      >
        {viewData && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ['ID',              viewData.id],
              ['Nombre',          viewData.name],
              ['Ubicación',       viewData.location || '—'],
              ['Teléfono',        viewData.phone || '—'],
              ['Prefijo',         viewData.prefix || '—'],
              ['Email Contacto',  viewData.contact_email || '—'],
              ['Activo',          viewData.isActive ? 'Sí' : 'No'],
              ['Creado',          new Date(viewData.createdAt).toLocaleString()],
              ['Actualizado',     new Date(viewData.updatedAt).toLocaleString()],
              ['Eliminado',       viewData.deletedAt ? new Date(viewData.deletedAt).toLocaleString() : '—'],
            ].map(([k, v]) => (
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
