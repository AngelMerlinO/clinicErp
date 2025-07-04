import React, { useState, useEffect } from 'react';
import DataTable         from '../../../components/table/DataTable';
import Modal             from '../../../components/ui/Modal';
import FullscreenLoader  from '../../../components/ui/FullscreenLoader';
import LoadingButton     from '../../../components/ui/LoadingButton';
import { usersService }  from '../../../services/users';

export default function UsersPage() {
  /* ────────── state ────────── */
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  /* ────────── fetch list ───── */
  useEffect(() => {
    (async () => {
      try { setRows(await usersService.list()); }
      finally { setLoading(false); }
    })();
  }, []);

  const refresh = async () => setRows(await usersService.list());

  /* ────────── columns ──────── */
  const columns = [
    { accessorKey: 'id',        header: 'ID' },
    { accessorKey: 'fullName',  header: 'Nombre' },
    { accessorKey: 'email',     header: 'Email' },
    { accessorKey: 'roleId',    header: 'Rol',  cell: ({ getValue }) => getValue() ?? '—' },
    { accessorKey: 'isActive',  header: 'Activo', cell: ({ getValue }) => (getValue() ? 'Sí' : 'No') },
    { accessorKey: 'createdAt', header: 'Creado', cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() },
  ];

  /* ────────── CRUD ─────────── */
  const handleSave = async payload => {
    setSaving(true);
    try {
      editing
        ? await usersService.update(editing.id, payload)
        : await usersService.create(payload);
      await refresh();
      setFormOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    setDeletingId(id);
    try {
      await usersService.remove(id);
      setRows(rows.filter(r => r.id !== id));
    } finally { setDeletingId(null); }
  };

  /* ────────── render ───────── */
  return (
    <>
      <FullscreenLoader show={loading} />

      <DataTable
        title="Usuarios"
        columns={columns}
        data={rows}
        onAdd={()  => { setEditing(null); setFormOpen(true); }}
        onView={row => { setViewData(row); setViewOpen(true); }}
        onEdit={row => { setEditing(row); setFormOpen(true); }}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* ───── Modal Crear / Editar ───── */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const payload = {
              fullName:  e.target.fullName.value,
              email:     e.target.email.value,
              ...(editing ? {} : { passwordHash: e.target.password.value }),
              roleId:    Number(e.target.roleId.value) || null,
              isActive:  e.target.isActive.checked,
            };
            handleSave(payload);
          }}
          className="grid gap-5"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nombre completo</label>
            <input
              name="fullName"
              defaultValue={editing?.fullName || ''}
              className="border rounded-md px-3 py-2 focus:ring focus:ring-sky-200 dark:focus:ring-sky-800"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={editing?.email || ''}
              className="border rounded-md px-3 py-2 focus:ring"
              required
            />
          </div>

          {!editing && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                className="border rounded-md px-3 py-2 focus:ring"
                required
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Role ID</label>
            <input
              name="roleId"
              type="number"
              defaultValue={editing?.roleId || ''}
              className="border rounded-md px-3 py-2 focus:ring"
            />
          </div>

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

      {/* ───── Modal Detalle (solo lectura) ───── */}
      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle Usuario"
      >
        {viewData && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ['ID',          viewData.id],
              ['Nombre',      viewData.fullName],
              ['Email',       viewData.email],
              ['Rol ID',      viewData.roleId ?? '—'],
              ['Activo',      viewData.isActive ? 'Sí' : 'No'],
              ['Creado',      new Date(viewData.createdAt).toLocaleString()],
              ['Actualizado', new Date(viewData.updatedAt).toLocaleString()],
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
