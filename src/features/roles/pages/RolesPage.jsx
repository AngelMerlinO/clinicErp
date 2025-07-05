import React, { useState, useEffect } from 'react';
import DataTable         from '../../../components/table/DataTable';
import Modal             from '../../../components/ui/Modal';
import LoadingButton     from '../../../components/ui/LoadingButton';
import FullscreenLoader  from '../../../components/ui/FullscreenLoader';
import clsx              from 'clsx';
import { rolesService }       from '../../../services/roles';
import { permissionsService } from '../../../services/permissions';

export default function RolesPage() {
  /* state */
  const [rows, setRows]             = useState([]);
  const [allPerms, setAllPerms]     = useState([]);
  const [loading, setLoading]       = useState(true);

  const [formOpen, setFormOpen]     = useState(false);
  const [editing, setEditing]       = useState(null);
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [saving, setSaving]         = useState(false);

  const [viewOpen, setViewOpen]     = useState(false);
  const [viewData, setViewData]     = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  /* initial load */
  useEffect(() => {
    (async () => {
      try {
        const [roleList, permList] = await Promise.all([
          rolesService.list(),
          permissionsService.list(),
        ]);
        setRows(roleList);
        setAllPerms(permList);
      } finally { setLoading(false); }
    })();
  }, []);

  const refresh = async () => setRows(await rolesService.list());

  /* columns */
  const columns = [
    { accessorKey: 'id',   header: 'ID' },
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'description', header: 'Descripción' },
    { accessorKey: 'permissions', header: 'Permisos',
      cell: ({ getValue }) => `${getValue()?.length ?? 0}` },
  ];

  /* CRUD */
  const handleSave = async payload => {
    setSaving(true);
    try {
      editing
        ? await rolesService.update(editing.id, payload)
        : await rolesService.create(payload);
      await refresh();
      setFormOpen(false);
    } finally { setSaving(false); }
  };
  const handleDelete = async id => {
    setDeletingId(id);
    try {
      await rolesService.remove(id);
      setRows(rows.filter(r => r.id !== id));
    } finally { setDeletingId(null); }
  };

  /* helpers */
  const groupByResource = perms =>
    perms.reduce((acc, p) => {
      (acc[p.resource] ||= []).push(p);
      return acc;
    }, {});

  /* render */
  return (
    <>
      <FullscreenLoader show={loading} />

      <DataTable
        title="Roles"
        columns={columns}
        data={rows}
        onAdd={()  => { setEditing(null); setSelectedPerms([]); setFormOpen(true); }}
        onView={row => { setViewData(row); setViewOpen(true); }}
        onEdit={row => {
          setEditing(row);
          setSelectedPerms(row.permissions?.map(p => p.id) || []);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* ─── Create / Edit modal ─── */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Role' : 'New Role'}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave({
              name:        e.target.name.value,
              description: e.target.description.value,
              permissionsIds: selectedPerms,
            });
          }}
          className="space-y-6"
        >
          {/* BASIC FIELDS */}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                defaultValue={editing?.name || ''}
                className="w-full border rounded-md px-3 py-2 focus:ring"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={editing?.description || ''}
                rows={3}
                className="w-full border rounded-md px-3 py-2 focus:ring resize-none"
              />
            </div>
          </div>

          {/* PERMISSIONS AREA */}
          <fieldset className="border rounded-md p-4 max-h-72 overflow-y-auto">
            <legend className="px-2 text-sm font-semibold">
              Permissions
              <span className="ml-2 inline-block bg-sky-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {selectedPerms.length}
              </span>
            </legend>

            {Object.entries(groupByResource(allPerms)).map(([resource, perms]) => (
              <details key={resource} className="mb-3" open>
                <summary className="cursor-pointer select-none text-sm font-medium text-gray-700 dark:text-gray-300">
                  {resource}
                </summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {perms.map(p => {
                    const checked = selectedPerms.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            setSelectedPerms(prev =>
                              e.target.checked
                                ? [...prev, p.id]
                                : prev.filter(id => id !== p.id)
                            );
                          }}
                        />
                        <span>{p.action}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
            ))}
          </fieldset>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              isLoading={saving}
              className="bg-sky-600 text-white hover:bg-sky-700"
            >
              Save
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* ─── View modal ─── */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Role Details">
        {viewData && (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                ['ID', viewData.id],
                ['Name', viewData.name],
                ['Description', viewData.description || '—'],
                ['Permissions', `${viewData.permissions?.length || 0}`],
              ].map(([k,v]) => (
                <div key={k}>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400">{k}</dt>
                  <dd className="text-sm mt-1">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Permission badges */}
            {viewData.permissions?.length ? (
              Object.entries(groupByResource(viewData.permissions)).map(([resource, perms]) => (
                <div key={resource} className="mb-4">
                  <h4 className="text-sm font-semibold mb-1">{resource}</h4>
                  <div className="flex flex-wrap gap-2">
                    {perms.map(p => (
                      <span
                        key={p.id}
                        className="bg-indigo-100 dark:bg-indigo-800/40 text-indigo-700 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full"
                      >
                        {p.action}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No permissions.</p>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
