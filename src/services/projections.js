import { api } from './api';

export const projectionsService = {
  list:    ()           => api.get('/projections'),
  get:     (id)         => api.get(`/projections/${id}`),
  create:  (payload)    => api.post('/projections', payload),
  update:  (id, payload)=> api.put(`/projections/${id}`, payload),
  remove:  (id)         => api.del(`/projections/${id}`),
};
