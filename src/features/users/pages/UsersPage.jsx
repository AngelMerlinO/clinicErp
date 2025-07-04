import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/table/DataTable';
import Modal from '../../../components/ui/Modal';

export default function UsersPage() {
  const [rows, setRows]       = useState([]);
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    // TODO: replace with real fetch
    setRows([{ id: 1, fullName: 'Admin', email: 'admin@mail.com' }]);
  }, []);

  const columns = [
    { accessorKey: 'fullName', header: 'Nombre' },
    { accessorKey: 'email',    header: 'Email'  },
  ];

  const handleSave = (payload) => {
    // TODO: call create / update then refresh rows
    setOpen(false);
  };

  return (
    <>
      <DataTable
        title="Usuarios"
        columns={columns}
        data={rows}
        onAdd={() => { setEditing(null); setOpen(true); }}
        onEdit={(row) => { setEditing(row); setOpen(true); }}
        onDelete={(id) => {/* TODO delete */}}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar usuario' : 'Nuevo usuario'}
      >
        {/* SIMPLE FORM MOCKUP */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave({});
          }}
          className="space-y-4"
        >
          <input
            defaultValue={editing?.fullName}
            placeholder="Nombre"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            defaultValue={editing?.email}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md"
          >
            Guardar
          </button>
        </form>
      </Modal>
    </>
  );
}
