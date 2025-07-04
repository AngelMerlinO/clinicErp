// src/services/costCenters.js
import { api } from './api';

export const costCentersService = {
  list:    ()           => api.get('/cost-centers'),               // GET    /cost-centers
  get:     (id)         => api.get(`/cost-centers/${id}`),        // GET    /cost-centers/:id
  create:  (payload)    => api.post('/cost-centers', payload),     // POST   /cost-centers
  update:  (id, payload)=> api.put(`/cost-centers/${id}`, payload),// PUT    /cost-centers/:id
  remove:  (id)         => api.del(`/cost-centers/${id}`),         // DELETE /cost-centers/:id
};
