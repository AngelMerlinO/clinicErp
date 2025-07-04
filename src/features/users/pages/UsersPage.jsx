import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/table/DataTable';
import Modal from '../../../components/ui/Modal';
import FullscreenLoader from '../../../components/ui/FullscreenLoader';
import LoadingButton from '../../../components/ui/LoadingButton';
import { usersService } from '../../../services/users';

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await usersService.list();
        setRows(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'fullName', header: 'Nombre' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'roleId', header: 'Rol', cell: ({ getValue }) => getValue() ?? '—' },
    { accessorKey: 'isActive', header: 'Activo', cell: ({ getValue }) => getValue() ? 'Sí' : 'No' },
    { accessorKey: 'createdAt', header: 'Creado', cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() },
  ];

  const refresh = async () => setRows(await usersService.list());

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) await usersService.update(editing.id, payload);
      else await usersService.create(payload);
      await refresh();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await usersService.remove(id);
      setRows(rows.filter(r => r.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <FullscreenLoader show={loading} />

      <DataTable
        title="Usuarios"
        columns={columns}
        data={rows}
        onAdd={() => { setEditing(null); setOpen(true); }}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload = {
              fullName: e.target.fullName.value,
              email: e.target.email.value,
              ...(editing ? {} : { passwordHash: e.target.password.value }),
              roleId: Number(e.target.roleId.value) || null,
              isActive: e.target.isActive.checked,
            };
            handleSave(payload);
          }}
          className="space-y-4"
        >
          <input
            name="fullName"
            defaultValue={editing?.fullName || ''}
            placeholder="Nombre completo"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          <input
            name="email"
            type="email"
            defaultValue={editing?.email || ''}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
          {!editing && (
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          )}
          <input
            name="roleId"
            type="number"
            defaultValue={editing?.roleId || ''}
            placeholder="Role ID"
            className="w-full border px-3 py-2 rounded-md"
          />
          <label className="flex items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={editing?.isActive ?? true}
            />
            Activo
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700">
              Cancelar
            </button>
            <LoadingButton type="submit" isLoading={saving} className="bg-sky-600 text-white hover:bg-sky-700">
              Guardar
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
  