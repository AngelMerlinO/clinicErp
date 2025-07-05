import { api } from './api';

export const rolesService = {
  list:    ()           => api.get('/roles'),
  get:     id           => api.get(`/roles/${id}`),
  create:  payload      => api.post('/roles', payload),     // { name, description, permissionsIds[] }
  update:  (id, payload)=> api.put(`/roles/${id}`, payload),
  remove:  id           => api.del(`/roles/${id}`),
};
